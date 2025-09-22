import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sessionManager } from '@/lib/collaboration/session-manager';
import { 
  CollaborationUser,
  PermissionLevel 
} from '@/types/collaboration';

// GET /api/collaboration/sessions/[id] - Get session details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = params.id;
    const collaborationSession = sessionManager.getSession(sessionId);

    if (!collaborationSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this session
    const hasAccess = collaborationSession.participants.some(
      p => p.id === session.user.id
    ) || collaborationSession.isPublic;

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({ session: collaborationSession });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/collaboration/sessions/[id] - Update session
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = params.id;
    const body = await request.json();
    const { 
      title, 
      description, 
      settings, 
      maxParticipants,
      language,
      difficulty,
      tags,
      isPublic 
    } = body;

    const collaborationSession = sessionManager.getSession(sessionId);
    if (!collaborationSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to update
    const user = collaborationSession.participants.find(p => p.id === session.user.id);
    if (!user || (user.permission !== 'ADMIN' && user.id !== collaborationSession.ownerId)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Update session properties
    if (title !== undefined) collaborationSession.title = title;
    if (description !== undefined) collaborationSession.description = description;
    if (settings !== undefined) collaborationSession.settings = { ...collaborationSession.settings, ...settings };
    if (maxParticipants !== undefined) collaborationSession.maxParticipants = maxParticipants;
    if (language !== undefined) collaborationSession.language = language;
    if (difficulty !== undefined) collaborationSession.difficulty = difficulty;
    if (tags !== undefined) collaborationSession.tags = tags;
    if (typeof isPublic === 'boolean') collaborationSession.isPublic = isPublic;

    return NextResponse.json({
      session: collaborationSession,
      message: 'Session updated successfully',
    });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/collaboration/sessions/[id] - Delete session
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = params.id;
    const collaborationSession = sessionManager.getSession(sessionId);

    if (!collaborationSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Check if user is the owner
    if (collaborationSession.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Only the session owner can delete the session' },
        { status: 403 }
      );
    }

    // End the session first
    const endResult = sessionManager.endSession(sessionId, session.user.id);
    if (!endResult.success) {
      return NextResponse.json(
        { error: endResult.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Session deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
