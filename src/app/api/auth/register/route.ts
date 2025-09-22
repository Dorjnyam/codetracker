import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signUpSchema } from '@/lib/validations/auth';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signUpSchema.parse(body);

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: {
        email: validatedData.email.toLowerCase(),
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }


    // Generate username
    const username = validatedData.name.toLowerCase().replace(/\s+/g, '_') + '_' + 
      Math.random().toString(36).substring(2, 8);

    // Create user
    const user = await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        username,
        role: validatedData.role,
        totalXP: 0,
        level: 1,
        streak: 0,
        settings: JSON.stringify({
          theme: 'system',
          notifications: {
            email: true,
            push: true,
            assignments: true,
            achievements: true,
            collaborations: true,
          },
        }),
      },
    });

    // Create welcome activity
    await db.activity.create({
      data: {
        userId: user.id,
        type: 'SUBMISSION_CREATED', // Using existing enum
        description: 'Account created',
        metadata: JSON.stringify({ 
          method: 'email',
          role: validatedData.role 
        }),
        xpEarned: 10,
      },
    });

    // Send welcome email (don't await to avoid blocking)
    sendWelcomeEmail(user.email, user.name || 'there').catch(console.error);

    // Return user data
    const userWithoutPassword = user;

    return NextResponse.json(
      { 
        message: 'Account created successfully',
        user: userWithoutPassword 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);

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
