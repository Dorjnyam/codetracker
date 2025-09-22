import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reason, institution, experience } = body;

    // Check if user already has a pending request
    const existingRequest = await db.roleRequest.findFirst({
      where: {
        userId: session.user.id,
        status: 'PENDING',
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending role request' },
        { status: 400 }
      );
    }

    // Create role request
    const roleRequest = await db.roleRequest.create({
      data: {
        userId: session.user.id,
        requestedRole: 'TEACHER',
        reason: reason || '',
        institution: institution || '',
        experience: experience || '',
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      message: 'Role request submitted successfully',
      request: roleRequest,
    });

  } catch (error) {
    console.error('Error creating role request:', error);
    return NextResponse.json(
      { error: 'Failed to submit role request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's role requests
    const roleRequests = await db.roleRequest.findMany({
      where: {
        userId: session.user.id,
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
