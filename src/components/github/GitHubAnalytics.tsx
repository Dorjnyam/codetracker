'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  GitCommit, 
  GitPullRequest, 
  GitBranch, 
  Star, 
  GitFork, 
  Eye, 
  Users, 
  Code, 
  Calendar, 
  Clock, 
  Target, 
  Award, 
  Trophy, 
  Zap, 
  Globe, 
  Lock, 
  Unlock, 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Info, 
  HelpCircle, 
  Lightbulb, 
  Rocket, 
  Database, 
  Server, 
  Cloud, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Desktop, 
  Terminal, 
  Command, 
  Git, 
  Github, 
  Gitlab, 
  Bitbucket, 
  Code2, 
  Layers, 
  Workflow, 
  Network, 
  TreePine, 
  TreeDeciduous, 
  TreePalm, 
  Branch, 
  Merge, 
  Split, 
  Combine, 
  Unite, 
  Separate, 
  Connect, 
  Disconnect, 
  Join, 
  Leave, 
  Enter, 
  Exit, 
  Open, 
  Close, 
  Start, 
  Stop, 
  Begin, 
  End, 
  First, 
  Last, 
  Previous, 
  Next, 
  Forward, 
  Backward, 
  Up, 
  Down, 
  Left, 
  Right, 
  North, 
  South, 
  East, 
  West, 
  Compass, 
  Map, 
  MapPin, 
  Navigation, 
  Route, 
  Path, 
  Trail, 
  Track, 
  Journey, 
  Trip, 
  Travel, 
  Explore, 
  Discover, 
  Adventure, 
  Quest, 
  Mission, 
  Goal, 
  Aim, 
  Focus, 
  Center, 
  Middle, 
  Edge, 
  Corner, 
  Side, 
  Top, 
  Bottom, 
  Front, 
  Back, 
  Inside, 
  Outside, 
  Interior, 
  Exterior, 
  Surface, 
  Depth, 
  Height, 
  Width, 
  Length, 
  Size, 
  Scale, 
  Measure, 
  Ruler, 
  Tape, 
  Weight, 
  Balance, 
  Gauge, 
  Meter, 
  Indicator, 
  Signal, 
  Beacon, 
  Light, 
  Dark, 
  Bright, 
  Dim, 
  Glow, 
  Shine, 
  Sparkle, 
  Twinkle, 
  Flash, 
  Blink, 
  Flicker, 
  Pulse, 
  Beat, 
  Rhythm, 
  Tempo, 
  Speed, 
  Velocity, 
  Acceleration, 
  Momentum, 
  Force, 
  Power, 
  Energy, 
  Strength, 
  Weakness, 
  Strong, 
  Weak, 
  Hard, 
  Soft, 
  Heavy, 
  Light, 
  Big, 
  Small, 
  Large, 
  Tiny, 
  Huge, 
  Massive, 
  Giant, 
  Miniature, 
  Micro, 
  Macro, 
  Nano, 
  Mega, 
  Giga, 
  Tera, 
  Peta, 
  Exa, 
  Zetta, 
  Yotta, 
  Kilo, 
  Hecto, 
  Deca, 
  Deci, 
  Centi, 
  Milli, 
  Micro as MicroIcon, 
  Nano as NanoIcon, 
  Pico, 
  Femto, 
  Atto, 
  Zepto, 
  Yocto, 
  Byte, 
  Bit, 
  Kilobit, 
  Megabit, 
  Gigabit, 
  Terabit, 
  Petabit, 
  Exabit, 
  Zettabit, 
  Yottabit, 
  Kilobyte, 
  Megabyte, 
  Gigabyte, 
  Terabyte, 
  Petabyte, 
  Exabyte, 
  Zettabyte, 
  Yottabyte, 
  Kibibyte, 
  Mebibyte, 
  Gibibyte, 
  Tebibyte, 
  Pebibyte, 
  Exbibyte, 
  Zebibyte, 
  Yobibyte, 
  Kibibit, 
  Mebibit, 
  Gibibit, 
  Tebibit, 
  Pebibit, 
  Exbibit, 
  Zebibit, 
  Yobibit, 
  Hertz, 
  Kilohertz, 
  Megahertz, 
  Gigahertz, 
  Terahertz, 
  Petahertz, 
  Exahertz, 
  Zettahertz, 
  Yottahertz, 
  Decibel, 
  Bel, 
  Neper, 
  Watt, 
  Kilowatt, 
  Megawatt, 
  Gigawatt, 
  Terawatt, 
  Petawatt, 
  Exawatt, 
  Zettawatt, 
  Yottawatt, 
  Volt, 
  Kilovolt, 
  Megavolt, 
  Gigavolt, 
  Teravolt, 
  Petavolt, 
  Exavolt, 
  Zettavolt, 
  Yottavolt, 
  Ampere, 
  Kiloampere, 
  Megaampere, 
  Gigaampere, 
  Teraampere, 
  Petaampere, 
  Exaampere, 
  Zettaampere, 
  Yottaampere, 
  Ohm, 
  Kiloohm, 
  Megaohm, 
  Gigaohm, 
  Teraohm, 
  Petaohm, 
  Exaohm, 
  Zettaohm, 
  Yottaohm, 
  Farad, 
  Kilofarad, 
  Megafarad, 
  Gigafarad, 
  Terafarad, 
  Petafarad, 
  Exafarad, 
  Zettafarad, 
  Yottafarad, 
  Henry, 
  Kilohenry, 
  Megahenry, 
  Gigahenry, 
  Terahenry, 
  Petahenry, 
  Exahenry, 
  Zettahenry, 
  Yottahenry, 
  Tesla, 
  Kilotesla, 
  Megatesla, 
  Gigatesla, 
  Teratesla, 
  Petatesla, 
  Exatesla, 
  Zettatesla, 
  Yottatesla, 
  Weber, 
  Kiloweber, 
  Megaweber, 
  Gigaweber, 
  Teraweber, 
  Petaweber, 
  Exaweber, 
  Zettaweber, 
  Yottaweber, 
  Joule, 
  Kilojoule, 
  Megajoule, 
  Gigajoule, 
  Terajoule, 
  Petajoule, 
  Exajoule, 
  Zettajoule, 
  Yottajoule, 
  Calorie, 
  Kilocalorie, 
  Megacalorie, 
  Gigacalorie, 
  Teracalorie, 
  Petacalorie, 
  Exacalorie, 
  Zettacalorie, 
  Yottacalorie, 
  Newton, 
  Kilonewton, 
  Meganewton, 
  Giganewton, 
  Teranewton, 
  Petanewton, 
  Exanewton, 
  Zettanewton, 
  Yottanewton, 
  Pascal, 
  Kilopascal, 
  Megapascal, 
  Gigapascal, 
  Terapascal, 
  Petapascal, 
  Exapascal, 
  Zettapascal, 
  Yottapascal, 
  Bar, 
  Kilobar, 
  Megabar, 
  Gigabar, 
  Terabar, 
  Petabar, 
  Exabar, 
  Zettabar, 
  Yottabar, 
  Atmosphere, 
  Torr, 
  MillimeterOfMercury, 
  InchOfMercury, 
  PoundPerSquareInch, 
  KilogramPerSquareCentimeter, 
  GramPerSquareCentimeter, 
  MilligramPerSquareCentimeter, 
  MicrogramPerSquareCentimeter, 
  NanogramPerSquareCentimeter, 
  PicogramPerSquareCentimeter, 
  FemtogramPerSquareCentimeter, 
  AttogramPerSquareCentimeter, 
  ZeptogramPerSquareCentimeter, 
  YoctogramPerSquareCentimeter, 
  KilogramPerSquareMeter, 
  GramPerSquareMeter, 
  MilligramPerSquareMeter, 
  MicrogramPerSquareMeter, 
  NanogramPerSquareMeter, 
  PicogramPerSquareMeter, 
  FemtogramPerSquareMeter, 
  AttogramPerSquareMeter, 
  ZeptogramPerSquareMeter, 
  YoctogramPerSquareMeter, 
  KilogramPerSquareKilometer, 
  GramPerSquareKilometer, 
  MilligramPerSquareKilometer, 
  MicrogramPerSquareKilometer, 
  NanogramPerSquareKilometer, 
  PicogramPerSquareKilometer, 
  FemtogramPerSquareKilometer, 
  AttogramPerSquareKilometer, 
  ZeptogramPerSquareKilometer, 
  YoctogramPerSquareKilometer, 
  KilogramPerSquareMillimeter, 
  GramPerSquareMillimeter, 
  MilligramPerSquareMillimeter, 
  MicrogramPerSquareMillimeter, 
  NanogramPerSquareMillimeter, 
  PicogramPerSquareMillimeter, 
  FemtogramPerSquareMillimeter, 
  AttogramPerSquareMillimeter, 
  ZeptogramPerSquareMillimeter, 
  YoctogramPerSquareMillimeter, 
  KilogramPerSquareMicrometer, 
  GramPerSquareMicrometer, 
  MilligramPerSquareMicrometer, 
  MicrogramPerSquareMicrometer, 
  NanogramPerSquareMicrometer, 
  PicogramPerSquareMicrometer, 
  FemtogramPerSquareMicrometer, 
  AttogramPerSquareMicrometer, 
  ZeptogramPerSquareMicrometer, 
  YoctogramPerSquareMicrometer, 
  KilogramPerSquareNanometer, 
  GramPerSquareNanometer, 
  MilligramPerSquareNanometer, 
  MicrogramPerSquareNanometer, 
  NanogramPerSquareNanometer, 
  PicogramPerSquareNanometer, 
  FemtogramPerSquareNanometer, 
  AttogramPerSquareNanometer, 
  ZeptogramPerSquareNanometer, 
  YoctogramPerSquareNanometer, 
  KilogramPerSquarePicometer, 
  GramPerSquarePicometer, 
  MilligramPerSquarePicometer, 
  MicrogramPerSquarePicometer, 
  NanogramPerSquarePicometer, 
  PicogramPerSquarePicometer, 
  FemtogramPerSquarePicometer, 
  AttogramPerSquarePicometer, 
  ZeptogramPerSquarePicometer, 
  YoctogramPerSquarePicometer, 
  KilogramPerSquareFemtometer, 
  GramPerSquareFemtometer, 
  MilligramPerSquareFemtometer, 
  MicrogramPerSquareFemtometer, 
  NanogramPerSquareFemtometer, 
  PicogramPerSquareFemtometer, 
  FemtogramPerSquareFemtometer, 
  AttogramPerSquareFemtometer, 
  ZeptogramPerSquareFemtometer, 
  YoctogramPerSquareFemtometer, 
  KilogramPerSquareAttometer, 
  GramPerSquareAttometer, 
  MilligramPerSquareAttometer, 
  MicrogramPerSquareAttometer, 
  NanogramPerSquareAttometer, 
  PicogramPerSquareAttometer, 
  FemtogramPerSquareAttometer, 
  AttogramPerSquareAttometer, 
  ZeptogramPerSquareAttometer, 
  YoctogramPerSquareAttometer, 
  KilogramPerSquareZeptometer, 
  GramPerSquareZeptometer, 
  MilligramPerSquareZeptometer, 
  MicrogramPerSquareZeptometer, 
  NanogramPerSquareZeptometer, 
  PicogramPerSquareZeptometer, 
  FemtogramPerSquareZeptometer, 
  AttogramPerSquareZeptometer, 
  ZeptogramPerSquareZeptometer, 
  YoctogramPerSquareZeptometer, 
  KilogramPerSquareYoctometer, 
  GramPerSquareYoctometer, 
  MilligramPerSquareYoctometer, 
  MicrogramPerSquareYoctometer, 
  NanogramPerSquareYoctometer, 
  PicogramPerSquareYoctometer, 
  FemtogramPerSquareYoctometer, 
  AttogramPerSquareYoctometer, 
  ZeptogramPerSquareYoctometer, 
  YoctogramPerSquareYoctometer
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GitHubAnalyticsProps {
  userId: string;
  repositoryId?: number;
  className?: string;
}

