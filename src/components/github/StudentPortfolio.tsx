'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Github, 
  Star, 
  GitFork, 
  Eye, 
  Calendar,
  Code,
  FileText,
  Languages,
  TrendingUp,
  Award,
  Trophy,
  Target,
  Users,
  Globe,
  Download,
  Share,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  Copy,
  Heart,
  MessageSquare,
  GitBranch,
  GitCommit,
  Zap,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Activity,
  BookOpen,
  Briefcase,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Link,
  Camera,
  Settings,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Grid,
  List,
  MoreHorizontal
} from 'lucide-react';
import { 
  GitHubUser, 
  GitHubRepository, 
  GitHubCommit,
  GitHubContributionDay
} from '@/types/github';
import { cn } from '@/lib/utils';

interface StudentPortfolioProps {
  userId: string;
  githubUsername?: string;
  className?: string;
}

export function StudentPortfolio({ userId, githubUsername, className }: StudentPortfolioProps) {
  const [profile, setProfile] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [contributions, setContributions] = useState<GitHubContributionDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'stars' | 'updated' | 'name'>('stars');

  // Mock data for demonstration
  const mockProfile: GitHubUser = {
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
      owner: mockProfile,
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
      owner: mockProfile,
    },
    {
      id: 3,
      name: 'python-data-analysis',
      fullName: 'alice-dev/python-data-analysis',
      description: 'Data analysis projects using Python, Pandas, and Matplotlib',
      htmlUrl: 'https://github.com/alice-dev/python-data-analysis',
      cloneUrl: 'https://github.com/alice-dev/python-data-analysis.git',
      sshUrl: 'git@github.com:alice-dev/python-data-analysis.git',
      language: 'Python',
      stargazersCount: 5,
      forksCount: 1,
      watchersCount: 7,
      openIssuesCount: 0,
      size: 512,
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
      createdAt: '2023-10-01T00:00:00Z',
      updatedAt: '2024-01-05T00:00:00Z',
      owner: mockProfile,
    },
  ];

  const mockContributions: GitHubContributionDay[] = Array.from({ length: 365 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (364 - i));
    return {
      date: date.toISOString().split('T')[0],
      contributionCount: Math.floor(Math.random() * 10),
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      level: Math.floor(Math.random() * 5),
    };
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProfile(mockProfile);
        setRepositories(mockRepositories);
        setContributions(mockContributions);
      } catch (error) {
        console.error('Failed to load portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, githubUsername]);

  const getLanguageColor = (language: string): string => {
    const colors: Record<string, string> = {
      'TypeScript': 'bg-blue-500',
      'JavaScript': 'bg-yellow-500',
      'Python': 'bg-green-500',
      'Java': 'bg-orange-500',
      'C++': 'bg-blue-600',
      'Go': 'bg-cyan-500',
      'Rust': 'bg-orange-600',
      'PHP': 'bg-purple-500',
      'Ruby': 'bg-red-500',
      'Swift': 'bg-orange-400',
    };
    return colors[language] || 'bg-gray-500';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 1) return 'Today';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const sortedRepositories = [...repositories].sort((a, b) => {
    switch (sortBy) {
      case 'stars':
        return b.stargazersCount - a.stargazersCount;
      case 'updated':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazersCount, 0);
  const totalForks = repositories.reduce((sum, repo) => sum + repo.forksCount, 0);
  const languages = [...new Set(repositories.map(repo => repo.language).filter(Boolean))];
  const totalContributions = contributions.reduce((sum, day) => sum + day.contributionCount, 0);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading portfolio...</span>
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
          <h2 className="text-2xl font-bold">Student Portfolio</h2>
          <p className="text-muted-foreground">
            Showcase your coding journey and achievements
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share Portfolio
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      {profile && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatarUrl} />
                <AvatarFallback className="text-lg">
                  {profile.name?.charAt(0) || profile.login.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{profile.name || profile.login}</h1>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Github className="h-3 w-3" />
                    @{profile.login}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{profile.followers} followers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{profile.following} following</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Code className="h-4 w-4" />
                    <span>{profile.publicRepos} repositories</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(profile.createdAt).getFullYear()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`https://github.com/${profile.login}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View GitHub Profile
                    </a>
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Portfolio
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
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
                <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalContributions}</div>
                <div className="text-sm text-muted-foreground">Contributions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950">
                <Languages className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{languages.length}</div>
                <div className="text-sm text-muted-foreground">Languages</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  Programming Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {languages.map((language) => {
                    const count = repositories.filter(repo => repo.language === language).length;
                    const percentage = (count / repositories.length) * 100;
                    
                    return (
                      <div key={language} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn('w-3 h-3 rounded-full', getLanguageColor(language))} />
                          <span className="text-sm font-medium">{language}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className={cn('h-2 rounded-full', getLanguageColor(language))}
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {repositories.slice(0, 5).map((repo) => (
                    <div key={repo.id} className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <Code className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{repo.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Updated {formatDate(repo.updatedAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          <span>{repo.stargazersCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GitFork className="h-3 w-3" />
                          <span>{repo.forksCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Repositories */}
        <TabsContent value="repositories" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="stars">Sort by Stars</option>
                <option value="updated">Sort by Updated</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className={cn(
            'grid gap-4',
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
          )}>
            {sortedRepositories.map((repo) => (
              <Card key={repo.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{repo.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {repo.description || 'No description available'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-2">
                      {repo.language && (
                        <div className={cn('w-3 h-3 rounded-full', getLanguageColor(repo.language))} />
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>{repo.stargazersCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="h-4 w-4" />
                        <span>{repo.forksCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{repo.watchersCount}</span>
                      </div>
                    </div>
                    
                    <Badge variant={repo.isPrivate ? 'destructive' : 'secondary'}>
                      {repo.isPrivate ? 'Private' : 'Public'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Updated {formatDate(repo.updatedAt)}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contributions */}
        <TabsContent value="contributions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Contribution Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Contribution Graph</h3>
                <p className="text-muted-foreground mb-4">
                  Your GitHub contribution activity will be displayed here
                </p>
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on GitHub
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievements & Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Achievements Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Complete coding challenges and assignments to earn achievements
                </p>
                <Button>
                  <Target className="h-4 w-4 mr-2" />
                  View Challenges
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
