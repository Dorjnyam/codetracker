import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sessionManager } from '@/lib/collaboration/session-manager';
import { 
  CollaborationType, 
  SessionStatus, 
  PermissionLevel,
  CollaborationUser 
} from '@/types/collaboration';

// GET /api/collaboration/sessions - Get user's sessions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as CollaborationType | null;
    const status = searchParams.get('status') as SessionStatus | null;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Mock current user
    const currentUser: CollaborationUser = {
      id: session.user.id,
      name: session.user.name || 'Unknown User',
      email: session.user.email || '',
      avatar: session.user.image || undefined,
      role: session.user.role || 'STUDENT',
      permission: 'OWNER',
      connectionStatus: 'CONNECTED',
      joinedAt: new Date(),
      lastActiveAt: new Date(),
      isTyping: false,
      isSharingScreen: false,
      isMuted: false,
      isVideoEnabled: false,
      audioLevel: 0,
      networkQuality: 'EXCELLENT',
    };

    let sessions = sessionManager.getUserSessions(currentUser.id);

    // Apply filters
    if (type) {
      sessions = sessions.filter(s => s.type === type);
    }
    if (status) {
      sessions = sessions.filter(s => s.status === status);
    }

    // Apply pagination
    const paginatedSessions = sessions.slice(offset, offset + limit);

    return NextResponse.json({
      sessions: paginatedSessions,
      total: sessions.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/collaboration/sessions - Create new session
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, 
      description, 
      type, 
      settings, 
      maxParticipants,
      language,
      difficulty,
      tags,
      isPublic 
    } = body;

    // Validate required fields
    if (!title || !type) {
      return NextResponse.json(
        { error: 'Title and type are required' },
        { status: 400 }
      );
    }

    // Mock current user
    const currentUser: CollaborationUser = {
      id: session.user.id,
      name: session.user.name || 'Unknown User',
      email: session.user.email || '',
      avatar: session.user.image || undefined,
      role: session.user.role || 'STUDENT',
      permission: 'OWNER',
      connectionStatus: 'CONNECTED',
      joinedAt: new Date(),
      lastActiveAt: new Date(),
      isTyping: false,
      isSharingScreen: false,
      isMuted: false,
      isVideoEnabled: false,
      audioLevel: 0,
      networkQuality: 'EXCELLENT',
    };

    // Create session
    const newSession = sessionManager.createSession(
      currentUser.id,
      currentUser,
      title,
      type as CollaborationType,
      settings,
      description
    );

    // Update additional properties if provided
    if (maxParticipants) {
      newSession.maxParticipants = maxParticipants;
    }
    if (language) {
      newSession.language = language;
    }
    if (difficulty) {
      newSession.difficulty = difficulty;
    }
    if (tags) {
      newSession.tags = tags;
    }
    if (typeof isPublic === 'boolean') {
      newSession.isPublic = isPublic;
    }

    return NextResponse.json({
      session: newSession,
      message: 'Session created successfully',
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
