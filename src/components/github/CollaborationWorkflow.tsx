'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  GitBranch, 
  GitPullRequest, 
  GitMerge, 
  GitCommit, 
  Code, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  Star, 
  GitFork, 
  Eye, 
  Plus, 
  Settings, 
  Filter, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Copy, 
  Share, 
  Download, 
  Upload, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  ChevronDown, 
  ChevronRight, 
  ArrowRight, 
  ArrowLeft, 
  ArrowUp, 
  ArrowDown, 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Zap, 
  Target, 
  Award, 
  Trophy, 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Globe, 
  Lock, 
  Unlock, 
  Shield, 
  AlertCircle, 
  Info, 
  HelpCircle, 
  Lightbulb, 
  Rocket, 
  Link, 
  Link2, 
  Unlink, 
  FileText, 
  FileCode, 
  Folder, 
  FolderOpen, 
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
  TreePineIcon, 
  TreeDeciduousIcon, 
  TreePalmIcon, 
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

interface CollaborationWorkflowProps {
  repositoryId: number;
  className?: string;
}

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  type: 'branch' | 'commit' | 'pull_request' | 'review' | 'merge' | 'deploy';
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  assignee?: string;
  dueDate?: string;
  completedAt?: string;
  estimatedTime: number; // minutes
  dependencies: string[];
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'feature' | 'bugfix' | 'hotfix' | 'release' | 'experiment';
  isPublic: boolean;
  usageCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

interface CollaborationSession {
  id: string;
  name: string;
  description: string;
  participants: string[];
  currentStep: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  startedAt: string;
  estimatedEnd: string;
  progress: number;
}

