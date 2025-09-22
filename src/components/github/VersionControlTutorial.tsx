'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Star, 
  Users, 
  Code, 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  GitMerge, 
  GitClone, 
  GitPush, 
  GitPull, 
  GitFetch, 
  GitCherryPick, 
  GitRebase, 
  GitStash, 
  GitTag, 
  GitLog, 
  GitDiff, 
  GitStatus, 
  GitAdd, 
  GitReset, 
  GitRevert, 
  GitBlame, 
  GitBisect, 
  GitSubmodule, 
  GitWorktree, 
  FileText, 
  Terminal, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Desktop, 
  Award, 
  Target, 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Calendar, 
  Clock as ClockIcon, 
  RefreshCw, 
  Download, 
  Upload, 
  Copy, 
  Share, 
  ExternalLink, 
  Settings, 
  Filter, 
  Search, 
  Plus, 
  Minus, 
  Edit, 
  Trash2, 
  Archive, 
  Folder, 
  FolderOpen, 
  File, 
  FileCode, 
  FileImage, 
  FileVideo, 
  FileAudio, 
  FileSpreadsheet, 
  FilePdf, 
  FileZip, 
  Database, 
  Server, 
  Cloud, 
  Shield, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Heart, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  AlertCircle, 
  Info, 
  HelpCircle, 
  Lightbulb, 
  Zap, 
  Rocket, 
  Globe, 
  Link, 
  Link2, 
  Unlink, 
  ArrowRight, 
  ArrowLeft, 
  ArrowUp, 
  ArrowDown, 
  ChevronRight, 
  ChevronLeft, 
  ChevronUp, 
  ChevronDown, 
  MoreHorizontal, 
  MoreVertical, 
  Menu, 
  X, 
  Check, 
  XCircle, 
  Circle, 
  Square, 
  Triangle, 
  Hexagon, 
  Octagon, 
  Diamond, 
  Star as StarIcon, 
  Heart as HeartIcon, 
  Smile, 
  Frown, 
  Meh, 
  Laugh, 
  Angry, 
  Sad, 
  Surprised, 
  Confused, 
  Wink, 
  Tongue, 
  Kiss, 
  Hug, 
  ThumbsUp as ThumbsUpIcon, 
  ThumbsDown as ThumbsDownIcon, 
  Hand, 
  Handshake, 
  Wave, 
  Clap, 
  Point, 
  Fingerprint, 
  Key, 
  Lock as LockIcon, 
  Unlock as UnlockIcon, 
  Shield as ShieldIcon, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  ShieldOff, 
  Security, 
  Privacy, 
  Anonymous, 
  Incognito, 
  Mask, 
  Glasses, 
  Sunglasses, 
  Eye as EyeIcon, 
  EyeOff as EyeOffIcon, 
  Visibility, 
  VisibilityOff, 
  Show, 
  Hide, 
  Reveal, 
  Conceal, 
  Expose, 
  Cover, 
  Uncover, 
  Open, 
  Close, 
  Start, 
  Stop, 
  Pause, 
  Resume, 
  Play as PlayIcon, 
  Pause as PauseIcon, 
  Stop as StopIcon, 
  Skip, 
  Previous, 
  Next, 
  First, 
  Last, 
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
  Target as TargetIcon, 
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
  Scale as ScaleIcon, 
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
  Light as LightIcon, 
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

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  content: string;
  command?: string;
  example?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  completed: boolean;
  prerequisites: string[];
}

interface TutorialModule {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  progress: number; // 0-100
  steps: TutorialStep[];
  completed: boolean;
}

interface VersionControlTutorialProps {
  className?: string;
}

