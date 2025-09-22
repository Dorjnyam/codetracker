import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

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
    const { theme, notifications } = body;

    // Get current user settings
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { settings: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Parse current settings
    const currentSettings = JSON.parse(user.settings || '{}');

    // Update settings
    const updatedSettings = {
      ...currentSettings,
      ...(theme && { theme }),
      ...(notifications && { notifications }),
    };

    // Update user settings in database
    await db.user.update({
      where: { id: session.user.id },
      data: {
        settings: JSON.stringify(updatedSettings),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Settings updated successfully',
      settings: updatedSettings,
    });

  } catch (error) {
    console.error('Settings update error:', error);
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
      where: { id: session.user.id },
      select: { settings: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const settings = JSON.parse(user.settings || '{}');

    return NextResponse.json({ settings });

  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