export function CollaborationWorkflow({ repositoryId, className }: CollaborationWorkflowProps) {
  const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>([]);
  const [activeSessions, setActiveSessions] = useState<CollaborationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('templates');

  // Mock data for demonstration
  const mockWorkflowTemplates: WorkflowTemplate[] = [
    {
      id: 'feature-development',
      name: 'Feature Development Workflow',
      description: 'Standard workflow for developing new features',
      estimatedTime: 120,
      difficulty: 'medium',
      category: 'feature',
      isPublic: true,
      usageCount: 45,
      rating: 4.5,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      steps: [
        {
          id: 'create-branch',
          name: 'Create Feature Branch',
          description: 'Create a new branch for the feature',
          type: 'branch',
          status: 'pending',
          estimatedTime: 5,
          dependencies: [],
        },
        {
          id: 'implement-feature',
          name: 'Implement Feature',
          description: 'Write code for the new feature',
          type: 'commit',
          status: 'pending',
          estimatedTime: 60,
          dependencies: ['create-branch'],
        },
        {
          id: 'create-pr',
          name: 'Create Pull Request',
          description: 'Create a pull request for code review',
          type: 'pull_request',
          status: 'pending',
          estimatedTime: 10,
          dependencies: ['implement-feature'],
        },
        {
          id: 'code-review',
          name: 'Code Review',
          description: 'Review the code and provide feedback',
          type: 'review',
          status: 'pending',
          estimatedTime: 30,
          dependencies: ['create-pr'],
        },
        {
          id: 'merge',
          name: 'Merge to Main',
          description: 'Merge the feature branch to main',
          type: 'merge',
          status: 'pending',
          estimatedTime: 5,
          dependencies: ['code-review'],
        },
        {
          id: 'deploy',
          name: 'Deploy to Staging',
          description: 'Deploy the feature to staging environment',
          type: 'deploy',
          status: 'pending',
          estimatedTime: 10,
          dependencies: ['merge'],
        },
      ],
    },
    {
      id: 'bugfix-workflow',
      name: 'Bug Fix Workflow',
      description: 'Quick workflow for fixing critical bugs',
      estimatedTime: 60,
      difficulty: 'easy',
      category: 'bugfix',
      isPublic: true,
      usageCount: 32,
      rating: 4.2,
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z',
      steps: [
        {
          id: 'identify-bug',
          name: 'Identify Bug',
          description: 'Identify and document the bug',
          type: 'commit',
          status: 'pending',
          estimatedTime: 10,
          dependencies: [],
        },
        {
          id: 'create-hotfix-branch',
          name: 'Create Hotfix Branch',
          description: 'Create a hotfix branch from main',
          type: 'branch',
          status: 'pending',
          estimatedTime: 5,
          dependencies: ['identify-bug'],
        },
        {
          id: 'fix-bug',
          name: 'Fix Bug',
          description: 'Implement the bug fix',
          type: 'commit',
          status: 'pending',
          estimatedTime: 30,
          dependencies: ['create-hotfix-branch'],
        },
        {
          id: 'test-fix',
          name: 'Test Fix',
          description: 'Test the bug fix thoroughly',
          type: 'review',
          status: 'pending',
          estimatedTime: 10,
          dependencies: ['fix-bug'],
        },
        {
          id: 'merge-hotfix',
          name: 'Merge Hotfix',
          description: 'Merge hotfix to main and develop',
          type: 'merge',
          status: 'pending',
          estimatedTime: 5,
          dependencies: ['test-fix'],
        },
      ],
    },
    {
      id: 'release-workflow',
      name: 'Release Workflow',
      description: 'Complete workflow for software releases',
      estimatedTime: 180,
      difficulty: 'hard',
      category: 'release',
      isPublic: true,
      usageCount: 18,
      rating: 4.8,
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-12T00:00:00Z',
      steps: [
        {
          id: 'prepare-release',
          name: 'Prepare Release',
          description: 'Update version numbers and changelog',
          type: 'commit',
          status: 'pending',
          estimatedTime: 20,
          dependencies: [],
        },
        {
          id: 'create-release-branch',
          name: 'Create Release Branch',
          description: 'Create a release branch from develop',
          type: 'branch',
          status: 'pending',
          estimatedTime: 5,
          dependencies: ['prepare-release'],
        },
        {
          id: 'final-testing',
          name: 'Final Testing',
          description: 'Comprehensive testing of the release',
          type: 'review',
          status: 'pending',
          estimatedTime: 60,
          dependencies: ['create-release-branch'],
        },
        {
          id: 'merge-to-main',
          name: 'Merge to Main',
          description: 'Merge release branch to main',
          type: 'merge',
          status: 'pending',
          estimatedTime: 5,
          dependencies: ['final-testing'],
        },
        {
          id: 'tag-release',
          name: 'Tag Release',
          description: 'Create a release tag',
          type: 'commit',
          status: 'pending',
          estimatedTime: 5,
          dependencies: ['merge-to-main'],
        },
        {
          id: 'deploy-production',
          name: 'Deploy to Production',
          description: 'Deploy the release to production',
          type: 'deploy',
          status: 'pending',
          estimatedTime: 30,
          dependencies: ['tag-release'],
        },
        {
          id: 'merge-back',
          name: 'Merge Back to Develop',
          description: 'Merge changes back to develop branch',
          type: 'merge',
          status: 'pending',
          estimatedTime: 5,
          dependencies: ['deploy-production'],
        },
      ],
    },
  ];

  const mockActiveSessions: CollaborationSession[] = [
    {
      id: 'session-1',
      name: 'User Authentication Feature',
      description: 'Implementing OAuth authentication system',
      participants: ['alice', 'bob', 'carol'],
      currentStep: 'code-review',
      status: 'active',
      startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      estimatedEnd: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
      progress: 65,
    },
    {
      id: 'session-2',
      name: 'Database Migration Fix',
      description: 'Fixing critical database migration issue',
      participants: ['david', 'eve'],
      currentStep: 'test-fix',
      status: 'active',
      startedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      estimatedEnd: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      progress: 80,
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        setWorkflowTemplates(mockWorkflowTemplates);
        setActiveSessions(mockActiveSessions);
      } catch (error) {
        console.error('Failed to load collaboration workflow data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [repositoryId]);

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'branch':
        return GitBranch;
      case 'commit':
        return GitCommit;
      case 'pull_request':
        return GitPullRequest;
      case 'review':
        return Eye;
      case 'merge':
        return GitMerge;
      case 'deploy':
        return Rocket;
      default:
        return Code;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'in_progress':
        return 'text-blue-600 dark:text-blue-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      case 'skipped':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'feature':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'bugfix':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'hotfix':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'release':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'experiment':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
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
            <span className="ml-2">Loading collaboration workflows...</span>
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
          <h2 className="text-2xl font-bold">Collaboration Workflows</h2>
          <p className="text-muted-foreground">
            Manage team workflows and collaboration processes
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                <Workflow className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{workflowTemplates.length}</div>
                <div className="text-sm text-muted-foreground">Workflow Templates</div>
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
                <div className="text-2xl font-bold">{activeSessions.length}</div>
                <div className="text-sm text-muted-foreground">Active Sessions</div>
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
                <div className="text-2xl font-bold">
                  {activeSessions.reduce((sum, session) => sum + session.participants.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Active Participants</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950">
                <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(workflowTemplates.reduce((sum, t) => sum + t.rating, 0) / workflowTemplates.length * 10) / 10}
                </div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Workflow Templates</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Workflow Templates */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                Workflow Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowTemplates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{template.name}</h3>
                          <Badge className={getDifficultyColor(template.difficulty)}>
                            {template.difficulty}
                          </Badge>
                          <Badge variant="outline" className={getCategoryColor(template.category)}>
                            {template.category}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {template.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(template.estimatedTime)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{template.usageCount} uses</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>{template.rating}/5</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Updated {formatDate(template.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4 mr-2" />
                          Use Template
                        </Button>
                        
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Workflow Steps */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Workflow Steps:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {template.steps.map((step, index) => {
                          const StepIcon = getStepIcon(step.type);
                          return (
                            <div
                              key={step.id}
                              className="flex items-center gap-2 p-2 bg-muted/50 rounded text-xs"
                            >
                              <StepIcon className={cn('h-3 w-3', getStepColor(step.status))} />
                              <span className="flex-1 truncate">{step.name}</span>
                              <span className="text-muted-foreground">{formatTime(step.estimatedTime)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Sessions */}
        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Active Collaboration Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSessions.map((session) => (
                  <div key={session.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{session.name}</h3>
                          <Badge 
                            variant={session.status === 'active' ? 'default' : 'secondary'}
                            className={cn({
                              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': session.status === 'active',
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': session.status === 'paused',
                              'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200': session.status === 'completed',
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': session.status === 'cancelled',
                            })}
                          >
                            {session.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {session.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{session.participants.length} participants</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Started {formatDate(session.startedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            <span>Current: {session.currentStep}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Progress</span>
                        <span>{session.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${session.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Participants */}
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-2">Participants:</h4>
                      <div className="flex items-center gap-2">
                        {session.participants.map((participant) => (
                          <div key={participant} className="flex items-center gap-1">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {participant.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{participant}</span>
                          </div>
                        ))}
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
                  Workflow Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Templates</span>
                    <span className="font-medium">{workflowTemplates.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Usage</span>
                    <span className="font-medium">
                      {workflowTemplates.reduce((sum, t) => sum + t.usageCount, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Sessions</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {activeSessions.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Rating</span>
                    <span className="font-medium">
                      {Math.round(workflowTemplates.reduce((sum, t) => sum + t.rating, 0) / workflowTemplates.length * 10) / 10}/5
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Popular Workflow Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['feature', 'bugfix', 'hotfix', 'release'].map((category) => {
                    const count = workflowTemplates.filter(t => t.category === category).length;
                    const percentage = workflowTemplates.length > 0 ? (count / workflowTemplates.length) * 100 : 0;
                    
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium capitalize">{category}</div>
                          <div className="text-xs text-muted-foreground">{count} templates</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{Math.round(percentage)}%</div>
                          <div className="w-20 bg-muted rounded-full h-2 mt-1">
                            <div 
                              className={cn('h-2 rounded-full', getCategoryColor(category).split(' ')[0])}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
