'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GitCommit, 
  GitBranch, 
  Users, 
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Code,
  FileText,
  Plus,
  Minus,
  RefreshCw,
  Filter,
  Download,
  Eye,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Star,
  GitFork,
  GitPullRequest,
  GitMerge,
  History,
  Zap
} from 'lucide-react';
import { 
  GitHubCommit, 
  CommitAnalytics, 
  ContributorAnalytics,
  RepositoryAnalytics
} from '@/types/github';
import { cn } from '@/lib/utils';

interface CommitTrackerProps {
  repositoryId: number;
  owner: string;
  repo: string;
  className?: string;
}

export function CommitTracker({ repositoryId, owner, repo, className }: CommitTrackerProps) {
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [analytics, setAnalytics] = useState<CommitAnalytics | null>(null);
  const [contributors, setContributors] = useState<ContributorAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recent');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock data for demonstration
  const mockCommits: GitHubCommit[] = [
    {
      sha: 'abc123def456',
      nodeId: 'C_kwDOABC123',
      commit: {
        author: {
          name: 'Alice Johnson',
          email: 'alice@example.com',
          date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        committer: {
          name: 'Alice Johnson',
          email: 'alice@example.com',
          date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        message: 'feat: add user authentication system\n\n- Implement JWT token handling\n- Add login/logout functionality\n- Update user profile management',
        tree: {
          sha: 'def456ghi789',
          url: 'https://api.github.com/repos/owner/repo/git/trees/def456ghi789',
        },
        url: 'https://api.github.com/repos/owner/repo/git/commits/abc123def456',
        commentCount: 0,
      },
      author: {
        id: 1,
        login: 'alice',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
        publicRepos: 15,
        publicGists: 5,
        followers: 25,
        following: 30,
        createdAt: '2020-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      committer: {
        id: 1,
        login: 'alice',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
        publicRepos: 15,
        publicGists: 5,
        followers: 25,
        following: 30,
        createdAt: '2020-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      parents: [],
      stats: {
        additions: 150,
        deletions: 25,
        total: 175,
      },
      files: [
        {
          sha: 'file123',
          filename: 'src/auth/auth.ts',
          status: 'added',
          additions: 100,
          deletions: 0,
          changes: 100,
          blobUrl: 'https://github.com/owner/repo/blob/abc123def456/src/auth/auth.ts',
          rawUrl: 'https://raw.githubusercontent.com/owner/repo/abc123def456/src/auth/auth.ts',
          contentsUrl: 'https://api.github.com/repos/owner/repo/contents/src/auth/auth.ts',
        },
        {
          sha: 'file456',
          filename: 'src/components/LoginForm.tsx',
          status: 'modified',
          additions: 50,
          deletions: 25,
          changes: 75,
          blobUrl: 'https://github.com/owner/repo/blob/abc123def456/src/components/LoginForm.tsx',
          rawUrl: 'https://raw.githubusercontent.com/owner/repo/abc123def456/src/components/LoginForm.tsx',
          contentsUrl: 'https://api.github.com/repos/owner/repo/contents/src/components/LoginForm.tsx',
        },
      ],
      htmlUrl: 'https://github.com/owner/repo/commit/abc123def456',
      commentsUrl: 'https://api.github.com/repos/owner/repo/commits/abc123def456/comments',
    },
    {
      sha: 'def456ghi789',
      nodeId: 'C_kwDODEF456',
      commit: {
        author: {
          name: 'Bob Smith',
          email: 'bob@example.com',
          date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
        committer: {
          name: 'Bob Smith',
          email: 'bob@example.com',
          date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
        message: 'fix: resolve authentication bug in login flow',
        tree: {
          sha: 'ghi789jkl012',
          url: 'https://api.github.com/repos/owner/repo/git/trees/ghi789jkl012',
        },
        url: 'https://api.github.com/repos/owner/repo/git/commits/def456ghi789',
        commentCount: 2,
      },
      author: {
        id: 2,
        login: 'bob',
        name: 'Bob Smith',
        email: 'bob@example.com',
        avatarUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
        publicRepos: 8,
        publicGists: 2,
        followers: 15,
        following: 20,
        createdAt: '2021-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      committer: {
        id: 2,
        login: 'bob',
        name: 'Bob Smith',
        email: 'bob@example.com',
        avatarUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
        publicRepos: 8,
        publicGists: 2,
        followers: 15,
        following: 20,
        createdAt: '2021-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      parents: [{ sha: 'abc123def456', url: 'https://api.github.com/repos/owner/repo/commits/abc123def456', htmlUrl: 'https://github.com/owner/repo/commit/abc123def456' }],
      stats: {
        additions: 25,
        deletions: 10,
        total: 35,
      },
      files: [
        {
          sha: 'file789',
          filename: 'src/auth/auth.ts',
          status: 'modified',
          additions: 25,
          deletions: 10,
          changes: 35,
          blobUrl: 'https://github.com/owner/repo/blob/def456ghi789/src/auth/auth.ts',
          rawUrl: 'https://raw.githubusercontent.com/owner/repo/def456ghi789/src/auth/auth.ts',
          contentsUrl: 'https://api.github.com/repos/owner/repo/contents/src/auth/auth.ts',
        },
      ],
      htmlUrl: 'https://github.com/owner/repo/commit/def456ghi789',
      commentsUrl: 'https://api.github.com/repos/owner/repo/commits/def456ghi789/comments',
    },
  ];

  const mockAnalytics: CommitAnalytics = {
    total: 156,
    additions: 2840,
    deletions: 1250,
    authors: [
      {
        author: {
          id: 1,
          login: 'alice',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
          publicRepos: 15,
          publicGists: 5,
          followers: 25,
          following: 30,
          createdAt: '2020-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        total: 89,
        weeks: [
          { week: 1, total: 12, additions: 150, deletions: 25 },
          { week: 2, total: 8, additions: 120, deletions: 30 },
          { week: 3, total: 15, additions: 200, deletions: 40 },
        ],
      },
      {
        author: {
          id: 2,
          login: 'bob',
          name: 'Bob Smith',
          email: 'bob@example.com',
          avatarUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
          publicRepos: 8,
          publicGists: 2,
          followers: 15,
          following: 20,
          createdAt: '2021-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        total: 67,
        weeks: [
          { week: 1, total: 10, additions: 100, deletions: 20 },
          { week: 2, total: 12, additions: 130, deletions: 25 },
          { week: 3, total: 8, additions: 80, deletions: 15 },
        ],
      },
    ],
    weekly: [
      { week: 1, total: 22, additions: 250, deletions: 45 },
      { week: 2, total: 20, additions: 250, deletions: 55 },
      { week: 3, total: 23, additions: 280, deletions: 55 },
    ],
    daily: [
      { date: '2024-01-01', total: 5, additions: 60, deletions: 10 },
      { date: '2024-01-02', total: 8, additions: 100, deletions: 20 },
      { date: '2024-01-03', total: 3, additions: 40, deletions: 8 },
    ],
  };

  const mockContributors: ContributorAnalytics[] = [
    {
      author: {
        id: 1,
        login: 'alice',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
        publicRepos: 15,
        publicGists: 5,
        followers: 25,
        following: 30,
        createdAt: '2020-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      total: 89,
      weeks: [
        { week: 1, total: 12, additions: 150, deletions: 25 },
        { week: 2, total: 8, additions: 120, deletions: 30 },
        { week: 3, total: 15, additions: 200, deletions: 40 },
      ],
      additions: 1250,
      deletions: 450,
      commits: 89,
    },
    {
      author: {
        id: 2,
        login: 'bob',
        name: 'Bob Smith',
        email: 'bob@example.com',
        avatarUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
        publicRepos: 8,
        publicGists: 2,
        followers: 15,
        following: 20,
        createdAt: '2021-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      total: 67,
      weeks: [
        { week: 1, total: 10, additions: 100, deletions: 20 },
        { week: 2, total: 12, additions: 130, deletions: 25 },
        { week: 3, total: 8, additions: 80, deletions: 15 },
      ],
      additions: 890,
      deletions: 320,
      commits: 67,
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCommits(mockCommits);
        setAnalytics(mockAnalytics);
        setContributors(mockContributors);
      } catch (error) {
        console.error('Failed to load commit data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [repositoryId, timeRange]);

  const formatCommitMessage = (message: string) => {
    const lines = message.split('\n');
    const title = lines[0];
    const body = lines.slice(1).join('\n').trim();
    
    return { title, body };
  };

  const getCommitType = (message: string) => {
    const type = message.split(':')[0].toLowerCase();
    const typeMap: Record<string, { icon: React.ReactNode; color: string }> = {
      feat: { icon: <Plus className="h-3 w-3" />, color: 'text-green-600 dark:text-green-400' },
      fix: { icon: <CheckCircle className="h-3 w-3" />, color: 'text-red-600 dark:text-red-400' },
      docs: { icon: <FileText className="h-3 w-3" />, color: 'text-blue-600 dark:text-blue-400' },
      style: { icon: <Code className="h-3 w-3" />, color: 'text-purple-600 dark:text-purple-400' },
      refactor: { icon: <RefreshCw className="h-3 w-3" />, color: 'text-orange-600 dark:text-orange-400' },
      test: { icon: <AlertCircle className="h-3 w-3" />, color: 'text-yellow-600 dark:text-yellow-400' },
      chore: { icon: <Zap className="h-3 w-3" />, color: 'text-gray-600 dark:text-gray-400' },
    };
    
    return typeMap[type] || { icon: <GitCommit className="h-3 w-3" />, color: 'text-gray-600 dark:text-gray-400' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading commit data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Commit History</h2>
          <p className="text-muted-foreground">
            Track code changes and development activity
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Analytics Summary */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <GitCommit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{analytics.total}</div>
                  <div className="text-sm text-muted-foreground">Total Commits</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
                  <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{analytics.additions.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Lines Added</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950">
                  <Minus className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{analytics.deletions.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Lines Deleted</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{analytics.authors.length}</div>
                  <div className="text-sm text-muted-foreground">Contributors</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">Recent Commits</TabsTrigger>
          <TabsTrigger value="contributors">Contributors</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Recent Commits */}
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Commits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commits.map((commit) => {
                  const { title, body } = formatCommitMessage(commit.commit.message);
                  const commitType = getCommitType(title);
                  
                  return (
                    <div key={commit.sha} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-shrink-0">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={commit.author?.avatarUrl} />
                          <AvatarFallback>
                            {commit.author?.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={cn('flex items-center gap-1', commitType.color)}>
                            {commitType.icon}
                            <span className="text-sm font-medium">{title}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {commit.sha.substring(0, 7)}
                          </Badge>
                        </div>
                        
                        {body && (
                          <p className="text-sm text-muted-foreground mb-2 whitespace-pre-wrap">
                            {body}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(commit.commit.author.date)}
                          </div>
                          
                          {commit.stats && (
                            <div className="flex items-center gap-2">
                              <span className="text-green-600 dark:text-green-400">
                                +{commit.stats.additions}
                              </span>
                              <span className="text-red-600 dark:text-red-400">
                                -{commit.stats.deletions}
                              </span>
                            </div>
                          )}
                          
                          {commit.files && (
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {commit.files.length} file{commit.files.length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <Button variant="outline" size="sm" asChild>
                          <a href={commit.htmlUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </a>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contributors */}
        <TabsContent value="contributors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Contributors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contributors.map((contributor) => (
                  <div key={contributor.author.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contributor.author.avatarUrl} />
                        <AvatarFallback>
                          {contributor.author.name?.charAt(0) || contributor.author.login.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="font-medium">{contributor.author.name || contributor.author.login}</div>
                        <div className="text-sm text-muted-foreground">@{contributor.author.login}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold">{contributor.commits}</div>
                        <div className="text-xs text-muted-foreground">Commits</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          +{contributor.additions.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Additions</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600 dark:text-red-400">
                          -{contributor.deletions.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Deletions</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Weekly Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.weekly.map((week, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Week {week.week}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">{week.total} commits</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-green-600 dark:text-green-400">
                            +{week.additions}
                          </span>
                          <span className="text-xs text-red-600 dark:text-red-400">
                            -{week.deletions}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Daily Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.daily.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {new Date(day.date).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">{day.total} commits</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-green-600 dark:text-green-400">
                            +{day.additions}
                          </span>
                          <span className="text-xs text-red-600 dark:text-red-400">
                            -{day.deletions}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
