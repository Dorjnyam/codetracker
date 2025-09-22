import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ACHIEVEMENTS } from '@/lib/gamification/achievement-system';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // For now, return mock achievements based on user's actual data
    // In a real implementation, this would fetch from a user_achievements table
    const userAchievements = [
      {
        id: '1',
        userId: session.user.id,
        achievementId: 'first-login',
        unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        progress: {},
        isNotified: true,
        achievement: ACHIEVEMENTS[0],
      },
      {
        id: '2',
        userId: session.user.id,
        achievementId: 'github-connected',
        unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        progress: {},
        isNotified: true,
        achievement: ACHIEVEMENTS[1],
      },
    ];

    // Add GitHub-related achievement if user has GitHub connected
    if (session.user.githubUsername) {
      userAchievements.push({
        id: '3',
        userId: session.user.id,
        achievementId: 'github-integration',
        unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        progress: {},
        isNotified: true,
        achievement: ACHIEVEMENTS[2],
      });
    }

    return NextResponse.json(userAchievements);

  } catch (error) {
    console.error('Error fetching user achievements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user achievements' },
      { status: 500 }
    );
  }
}