export function VersionControlTutorial({ className }: VersionControlTutorialProps) {
  const [modules, setModules] = useState<TutorialModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<TutorialModule | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockModules: TutorialModule[] = [
    {
      id: 'git-basics',
      title: 'Git Basics',
      description: 'Learn the fundamental concepts of version control with Git',
      icon: GitCommit,
      difficulty: 'beginner',
      estimatedTime: 30,
      progress: 75,
      completed: false,
      steps: [
        {
          id: 'what-is-git',
          title: 'What is Git?',
          description: 'Understanding version control and Git',
          content: 'Git is a distributed version control system that tracks changes in source code during software development. It allows multiple developers to work together on the same project without conflicts.',
          difficulty: 'beginner',
          estimatedTime: 5,
          completed: true,
          prerequisites: [],
        },
        {
          id: 'git-installation',
          title: 'Installing Git',
          description: 'How to install Git on your system',
          content: 'Git can be installed on Windows, macOS, and Linux. Visit git-scm.com to download the latest version for your operating system.',
          command: 'git --version',
          example: 'git version 2.34.1',
          difficulty: 'beginner',
          estimatedTime: 10,
          completed: true,
          prerequisites: [],
        },
        {
          id: 'git-config',
          title: 'Git Configuration',
          description: 'Setting up your Git identity',
          content: 'Before using Git, you need to configure your name and email address. This information will be used in your commits.',
          command: 'git config --global user.name "Your Name"\ngit config --global user.email "your.email@example.com"',
          example: 'git config --global user.name "John Doe"\ngit config --global user.email "john@example.com"',
          difficulty: 'beginner',
          estimatedTime: 5,
          completed: true,
          prerequisites: ['git-installation'],
        },
        {
          id: 'git-init',
          title: 'Initializing a Repository',
          description: 'Creating your first Git repository',
          content: 'To start tracking changes in a project, you need to initialize a Git repository. This creates a .git folder that stores all the version control information.',
          command: 'git init',
          example: 'git init my-project',
          difficulty: 'beginner',
          estimatedTime: 5,
          completed: false,
          prerequisites: ['git-config'],
        },
        {
          id: 'git-status',
          title: 'Checking Status',
          description: 'Understanding the status of your repository',
          content: 'The git status command shows you the current state of your working directory and staging area.',
          command: 'git status',
          example: 'On branch main\n\nNo commits yet\n\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n        README.md',
          difficulty: 'beginner',
          estimatedTime: 5,
          completed: false,
          prerequisites: ['git-init'],
        },
      ],
    },
    {
      id: 'git-workflow',
      title: 'Git Workflow',
      description: 'Understanding the Git workflow and staging area',
      icon: GitBranch,
      difficulty: 'beginner',
      estimatedTime: 45,
      progress: 40,
      completed: false,
      steps: [
        {
          id: 'git-add',
          title: 'Adding Files',
          description: 'Staging files for commit',
          content: 'The git add command adds files to the staging area. Files in the staging area are ready to be committed.',
          command: 'git add <file>\ngit add .  # Add all files',
          example: 'git add README.md\ngit add .',
          difficulty: 'beginner',
          estimatedTime: 5,
          completed: true,
          prerequisites: ['git-status'],
        },
        {
          id: 'git-commit',
          title: 'Making Commits',
          description: 'Creating commits to save changes',
          content: 'A commit is a snapshot of your project at a specific point in time. Each commit has a unique hash and a commit message.',
          command: 'git commit -m "Your commit message"',
          example: 'git commit -m "Add initial project structure"',
          difficulty: 'beginner',
          estimatedTime: 5,
          completed: true,
          prerequisites: ['git-add'],
        },
        {
          id: 'git-log',
          title: 'Viewing History',
          description: 'Exploring commit history',
          content: 'The git log command shows the commit history of your repository. You can see who made changes, when, and what was changed.',
          command: 'git log\ngit log --oneline  # Compact view',
          example: 'commit abc123def456 (HEAD -> main)\nAuthor: John Doe <john@example.com>\nDate: Mon Jan 15 10:30:00 2024\n\n    Add initial project structure',
          difficulty: 'beginner',
          estimatedTime: 5,
          completed: false,
          prerequisites: ['git-commit'],
        },
        {
          id: 'git-diff',
          title: 'Viewing Changes',
          description: 'Comparing different versions of files',
          content: 'The git diff command shows the differences between different versions of files. It helps you understand what changes were made.',
          command: 'git diff\ngit diff --staged  # Show staged changes',
          example: 'diff --git a/README.md b/README.md\nindex 1234567..abcdefg 100644\n--- a/README.md\n+++ b/README.md\n@@ -1,3 +1,5 @@\n # My Project\n \n+This is a sample project.\n+',
          difficulty: 'beginner',
          estimatedTime: 10,
          completed: false,
          prerequisites: ['git-log'],
        },
      ],
    },
    {
      id: 'git-branching',
      title: 'Git Branching',
      description: 'Working with branches and merging',
      icon: GitMerge,
      difficulty: 'intermediate',
      estimatedTime: 60,
      progress: 20,
      completed: false,
      steps: [
        {
          id: 'git-branch',
          title: 'Creating Branches',
          description: 'Creating and managing branches',
          content: 'Branches allow you to work on different features or versions of your project simultaneously without affecting the main branch.',
          command: 'git branch <branch-name>\ngit checkout -b <branch-name>  # Create and switch',
          example: 'git branch feature-login\ngit checkout -b feature-login',
          difficulty: 'intermediate',
          estimatedTime: 10,
          completed: false,
          prerequisites: ['git-diff'],
        },
        {
          id: 'git-checkout',
          title: 'Switching Branches',
          description: 'Moving between branches',
          content: 'The git checkout command allows you to switch between different branches and restore files from previous commits.',
          command: 'git checkout <branch-name>\ngit checkout <commit-hash>  # Detached HEAD',
          example: 'git checkout main\ngit checkout feature-login',
          difficulty: 'intermediate',
          estimatedTime: 5,
          completed: false,
          prerequisites: ['git-branch'],
        },
        {
          id: 'git-merge',
          title: 'Merging Branches',
          description: 'Combining changes from different branches',
          content: 'Merging combines the changes from one branch into another. Git automatically merges changes when possible.',
          command: 'git merge <branch-name>',
          example: 'git checkout main\ngit merge feature-login',
          difficulty: 'intermediate',
          estimatedTime: 15,
          completed: false,
          prerequisites: ['git-checkout'],
        },
        {
          id: 'git-rebase',
          title: 'Rebasing',
          description: 'Rewriting commit history',
          content: 'Rebasing moves or combines commits to create a linear history. It\'s an alternative to merging that creates a cleaner history.',
          command: 'git rebase <branch-name>',
          example: 'git checkout feature-login\ngit rebase main',
          difficulty: 'advanced',
          estimatedTime: 20,
          completed: false,
          prerequisites: ['git-merge'],
        },
      ],
    },
    {
      id: 'github-basics',
      title: 'GitHub Basics',
      description: 'Working with GitHub and remote repositories',
      icon: Code,
      difficulty: 'intermediate',
      estimatedTime: 45,
      progress: 0,
      completed: false,
      steps: [
        {
          id: 'github-setup',
          title: 'GitHub Account Setup',
          description: 'Creating and configuring your GitHub account',
          content: 'GitHub is a web-based platform that provides Git repository hosting and collaboration features.',
          difficulty: 'beginner',
          estimatedTime: 10,
          completed: false,
          prerequisites: ['git-rebase'],
        },
        {
          id: 'git-clone',
          title: 'Cloning Repositories',
          description: 'Downloading existing repositories',
          content: 'Cloning creates a local copy of a remote repository. This is how you get started with existing projects.',
          command: 'git clone <repository-url>',
          example: 'git clone https://github.com/user/repo.git',
          difficulty: 'beginner',
          estimatedTime: 5,
          completed: false,
          prerequisites: ['github-setup'],
        },
        {
          id: 'git-remote',
          title: 'Working with Remotes',
          description: 'Managing remote repositories',
          content: 'Remotes are references to remote repositories. You can have multiple remotes for the same local repository.',
          command: 'git remote add origin <url>\ngit remote -v  # List remotes',
          example: 'git remote add origin https://github.com/user/repo.git',
          difficulty: 'intermediate',
          estimatedTime: 10,
          completed: false,
          prerequisites: ['git-clone'],
        },
        {
          id: 'git-push',
          title: 'Pushing Changes',
          description: 'Uploading changes to remote repository',
          content: 'Pushing uploads your local commits to the remote repository. This makes your changes available to others.',
          command: 'git push origin <branch-name>',
          example: 'git push origin main',
          difficulty: 'intermediate',
          estimatedTime: 5,
          completed: false,
          prerequisites: ['git-remote'],
        },
        {
          id: 'git-pull',
          title: 'Pulling Changes',
          description: 'Downloading changes from remote repository',
          content: 'Pulling downloads changes from the remote repository and merges them into your current branch.',
          command: 'git pull origin <branch-name>',
          example: 'git pull origin main',
          difficulty: 'intermediate',
          estimatedTime: 5,
          completed: false,
          prerequisites: ['git-push'],
        },
      ],
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        setModules(mockModules);
        setSelectedModule(mockModules[0]);
      } catch (error) {
        console.error('Failed to load tutorial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
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

  const handleStepComplete = (moduleId: string, stepId: string) => {
    setModules(prev => prev.map(module => {
      if (module.id === moduleId) {
        const updatedSteps = module.steps.map(step => 
          step.id === stepId ? { ...step, completed: true } : step
        );
        const completedSteps = updatedSteps.filter(step => step.completed).length;
        const progress = (completedSteps / updatedSteps.length) * 100;
        const completed = progress === 100;
        
        return {
          ...module,
          steps: updatedSteps,
          progress,
          completed,
        };
      }
      return module;
    }));
  };

  const handleNextStep = () => {
    if (selectedModule && currentStep < selectedModule.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading tutorials...</span>
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
          <h2 className="text-2xl font-bold">Version Control Tutorials</h2>
          <p className="text-muted-foreground">
            Learn Git and GitHub from basics to advanced concepts
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Progress
          </Button>
          
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Certificate
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{modules.length}</div>
                <div className="text-sm text-muted-foreground">Total Modules</div>
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
                <div className="text-2xl font-bold">
                  {modules.filter(m => m.completed).length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950">
                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {modules.reduce((sum, m) => sum + m.estimatedTime, 0)}m
                </div>
                <div className="text-sm text-muted-foreground">Total Time</div>
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
                  {Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length)}%
                </div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Tutorial Modules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className={cn(
                      'p-3 border rounded-lg cursor-pointer transition-colors',
                      selectedModule?.id === module.id
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-muted/50'
                    )}
                    onClick={() => {
                      setSelectedModule(module);
                      setCurrentStep(0);
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <module.icon className="h-5 w-5 text-primary" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{module.title}</h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {module.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getDifficultyColor(module.difficulty)}>
                        {module.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(module.estimatedTime)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Progress</span>
                        <span>{Math.round(module.progress)}%</span>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tutorial Content */}
        <div className="lg:col-span-2">
          {selectedModule && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <selectedModule.icon className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle>{selectedModule.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {selectedModule.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(selectedModule.difficulty)}>
                      {selectedModule.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {formatTime(selectedModule.estimatedTime)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs value={currentStep.toString()} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-5">
                    {selectedModule.steps.map((step, index) => (
                      <TabsTrigger
                        key={step.id}
                        value={index.toString()}
                        onClick={() => setCurrentStep(index)}
                        className={cn(
                          'flex items-center gap-1',
                          step.completed && 'text-green-600 dark:text-green-400'
                        )}
                      >
                        {step.completed ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <Circle className="h-3 w-3" />
                        )}
                        <span className="hidden sm:inline">{index + 1}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {selectedModule.steps.map((step, index) => (
                    <TabsContent key={step.id} value={index.toString()}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{step.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge className={getDifficultyColor(step.difficulty)}>
                              {step.difficulty}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{formatTime(step.estimatedTime)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="prose prose-sm max-w-none">
                          <p>{step.content}</p>
                        </div>

                        {step.command && (
                          <div className="space-y-2">
                            <h4 className="font-medium">Command:</h4>
                            <div className="bg-muted p-3 rounded-lg">
                              <pre className="text-sm font-mono whitespace-pre-wrap">
                                {step.command}
                              </pre>
                            </div>
                          </div>
                        )}

                        {step.example && (
                          <div className="space-y-2">
                            <h4 className="font-medium">Example:</h4>
                            <div className="bg-muted p-3 rounded-lg">
                              <pre className="text-sm font-mono whitespace-pre-wrap">
                                {step.example}
                              </pre>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={handlePrevStep}
                            disabled={currentStep === 0}
                          >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Previous
                          </Button>
                          
                          <div className="flex items-center gap-2">
                            {!step.completed && (
                              <Button
                                onClick={() => handleStepComplete(selectedModule.id, step.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark Complete
                              </Button>
                            )}
                            
                            <Button
                              onClick={handleNextStep}
                              disabled={currentStep === selectedModule.steps.length - 1}
                            >
                              Next
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
