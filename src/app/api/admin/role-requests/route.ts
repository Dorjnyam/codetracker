import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING';

    // Get all role requests
    const roleRequests = await db.roleRequest.findMany({
      where: {
        status: status as 'PENDING' | 'APPROVED' | 'REJECTED',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(roleRequests);

  } catch (error) {
    console.error('Error fetching role requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch role requests' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { requestId, action, adminNotes } = body;

    if (!requestId || !action) {
      return NextResponse.json(
        { error: 'Request ID and action are required' },
        { status: 400 }
      );
    }

    // Get the role request
    const roleRequest = await db.roleRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!roleRequest) {
      return NextResponse.json(
        { error: 'Role request not found' },
        { status: 404 }
      );
    }

    if (roleRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Role request has already been processed' },
        { status: 400 }
      );
    }

    // Update the role request
    const updatedRequest = await db.roleRequest.update({
      where: { id: requestId },
      data: {
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
        adminNotes: adminNotes || '',
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
      },
    });

    // If approved, update user role
    if (action === 'approve') {
      await db.user.update({
        where: { id: roleRequest.userId },
        data: { role: 'TEACHER' },
      });
    }

    return NextResponse.json({
      message: `Role request ${action}d successfully`,
      request: updatedRequest,
    });

  } catch (error) {
    console.error('Error updating role request:', error);
    return NextResponse.json(
      { error: 'Failed to update role request' },
      { status: 500 }
    );
  }
}
