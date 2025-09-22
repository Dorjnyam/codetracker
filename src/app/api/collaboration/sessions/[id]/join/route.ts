import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sessionManager } from '@/lib/collaboration/session-manager';
import { CollaborationUser } from '@/types/collaboration';

// POST /api/collaboration/sessions/[id]/join - Join a session
export async function POST(
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
    const { inviteCode, permission } = body;

    // Mock current user
    const currentUser: CollaborationUser = {
      id: session.user.id,
      name: session.user.name || 'Unknown User',
      email: session.user.email || '',
      avatar: session.user.image || undefined,
      role: session.user.role || 'STUDENT',
      permission: permission || 'EDIT',
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

    // Join the session
    const result = sessionManager.joinSession(sessionId, currentUser, inviteCode);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      session: result.session,
      message: result.message,
    });
  } catch (error) {
    console.error('Error joining session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/collaboration/sessions/[id]/join - Leave a session
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

    // Leave the session
    const result = sessionManager.leaveSession(sessionId, session.user.id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: result.message,
    });
  } catch (error) {
    console.error('Error leaving session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
