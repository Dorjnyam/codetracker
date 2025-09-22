'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Github, 
  GitBranch, 
  GitPullRequest, 
  GitCommit, 
  Zap, 
  Settings,
  Link,
  Unlink,
  RefreshCw,
  ExternalLink,
  Star,
  GitFork,
  Eye,
  Calendar,
  Users,
  Code,
  Activity,
  BarChart3,
  Shield,
  Package,
  Globe,
  Lock,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { CommitTracker } from '@/components/github/CommitTracker';
import { PullRequestManager } from '@/components/github/PullRequestManager';
import { CICDDashboard } from '@/components/github/CICDDashboard';
import { StudentPortfolio } from '@/components/github/StudentPortfolio';
import { GitHubUser, GitHubRepository } from '@/types/github';
import { cn } from '@/lib/utils';

export default function GitHubPage() {
  const { data: session, status } = useSession();
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isConnected, setIsConnected] = useState(false);

  // Mock data for demonstration
  const mockGithubUser: GitHubUser = {
    id: 1,
    login: 'alice-dev',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
    publicRepos: 15,
    publicGists: 5,
    followers: 25,
    following: 30,
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockRepositories: GitHubRepository[] = [
    {
      id: 1,
      name: 'portfolio-website',
      fullName: 'alice-dev/portfolio-website',
      description: 'My personal portfolio website built with Next.js and Tailwind CSS',
      htmlUrl: 'https://github.com/alice-dev/portfolio-website',
      cloneUrl: 'https://github.com/alice-dev/portfolio-website.git',
      sshUrl: 'git@github.com:alice-dev/portfolio-website.git',
      language: 'TypeScript',
      stargazersCount: 12,
      forksCount: 3,
      watchersCount: 15,
      openIssuesCount: 2,
      size: 2048,
      defaultBranch: 'main',
      visibility: 'public',
      isPrivate: false,
      isFork: false,
      isTemplate: false,
      hasIssues: true,
      hasProjects: true,
      hasWiki: true,
      hasPages: true,
      hasDownloads: true,
      allowSquashMerge: true,
      allowMergeCommit: true,
      allowRebaseMerge: true,
      allowAutoMerge: false,
      deleteBranchOnMerge: true,
      createdAt: '2023-06-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      owner: mockGithubUser,
    },
    {
      id: 2,
      name: 'react-todo-app',
      fullName: 'alice-dev/react-todo-app',
      description: 'A modern todo application built with React and Redux',
      htmlUrl: 'https://github.com/alice-dev/react-todo-app',
      cloneUrl: 'https://github.com/alice-dev/react-todo-app.git',
      sshUrl: 'git@github.com:alice-dev/react-todo-app.git',
      language: 'JavaScript',
      stargazersCount: 8,
      forksCount: 2,
      watchersCount: 10,
      openIssuesCount: 1,
      size: 1024,
      defaultBranch: 'main',
      visibility: 'public',
      isPrivate: false,
      isFork: false,
      isTemplate: false,
      hasIssues: true,
      hasProjects: false,
      hasWiki: false,
      hasPages: false,
      hasDownloads: true,
      allowSquashMerge: true,
      allowMergeCommit: true,
      allowRebaseMerge: true,
      allowAutoMerge: false,
      deleteBranchOnMerge: true,
      createdAt: '2023-08-15T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z',
      owner: mockGithubUser,
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        setGithubUser(mockGithubUser);
        setRepositories(mockRepositories);
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to load GitHub data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleConnectGitHub = async () => {
    try {
      // In a real implementation, this would redirect to GitHub OAuth
      window.open('https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID&scope=repo,user', '_blank');
    } catch (error) {
      console.error('Failed to connect to GitHub:', error);
    }
  };

  const handleDisconnectGitHub = async () => {
    try {
      // In a real implementation, this would revoke the GitHub token
      setIsConnected(false);
      setGithubUser(null);
      setRepositories([]);
    } catch (error) {
      console.error('Failed to disconnect from GitHub:', error);
    }
  };

  const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazersCount, 0);
  const totalForks = repositories.reduce((sum, repo) => sum + repo.forksCount, 0);
  const languages = [...new Set(repositories.map(repo => repo.language).filter(Boolean))];

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading GitHub integration...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!session || !session.user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground">Please sign in to access GitHub integration.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">GitHub Integration</h1>
            <p className="text-muted-foreground">
              Connect your GitHub account and manage your repositories
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Connection Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <Github className="h-8 w-8" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">GitHub Connection</h3>
                  <p className="text-muted-foreground">
                    {isConnected ? 'Connected to GitHub' : 'Not connected to GitHub'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <>
                    <Badge className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Connected
                    </Badge>
                    <Button variant="outline" onClick={handleDisconnectGitHub}>
                      <Unlink className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleConnectGitHub}>
                    <Link className="h-4 w-4 mr-2" />
                    Connect GitHub
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {isConnected && githubUser && (
          <>
            {/* GitHub Profile Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950">
                      <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{totalStars}</div>
                      <div className="text-sm text-muted-foreground">Total Stars</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                      <GitFork className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{totalForks}</div>
                      <div className="text-sm text-muted-foreground">Total Forks</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
                      <Code className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{repositories.length}</div>
                      <div className="text-sm text-muted-foreground">Repositories</div>
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
                      <div className="text-2xl font-bold">{githubUser.followers}</div>
                      <div className="text-sm text-muted-foreground">Followers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="repositories">Repositories</TabsTrigger>
                <TabsTrigger value="commits">Commits</TabsTrigger>
                <TabsTrigger value="pull-requests">Pull Requests</TabsTrigger>
                <TabsTrigger value="cicd">CI/CD</TabsTrigger>
              </TabsList>

              {/* Overview */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Github className="h-5 w-5" />
                        GitHub Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <img
                          src={githubUser.avatarUrl}
                          alt={githubUser.name || githubUser.login}
                          className="h-16 w-16 rounded-full"
                        />
                        <div>
                          <h3 className="text-lg font-semibold">{githubUser.name || githubUser.login}</h3>
                          <p className="text-muted-foreground">@{githubUser.login}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>{githubUser.publicRepos} repos</span>
                            <span>{githubUser.followers} followers</span>
                            <span>{githubUser.following} following</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Programming Languages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {languages.map((language) => {
                          const count = repositories.filter(repo => repo.language === language).length;
                          const percentage = (count / repositories.length) * 100;
                          
                          return (
                            <div key={language} className="flex items-center justify-between">
                              <span className="text-sm font-medium">{language}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-muted rounded-full h-2">
                                  <div 
                                    className="bg-primary h-2 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground w-8 text-right">
                                  {count}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <StudentPortfolio 
                  userId={session.user.id}
                  githubUsername={githubUser.login}
                />
              </TabsContent>

              {/* Repositories */}
              <TabsContent value="repositories" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Your Repositories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {repositories.map((repo) => (
                        <div key={repo.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-muted">
                              <Code className="h-5 w-5" />
                            </div>
                            
                            <div>
                              <h3 className="font-medium">{repo.name}</h3>
                              <p className="text-sm text-muted-foreground">{repo.description}</p>
                              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                <span>{repo.language}</span>
                                <span>Updated {new Date(repo.updatedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4" />
                                <span>{repo.stargazersCount}</span>
                              </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="h-4 w-4" />
                        <span>{repo.forksCount}</span>
                      </div>
                            </div>
                            
                            <Button variant="outline" size="sm" asChild>
                              <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
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

              {/* Commits */}
              <TabsContent value="commits" className="space-y-4">
                <CommitTracker 
                  repositoryId={repositories[0]?.id || 1}
                  owner={githubUser.login}
                  repo={repositories[0]?.name || 'portfolio-website'}
                />
              </TabsContent>

              {/* Pull Requests */}
              <TabsContent value="pull-requests" className="space-y-4">
                <PullRequestManager 
                  repositoryId={repositories[0]?.id || 1}
                  owner={githubUser.login}
                  repo={repositories[0]?.name || 'portfolio-website'}
                />
              </TabsContent>

              {/* CI/CD */}
              <TabsContent value="cicd" className="space-y-4">
                <CICDDashboard 
                  repositoryId={repositories[0]?.id || 1}
                  owner={githubUser.login}
                  repo={repositories[0]?.name || 'portfolio-website'}
                  accessToken="mock-token"
                />
              </TabsContent>
            </Tabs>
          </>
        )}

        {!isConnected && (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <Github className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Connect Your GitHub Account</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Connect your GitHub account to track your coding progress, manage repositories, 
                  and showcase your work in your portfolio.
                </p>
                <Button size="lg" onClick={handleConnectGitHub}>
                  <Github className="h-5 w-5 mr-2" />
                  Connect GitHub Account
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
