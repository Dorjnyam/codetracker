import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sessionManager } from '@/lib/collaboration/session-manager';

// POST /api/collaboration/sessions/[id]/control - Control session (start/end/pause)
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
    const { action } = body;

    if (!action || !['start', 'end', 'pause', 'resume'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be start, end, pause, or resume' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'start':
        result = sessionManager.startSession(sessionId, session.user.id);
        break;
      case 'end':
        result = sessionManager.endSession(sessionId, session.user.id);
        break;
      case 'pause':
        // Note: Pause functionality would need to be implemented in sessionManager
        result = { success: false, message: 'Pause functionality not implemented' };
        break;
      case 'resume':
        // Note: Resume functionality would need to be implemented in sessionManager
        result = { success: false, message: 'Resume functionality not implemented' };
        break;
      default:
        result = { success: false, message: 'Invalid action' };
    }

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
    console.error('Error controlling session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
