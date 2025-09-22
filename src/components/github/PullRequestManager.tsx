'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GitPullRequest, 
  GitMerge, 
  MessageSquare, 
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  Plus,
  Minus,
  Eye,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Calendar,
  GitBranch,
  RefreshCw,
  Filter,
  Search,
  Download,
  Share,
  Star,
  GitFork,
  History,
  Zap,
  Target,
  Award
} from 'lucide-react';
import { 
  GitHubPullRequest, 
  GitHubReview, 
  GitHubComment,
  PullRequestAnalytics
} from '@/types/github';
import { cn } from '@/lib/utils';

interface PullRequestManagerProps {
  repositoryId: number;
  owner: string;
  repo: string;
  className?: string;
}

export function PullRequestManager({ repositoryId, owner, repo, className }: PullRequestManagerProps) {
  const [pullRequests, setPullRequests] = useState<GitHubPullRequest[]>([]);
  const [reviews, setReviews] = useState<GitHubReview[]>([]);
  const [comments, setComments] = useState<GitHubComment[]>([]);
  const [analytics, setAnalytics] = useState<PullRequestAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('open');
  const [filterState, setFilterState] = useState<'open' | 'closed' | 'all'>('open');

  // Mock data for demonstration
  const mockPullRequests: GitHubPullRequest[] = [
    {
      id: 1,
      nodeId: 'PR_kwDOABC123',
      number: 42,
      state: 'open',
      locked: false,
      title: 'feat: implement user authentication system',
      body: 'This PR implements a comprehensive user authentication system with JWT tokens, login/logout functionality, and user profile management.\n\n## Changes\n- Add JWT token handling\n- Implement login/logout functionality\n- Update user profile management\n- Add password reset functionality\n\n## Testing\n- [x] Unit tests pass\n- [x] Integration tests pass\n- [x] Manual testing completed\n\n## Screenshots\n![Login Form](https://example.com/screenshot.png)',
      user: {
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
      assignees: [],
      requestedReviewers: [
        {
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
      ],
      requestedTeams: [],
      labels: [
        {
          id: 1,
          nodeId: 'LA_kwDOABC123',
          url: 'https://api.github.com/repos/owner/repo/labels/enhancement',
          name: 'enhancement',
          description: 'New feature or request',
          color: 'a2eeef',
          default: false,
        },
        {
          id: 2,
          nodeId: 'LA_kwDODEF456',
          url: 'https://api.github.com/repos/owner/repo/labels/frontend',
          name: 'frontend',
          description: 'Frontend related changes',
          color: '7057ff',
          default: false,
        },
      ],
      milestone: undefined,
      draft: false,
      merged: false,
      mergeable: true,
      rebaseable: true,
      mergeableState: 'clean',
      mergedBy: undefined,
      mergeCommitSha: undefined,
      head: {
        label: 'alice:feature/auth-system',
        ref: 'feature/auth-system',
        sha: 'abc123def456',
        user: {
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
        repo: {
          id: 1,
          name: 'repo',
          fullName: 'owner/repo',
          description: 'Main repository',
          htmlUrl: 'https://github.com/owner/repo',
          cloneUrl: 'https://github.com/owner/repo.git',
          sshUrl: 'git@github.com:owner/repo.git',
          language: 'TypeScript',
          stargazersCount: 25,
          forksCount: 5,
          watchersCount: 30,
          openIssuesCount: 3,
          size: 1024,
          defaultBranch: 'main',
          visibility: 'public',
          isPrivate: false,
          isFork: false,
          isTemplate: false,
          hasIssues: true,
          hasProjects: true,
          hasWiki: true,
          hasPages: false,
          hasDownloads: true,
          allowSquashMerge: true,
          allowMergeCommit: true,
          allowRebaseMerge: true,
          allowAutoMerge: false,
          deleteBranchOnMerge: true,
          createdAt: '2020-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          owner: {
            id: 1,
            login: 'owner',
            name: 'Repository Owner',
            email: 'owner@example.com',
            avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
            publicRepos: 10,
            publicGists: 2,
            followers: 50,
            following: 25,
            createdAt: '2019-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        },
      },
      base: {
        label: 'owner:main',
        ref: 'main',
        sha: 'def456ghi789',
        user: {
          id: 1,
          login: 'owner',
          name: 'Repository Owner',
          email: 'owner@example.com',
          avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
          publicRepos: 10,
          publicGists: 2,
          followers: 50,
          following: 25,
          createdAt: '2019-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        repo: {
          id: 1,
          name: 'repo',
          fullName: 'owner/repo',
          description: 'Main repository',
          htmlUrl: 'https://github.com/owner/repo',
          cloneUrl: 'https://github.com/owner/repo.git',
          sshUrl: 'git@github.com:owner/repo.git',
          language: 'TypeScript',
          stargazersCount: 25,
          forksCount: 5,
          watchersCount: 30,
          openIssuesCount: 3,
          size: 1024,
          defaultBranch: 'main',
          visibility: 'public',
          isPrivate: false,
          isFork: false,
          isTemplate: false,
          hasIssues: true,
          hasProjects: true,
          hasWiki: true,
          hasPages: false,
          hasDownloads: true,
          allowSquashMerge: true,
          allowMergeCommit: true,
          allowRebaseMerge: true,
          allowAutoMerge: false,
          deleteBranchOnMerge: true,
          createdAt: '2020-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          owner: {
            id: 1,
            login: 'owner',
            name: 'Repository Owner',
            email: 'owner@example.com',
            avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
            publicRepos: 10,
            publicGists: 2,
            followers: 50,
            following: 25,
            createdAt: '2019-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        },
      },
      commits: 8,
      additions: 450,
      deletions: 120,
      changedFiles: 12,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      closedAt: undefined,
      mergedAt: undefined,
      htmlUrl: 'https://github.com/owner/repo/pull/42',
      diffUrl: 'https://github.com/owner/repo/pull/42.diff',
      patchUrl: 'https://github.com/owner/repo/pull/42.patch',
      issueUrl: 'https://api.github.com/repos/owner/repo/issues/42',
      reviewCommentsUrl: 'https://api.github.com/repos/owner/repo/pulls/42/comments',
      commentsUrl: 'https://api.github.com/repos/owner/repo/issues/42/comments',
      statusesUrl: 'https://api.github.com/repos/owner/repo/statuses/abc123def456',
      authorAssociation: 'CONTRIBUTOR',
    },
    {
      id: 2,
      nodeId: 'PR_kwDODEF456',
      number: 41,
      state: 'closed',
      locked: false,
      title: 'fix: resolve authentication bug in login flow',
      body: 'This PR fixes a critical bug in the login flow where users were unable to authenticate properly.\n\n## Problem\nUsers were experiencing authentication failures due to incorrect token validation.\n\n## Solution\n- Fixed token validation logic\n- Updated error handling\n- Added proper logging\n\n## Testing\n- [x] Unit tests pass\n- [x] Manual testing completed',
      user: {
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
      assignees: [],
      requestedReviewers: [],
      requestedTeams: [],
      labels: [
        {
          id: 3,
          nodeId: 'LA_kwDOGHI789',
          url: 'https://api.github.com/repos/owner/repo/labels/bug',
          name: 'bug',
          description: 'Something isn\'t working',
          color: 'd73a4a',
          default: true,
        },
      ],
      milestone: undefined,
      draft: false,
      merged: true,
      mergeable: undefined,
      rebaseable: undefined,
      mergeableState: 'clean',
      mergedBy: {
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
      mergeCommitSha: 'ghi789jkl012',
      head: {
        label: 'bob:fix/auth-bug',
        ref: 'fix/auth-bug',
        sha: 'jkl012mno345',
        user: {
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
        repo: {
          id: 1,
          name: 'repo',
          fullName: 'owner/repo',
          description: 'Main repository',
          htmlUrl: 'https://github.com/owner/repo',
          cloneUrl: 'https://github.com/owner/repo.git',
          sshUrl: 'git@github.com:owner/repo.git',
          language: 'TypeScript',
          stargazersCount: 25,
          forksCount: 5,
          watchersCount: 30,
          openIssuesCount: 3,
          size: 1024,
          defaultBranch: 'main',
          visibility: 'public',
          isPrivate: false,
          isFork: false,
          isTemplate: false,
          hasIssues: true,
          hasProjects: true,
          hasWiki: true,
          hasPages: false,
          hasDownloads: true,
          allowSquashMerge: true,
          allowMergeCommit: true,
          allowRebaseMerge: true,
          allowAutoMerge: false,
          deleteBranchOnMerge: true,
          createdAt: '2020-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          owner: {
            id: 1,
            login: 'owner',
            name: 'Repository Owner',
            email: 'owner@example.com',
            avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
            publicRepos: 10,
            publicGists: 2,
            followers: 50,
            following: 25,
            createdAt: '2019-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        },
      },
      base: {
        label: 'owner:main',
        ref: 'main',
        sha: 'def456ghi789',
        user: {
          id: 1,
          login: 'owner',
          name: 'Repository Owner',
          email: 'owner@example.com',
          avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
          publicRepos: 10,
          publicGists: 2,
          followers: 50,
          following: 25,
          createdAt: '2019-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        repo: {
          id: 1,
          name: 'repo',
          fullName: 'owner/repo',
          description: 'Main repository',
          htmlUrl: 'https://github.com/owner/repo',
          cloneUrl: 'https://github.com/owner/repo.git',
          sshUrl: 'git@github.com:owner/repo.git',
          language: 'TypeScript',
          stargazersCount: 25,
          forksCount: 5,
          watchersCount: 30,
          openIssuesCount: 3,
          size: 1024,
          defaultBranch: 'main',
          visibility: 'public',
          isPrivate: false,
          isFork: false,
          isTemplate: false,
          hasIssues: true,
          hasProjects: true,
          hasWiki: true,
          hasPages: false,
          hasDownloads: true,
          allowSquashMerge: true,
          allowMergeCommit: true,
          allowRebaseMerge: true,
          allowAutoMerge: false,
          deleteBranchOnMerge: true,
          createdAt: '2020-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          owner: {
            id: 1,
            login: 'owner',
            name: 'Repository Owner',
            email: 'owner@example.com',
            avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
            publicRepos: 10,
            publicGists: 2,
            followers: 50,
            following: 25,
            createdAt: '2019-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        },
      },
      commits: 3,
      additions: 25,
      deletions: 10,
      changedFiles: 2,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      closedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      mergedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      htmlUrl: 'https://github.com/owner/repo/pull/41',
      diffUrl: 'https://github.com/owner/repo/pull/41.diff',
      patchUrl: 'https://github.com/owner/repo/pull/41.patch',
      issueUrl: 'https://api.github.com/repos/owner/repo/issues/41',
      reviewCommentsUrl: 'https://api.github.com/repos/owner/repo/pulls/41/comments',
      commentsUrl: 'https://api.github.com/repos/owner/repo/issues/41/comments',
      statusesUrl: 'https://api.github.com/repos/owner/repo/statuses/jkl012mno345',
      authorAssociation: 'CONTRIBUTOR',
    },
  ];

  const mockAnalytics: PullRequestAnalytics = {
    total: 156,
    open: 12,
    closed: 134,
    merged: 98,
    averageTimeToMerge: 2.5, // days
    averageTimeToClose: 3.2, // days
    byAuthor: [
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
        total: 45,
        open: 3,
        closed: 42,
        merged: 38,
        averageTimeToMerge: 2.1,
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
        total: 32,
        open: 2,
        closed: 30,
        merged: 28,
        averageTimeToMerge: 2.8,
      },
    ],
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPullRequests(mockPullRequests);
        setAnalytics(mockAnalytics);
      } catch (error) {
        console.error('Failed to load pull request data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [repositoryId, filterState]);

  const getStateIcon = (state: string, merged: boolean) => {
    if (merged) {
      return <GitMerge className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
    }
    
    switch (state) {
      case 'open':
        return <GitPullRequest className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'closed':
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return <GitPullRequest className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getStateColor = (state: string, merged: boolean) => {
    if (merged) {
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    }
    
    switch (state) {
      case 'open':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'closed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
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

  const filteredPullRequests = pullRequests.filter(pr => {
    if (filterState === 'all') return true;
    if (filterState === 'open') return pr.state === 'open';
    if (filterState === 'closed') return pr.state === 'closed';
    return true;
  });

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading pull requests...</span>
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
          <h2 className="text-2xl font-bold">Pull Requests</h2>
          <p className="text-muted-foreground">
            Manage code reviews and collaboration
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value as any)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="all">All</option>
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
                  <GitPullRequest className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{analytics.total}</div>
                  <div className="text-sm text-muted-foreground">Total PRs</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{analytics.open}</div>
                  <div className="text-sm text-muted-foreground">Open</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950">
                  <GitMerge className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{analytics.merged}</div>
                  <div className="text-sm text-muted-foreground">Merged</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950">
                  <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{analytics.averageTimeToMerge}d</div>
                  <div className="text-sm text-muted-foreground">Avg Merge Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="open">Open PRs</TabsTrigger>
          <TabsTrigger value="closed">Closed PRs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Open Pull Requests */}
        <TabsContent value="open" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitPullRequest className="h-5 w-5" />
                Open Pull Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPullRequests.filter(pr => pr.state === 'open').map((pr) => (
                  <div key={pr.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0">
                      {getStateIcon(pr.state, pr.merged)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium truncate">{pr.title}</h3>
                        <Badge className={getStateColor(pr.state, pr.merged)}>
                          #{pr.number}
                        </Badge>
                        {pr.draft && (
                          <Badge variant="outline">Draft</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mb-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Avatar className="h-4 w-4">
                            <AvatarImage src={pr.user.avatarUrl} />
                            <AvatarFallback>{pr.user.name?.charAt(0) || pr.user.login.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{pr.user.name || pr.user.login}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <GitBranch className="h-3 w-3" />
                          <span>{pr.head.ref}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(pr.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Plus className="h-3 w-3 text-green-600 dark:text-green-400" />
                          <span>{pr.additions}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Minus className="h-3 w-3 text-red-600 dark:text-red-400" />
                          <span>{pr.deletions}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span>{pr.changedFiles} files</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GitCommit className="h-3 w-3" />
                          <span>{pr.commits} commits</span>
                        </div>
                      </div>
                      
                      {pr.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {pr.labels.map((label) => (
                            <Badge
                              key={label.id}
                              variant="outline"
                              className="text-xs"
                              style={{ borderColor: `#${label.color}` }}
                            >
                              {label.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      <Button variant="outline" size="sm" asChild>
                        <a href={pr.htmlUrl} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Closed Pull Requests */}
        <TabsContent value="closed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                Closed Pull Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPullRequests.filter(pr => pr.state === 'closed').map((pr) => (
                  <div key={pr.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0">
                      {getStateIcon(pr.state, pr.merged)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium truncate">{pr.title}</h3>
                        <Badge className={getStateColor(pr.state, pr.merged)}>
                          #{pr.number}
                        </Badge>
                        {pr.merged && (
                          <Badge variant="outline" className="text-purple-600 dark:text-purple-400">
                            Merged
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mb-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Avatar className="h-4 w-4">
                            <AvatarImage src={pr.user.avatarUrl} />
                            <AvatarFallback>{pr.user.name?.charAt(0) || pr.user.login.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{pr.user.name || pr.user.login}</span>
                        </div>
                        
                        {pr.mergedBy && (
                          <div className="flex items-center gap-1">
                            <span>merged by</span>
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={pr.mergedBy.avatarUrl} />
                              <AvatarFallback>{pr.mergedBy.name?.charAt(0) || pr.mergedBy.login.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{pr.mergedBy.name || pr.mergedBy.login}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(pr.closedAt || pr.updatedAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Plus className="h-3 w-3 text-green-600 dark:text-green-400" />
                          <span>{pr.additions}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Minus className="h-3 w-3 text-red-600 dark:text-red-400" />
                          <span>{pr.deletions}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span>{pr.changedFiles} files</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GitCommit className="h-3 w-3" />
                          <span>{pr.commits} commits</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <Button variant="outline" size="sm" asChild>
                        <a href={pr.htmlUrl} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </a>
                      </Button>
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
                  PR Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Pull Requests</span>
                    <span className="font-medium">{analytics?.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Open</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{analytics?.open}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Closed</span>
                    <span className="font-medium text-red-600 dark:text-red-400">{analytics?.closed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Merged</span>
                    <span className="font-medium text-purple-600 dark:text-purple-400">{analytics?.merged}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Time to Merge</span>
                    <span className="font-medium">{analytics?.averageTimeToMerge} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.byAuthor.map((author) => (
                    <div key={author.author.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={author.author.avatarUrl} />
                          <AvatarFallback>
                            {author.author.name?.charAt(0) || author.author.login.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{author.author.name || author.author.login}</div>
                          <div className="text-xs text-muted-foreground">@{author.author.login}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{author.total} PRs</div>
                        <div className="text-xs text-muted-foreground">{author.merged} merged</div>
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