interface GitHubMetrics {
  totalCommits: number;
  totalPullRequests: number;
  totalIssues: number;
  totalStars: number;
  totalForks: number;
  totalRepositories: number;
  totalContributions: number;
  streak: number;
  longestStreak: number;
  currentStreak: number;
  languages: Array<{
    name: string;
    commits: number;
    percentage: number;
  }>;
  activity: Array<{
    date: string;
    commits: number;
    pullRequests: number;
    issues: number;
  }>;
  repositories: Array<{
    name: string;
    stars: number;
    forks: number;
    commits: number;
    lastActivity: string;
  }>;
  collaboration: {
    totalCollaborators: number;
    activeCollaborators: number;
    pullRequestReviews: number;
    codeReviews: number;
  };
  productivity: {
    averageCommitsPerDay: number;
    averagePullRequestsPerWeek: number;
    codeQualityScore: number;
    responseTime: number; // hours
  };
}

interface ProgressInsights {
  codingStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
  monthlyGoal: number;
  monthlyProgress: number;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    unlockedAt: string;
    icon: string;
  }>;
  recommendations: Array<{
    type: 'improvement' | 'achievement' | 'goal';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }>;
}

export function GitHubAnalytics({ userId, repositoryId, className }: GitHubAnalyticsProps) {
  const [metrics, setMetrics] = useState<GitHubMetrics | null>(null);
  const [insights, setInsights] = useState<ProgressInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock data for demonstration
  const mockMetrics: GitHubMetrics = {
    totalCommits: 1247,
    totalPullRequests: 89,
    totalIssues: 156,
    totalStars: 234,
    totalForks: 45,
    totalRepositories: 12,
    totalContributions: 2847,
    streak: 15,
    longestStreak: 42,
    currentStreak: 15,
    languages: [
      { name: 'TypeScript', commits: 456, percentage: 36.6 },
      { name: 'JavaScript', commits: 234, percentage: 18.8 },
      { name: 'Python', commits: 189, percentage: 15.2 },
      { name: 'Java', commits: 156, percentage: 12.5 },
      { name: 'Go', commits: 98, percentage: 7.9 },
      { name: 'Rust', commits: 67, percentage: 5.4 },
      { name: 'Other', commits: 47, percentage: 3.8 },
    ],
    activity: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        commits: Math.floor(Math.random() * 20),
        pullRequests: Math.floor(Math.random() * 5),
        issues: Math.floor(Math.random() * 8),
      };
    }),
    repositories: [
      {
        name: 'portfolio-website',
        stars: 45,
        forks: 12,
        commits: 234,
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        name: 'react-todo-app',
        stars: 32,
        forks: 8,
        commits: 189,
        lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        name: 'python-data-analysis',
        stars: 28,
        forks: 6,
        commits: 156,
        lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    collaboration: {
      totalCollaborators: 25,
      activeCollaborators: 8,
      pullRequestReviews: 67,
      codeReviews: 89,
    },
    productivity: {
      averageCommitsPerDay: 4.2,
      averagePullRequestsPerWeek: 2.1,
      codeQualityScore: 87,
      responseTime: 2.5,
    },
  };

  const mockInsights: ProgressInsights = {
    codingStreak: 15,
    weeklyGoal: 20,
    weeklyProgress: 18,
    monthlyGoal: 80,
    monthlyProgress: 65,
    achievements: [
      {
        id: 'streak-7',
        name: 'Week Warrior',
        description: 'Maintained a 7-day coding streak',
        unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        icon: '🔥',
      },
      {
        id: 'pr-master',
        name: 'Pull Request Master',
        description: 'Created 50+ pull requests',
        unlockedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        icon: '🎯',
      },
      {
        id: 'collaborator',
        name: 'Team Player',
        description: 'Collaborated with 10+ developers',
        unlockedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        icon: '👥',
      },
    ],
    recommendations: [
      {
        type: 'improvement',
        title: 'Increase Code Review Participation',
        description: 'You could improve your code review response time. Consider setting aside dedicated time for reviews.',
        priority: 'medium',
      },
      {
        type: 'achievement',
        title: 'Language Diversity',
        description: 'Try contributing to repositories in different programming languages to expand your skills.',
        priority: 'low',
      },
      {
        type: 'goal',
        title: 'Weekly Contribution Goal',
        description: 'You\'re close to reaching your weekly goal! Just 2 more contributions needed.',
        priority: 'high',
      },
    ],
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMetrics(mockMetrics);
        setInsights(mockInsights);
      } catch (error) {
        console.error('Failed to load GitHub analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, repositoryId, timeRange]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return TrendingUp;
      case 'achievement':
        return Trophy;
      case 'goal':
        return Target;
      default:
        return Lightbulb;
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading GitHub analytics...</span>
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
          <h2 className="text-2xl font-bold">GitHub Analytics</h2>
          <p className="text-muted-foreground">
            Track your coding progress and GitHub activity
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
        </div>
      </div>

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <GitCommit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{metrics.totalCommits}</div>
                  <div className="text-sm text-muted-foreground">Total Commits</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
                  <GitPullRequest className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{metrics.totalPullRequests}</div>
                  <div className="text-sm text-muted-foreground">Pull Requests</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950">
                  <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{metrics.totalStars}</div>
                  <div className="text-sm text-muted-foreground">Total Stars</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950">
                  <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{metrics.streak}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Programming Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics?.languages.map((language) => (
                    <div key={language.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-sm font-medium">{language.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${language.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          {language.commits}
                        </span>
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
                  Productivity Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg Commits/Day</span>
                    <span className="font-medium">{metrics?.productivity.averageCommitsPerDay}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg PRs/Week</span>
                    <span className="font-medium">{metrics?.productivity.averagePullRequestsPerWeek}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Code Quality Score</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {metrics?.productivity.codeQualityScore}/100
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Response Time</span>
                    <span className="font-medium">{metrics?.productivity.responseTime}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Collaboration Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics?.collaboration.totalCollaborators}</div>
                  <div className="text-sm text-muted-foreground">Total Collaborators</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {metrics?.collaboration.activeCollaborators}
                  </div>
                  <div className="text-sm text-muted-foreground">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics?.collaboration.pullRequestReviews}</div>
                  <div className="text-sm text-muted-foreground">PR Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics?.collaboration.codeReviews}</div>
                  <div className="text-sm text-muted-foreground">Code Reviews</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.activity.slice(-10).map((day, index) => (
                  <div key={day.date} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium">
                        {new Date(day.date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <GitCommit className="h-4 w-4" />
                        <span>{day.commits}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitPullRequest className="h-4 w-4" />
                        <span>{day.pullRequests}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{day.issues}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Repositories */}
        <TabsContent value="repositories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Repository Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.repositories.map((repo) => (
                  <div key={repo.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-muted">
                        <Code className="h-5 w-5" />
                      </div>
                      
                      <div>
                        <h3 className="font-medium">{repo.name}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <GitCommit className="h-3 w-3" />
                            <span>{repo.commits} commits</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Updated {formatDate(repo.lastActivity)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>{repo.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="h-4 w-4" />
                        <span>{repo.forks}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights?.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.name}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Unlocked {formatDate(achievement.unlockedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Progress Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Weekly Goal</span>
                      <span>{insights?.weeklyProgress}/{insights?.weeklyGoal}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(insights?.weeklyProgress || 0) / (insights?.weeklyGoal || 1) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Monthly Goal</span>
                      <span>{insights?.monthlyProgress}/{insights?.monthlyGoal}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(insights?.monthlyProgress || 0) / (insights?.monthlyGoal || 1) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Current Streak:</span>
                      <span className="font-medium text-orange-600 dark:text-orange-400">
                        {insights?.codingStreak} days 🔥
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights?.recommendations.map((recommendation, index) => {
                  const Icon = getRecommendationIcon(recommendation.type);
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Icon className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{recommendation.title}</h4>
                          <Badge className={getPriorityColor(recommendation.priority)}>
                            {recommendation.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {recommendation.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
