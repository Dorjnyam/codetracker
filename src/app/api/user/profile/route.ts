import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { updateProfileSchema } from '@/lib/validations/auth';

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // Check if GitHub username is already taken by another user
    if (validatedData.githubUsername) {
      const existingUser = await db.user.findFirst({
        where: {
          githubUsername: validatedData.githubUsername,
          NOT: {
            id: session.user.id,
          },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'GitHub username is already taken' },
          { status: 400 }
        );
      }
    }

    // Update user profile
    const updatedUser = await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: validatedData.name,
        bio: validatedData.bio,
        githubUsername: validatedData.githubUsername,
        institution: validatedData.institution,
        preferredLanguages: validatedData.preferredLanguages?.join(',') || '',
        updatedAt: new Date(),
      },
    });

    // Create activity log
    await db.activity.create({
      data: {
        userId: session.user.id,
        type: 'SUBMISSION_CREATED', // Using existing enum
        description: 'Profile updated',
        metadata: JSON.stringify({
          fields: Object.keys(validatedData),
        }),
        xpEarned: 5,
      },
    });

    // Return updated user data
    const userWithoutPassword = updatedUser;

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error('Profile update error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        bio: true,
        githubUsername: true,
        institution: true,
        preferredLanguages: true,
        image: true,
        role: true,
        totalXP: true,
        level: true,
        streak: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
