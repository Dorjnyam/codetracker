import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { username } = await params;

    // Fetch GitHub user data
    const githubResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'CodeTracker-App',
        // Add GitHub token if available for higher rate limits
        ...(process.env.GITHUB_TOKEN && { 'Authorization': `token ${process.env.GITHUB_TOKEN}` }),
      },
    });

    if (!githubResponse.ok) {
      if (githubResponse.status === 404) {
        return NextResponse.json(
          { error: 'GitHub user not found' },
          { status: 404 }
        );
      }
      
      if (githubResponse.status === 403) {
        return NextResponse.json(
          { 
            error: 'GitHub API rate limit exceeded or access denied',
            message: 'Please try again later or contact support if the issue persists'
          },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch GitHub user data' },
        { status: githubResponse.status }
      );
    }

    const githubData = await githubResponse.json();

    // Fetch additional GitHub data
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'CodeTracker-App',
      // Add GitHub token if available for higher rate limits
      ...(process.env.GITHUB_TOKEN && { 'Authorization': `token ${process.env.GITHUB_TOKEN}` }),
    };

    const [reposResponse, eventsResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers }),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, { headers }),
    ]);

    const repos = reposResponse.ok ? await reposResponse.json() : [];
    const events = eventsResponse.ok ? await eventsResponse.json() : [];

    // Calculate language statistics from repositories
    const languageStats: { [key: string]: number } = {};
    const totalSize = repos.reduce((total: number, repo: { language?: string; size?: number }) => {
      if (repo.language) {
        languageStats[repo.language] = (languageStats[repo.language] || 0) + (repo.size || 0);
        return total + (repo.size || 0);
      }
      return total;
    }, 0);

    // Calculate activity statistics
    const activityStats = {
      totalCommits: events.filter((event: { type: string }) => event.type === 'PushEvent').length,
      totalRepos: repos.length,
      totalStars: repos.reduce((total: number, repo: { stargazers_count?: number }) => total + (repo.stargazers_count || 0), 0),
      totalForks: repos.reduce((total: number, repo: { forks_count?: number }) => total + (repo.forks_count || 0), 0),
      languages: Object.entries(languageStats)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 10)
        .map(([language, size]) => ({
          language,
          size,
          percentage: ((size as number) / totalSize) * 100,
        })),
    };

    // Get recent repositories
    const recentRepos = repos
      .sort((a: { updated_at: string }, b: { updated_at: string }) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5)
      .map((repo: { id: number; name: string; full_name: string; description?: string; language?: string; stargazers_count?: number; forks_count?: number; updated_at: string; html_url: string; private: boolean }) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.updated_at,
        htmlUrl: repo.html_url,
        isPrivate: repo.private,
      }));

    // Get recent activity
    const recentActivity = events
      .slice(0, 10)
      .map((event: { id: string; type: string; repo?: { name: string }; created_at: string; actor?: { login: string } }) => ({
        id: event.id,
        type: event.type,
        repo: event.repo?.name,
        createdAt: event.created_at,
        actor: event.actor?.login,
      }));

    return NextResponse.json({
      ...githubData,
      activityStats,
      recentRepos,
      recentActivity,
    });

  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
