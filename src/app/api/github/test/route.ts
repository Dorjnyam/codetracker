import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Test GitHub API connection
    const testResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'CodeTracker-App',
      },
    });

    if (!testResponse.ok) {
      return NextResponse.json(
        { error: 'GitHub API connection failed' },
        { status: testResponse.status }
      );
    }

    const githubData = await testResponse.json();

    return NextResponse.json({
      message: 'GitHub API connection successful',
      user: session.user,
      githubData: {
        login: githubData.login,
        name: githubData.name,
        email: githubData.email,
        avatar_url: githubData.avatar_url,
        public_repos: githubData.public_repos,
        followers: githubData.followers,
        following: githubData.following,
      },
    });

  } catch (error) {
    console.error('GitHub test error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
