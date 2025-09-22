import { 
  Home, 
  BookOpen, 
  Users, 
  ClipboardList, 
  Trophy, 
  MessageSquare, 
  User, 
  BarChart3,
  Settings,
  Code,
  Calendar,
  Bell,
  Search,
  Plus,
  Menu,
  ChevronDown,
  ChevronRight,
  Activity,
  Target,
  Award,
  Globe,
  Zap,
  FileText,
  Video,
  PenTool,
  CheckCircle,
  Star,
  GitCommit,
  GitPullRequest
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavigationItem[];
  roles?: string[];
  description?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  roles?: string[];
  onClick?: () => void;
}

// Main navigation items
export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview and quick stats',
  },
  {
    id: 'classes',
    label: 'My Classes',
    href: '/dashboard/classes',
    icon: BookOpen,
    roles: ['STUDENT'],
    description: 'View your enrolled classes',
    children: [
      {
        id: 'classes-active',
        label: 'Active Classes',
        href: '/dashboard/classes/active',
        icon: Activity,
      },
      {
        id: 'classes-archived',
        label: 'Archived Classes',
        href: '/dashboard/classes/archived',
        icon: FileText,
      },
    ],
  },
  {
    id: 'manage-classes',
    label: 'Manage Classes',
    href: '/dashboard/classes/manage',
    icon: Users,
    roles: ['TEACHER', 'ADMIN'],
    description: 'Create and manage classes',
    children: [
      {
        id: 'create-class',
        label: 'Create Class',
        href: '/dashboard/classes/create',
        icon: Plus,
      },
      {
        id: 'class-analytics',
        label: 'Class Analytics',
        href: '/dashboard/classes/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    id: 'assignments',
    label: 'Assignments',
    href: '/dashboard/assignments',
    icon: ClipboardList,
    badge: 3,
    description: 'View and manage assignments',
    children: [
      {
        id: 'assignments-active',
        label: 'Active',
        href: '/dashboard/assignments/active',
        icon: Activity,
      },
      {
        id: 'assignments-completed',
        label: 'Completed',
        href: '/dashboard/assignments/completed',
        icon: CheckCircle,
      },
      {
        id: 'assignments-graded',
        label: 'Graded',
        href: '/dashboard/assignments/graded',
        icon: Award,
      },
    ],
  },
  {
    id: 'leaderboard',
    label: 'Leaderboard',
    href: '/dashboard/leaderboard',
    icon: Trophy,
    description: 'Class rankings and achievements',
  },
  {
    id: 'collaboration',
    label: 'Collaboration',
    href: '/dashboard/collaboration',
    icon: Users,
    description: 'Live coding sessions',
    children: [
      {
        id: 'live-sessions',
        label: 'Live Sessions',
        href: '/dashboard/collaboration/live',
        icon: Video,
      },
      {
        id: 'pair-programming',
        label: 'Pair Programming',
        href: '/dashboard/collaboration/pair',
        icon: Code,
      },
    ],
  },
  {
    id: 'forums',
    label: 'Forums',
    href: '/dashboard/forums',
    icon: MessageSquare,
    badge: 5,
    description: 'Discussions and Q&A',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    roles: ['TEACHER', 'ADMIN'],
    description: 'Class performance insights',
  },
    {
      id: 'gamification',
      label: 'Gamification',
      href: '/dashboard/gamification',
      icon: Trophy,
      description: 'Track progress, compete, and unlock achievements',
      roles: ['STUDENT', 'TEACHER', 'ADMIN'],
      children: [
        { id: 'overview', label: 'Overview', href: '/dashboard/gamification', icon: Activity, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
        { id: 'leaderboards', label: 'Leaderboards', href: '/dashboard/gamification?tab=leaderboards', icon: Trophy, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
        { id: 'achievements', label: 'Achievements', href: '/dashboard/gamification?tab=achievements', icon: Award, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
        { id: 'progress', label: 'Progress', href: '/dashboard/gamification?tab=progress', icon: BarChart3, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
        { id: 'challenges', label: 'Challenges', href: '/dashboard/challenges', icon: Target, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
        { id: 'goals', label: 'Goals', href: '/dashboard/goals', icon: Target, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
      ],
    },
    {
      id: 'collaborate',
      label: 'Collaborate',
      href: '/dashboard/collaborate',
      icon: Users,
      description: 'Real-time coding collaboration and communication',
      roles: ['STUDENT', 'TEACHER', 'ADMIN'],
      children: [
        { id: 'sessions', label: 'My Sessions', href: '/dashboard/collaborate', icon: Users, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
        { id: 'public', label: 'Public Sessions', href: '/dashboard/collaborate?tab=public-sessions', icon: Globe, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
        { id: 'templates', label: 'Templates', href: '/dashboard/collaborate?tab=templates', icon: Star, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
        { id: 'create', label: 'Create Session', href: '/dashboard/collaborate?tab=create', icon: Plus, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
      description: 'Comprehensive analytics and reporting dashboard',
      roles: ['STUDENT', 'TEACHER', 'ADMIN'],
      children: [
        { id: 'overview', label: 'Overview', href: '/dashboard/analytics', icon: BarChart3, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
        { id: 'student', label: 'Student Analytics', href: '/dashboard/analytics/student', icon: Users, roles: ['STUDENT'] },
        { id: 'teacher', label: 'Teacher Analytics', href: '/dashboard/analytics/teacher', icon: BookOpen, roles: ['TEACHER'] },
        { id: 'admin', label: 'Admin Analytics', href: '/dashboard/analytics/admin', icon: BarChart3, roles: ['ADMIN'] },
      ],
    },
  {
    id: 'github',
    label: 'GitHub',
    href: '/dashboard/github',
    icon: Code,
    description: 'GitHub integration and version control management',
    roles: ['STUDENT', 'TEACHER', 'ADMIN'],
    children: [
      { id: 'overview', label: 'Overview', href: '/dashboard/github', icon: Code, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
      { id: 'repositories', label: 'Repositories', href: '/dashboard/github?tab=repositories', icon: Code, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
      { id: 'commits', label: 'Commits', href: '/dashboard/github?tab=commits', icon: GitCommit, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
      { id: 'pull-requests', label: 'Pull Requests', href: '/dashboard/github?tab=pull-requests', icon: GitPullRequest, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
      { id: 'cicd', label: 'CI/CD', href: '/dashboard/github?tab=cicd', icon: Zap, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
    ],
  },
  {
    id: 'admin',
    label: 'Admin',
    href: '/dashboard/admin',
    icon: Settings,
    description: 'Administrative functions and user management',
    roles: ['ADMIN'],
    children: [
      { id: 'role-requests', label: 'Role Requests', href: '/dashboard/admin/role-requests', icon: Users, roles: ['ADMIN'] },
      { id: 'user-management', label: 'User Management', href: '/dashboard/admin/users', icon: User, roles: ['ADMIN'] },
      { id: 'system-settings', label: 'System Settings', href: '/dashboard/admin/settings', icon: Settings, roles: ['ADMIN'] },
    ],
  },
];

// Profile and settings items
export const profileItems: NavigationItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    href: '/dashboard/profile',
    icon: User,
    description: 'View and edit your profile',
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'Account and app settings',
  },
];

// Quick actions
export const quickActions: QuickAction[] = [
  {
    id: 'create-assignment',
    label: 'Create Assignment',
    href: '/dashboard/assignments/create',
    icon: Plus,
    description: 'Create a new assignment',
    roles: ['TEACHER', 'ADMIN'],
  },
  {
    id: 'join-collaboration',
    label: 'Join Collaboration',
    href: '/dashboard/collaboration/join',
    icon: Users,
    description: 'Join a live coding session',
  },
  {
    id: 'start-coding',
    label: 'Start Coding',
    href: '/dashboard/coding',
    icon: Code,
    description: 'Open the code editor',
  },
  {
    id: 'view-schedule',
    label: 'View Schedule',
    href: '/dashboard/schedule',
    icon: Calendar,
    description: 'Check your upcoming events',
  },
];

// Filter navigation items by role
export function getNavigationForRole(role: string): NavigationItem[] {
  return navigationItems.filter(item => 
    !item.roles || item.roles.includes(role)
  );
}

// Get quick actions for role
export function getQuickActionsForRole(role: string): QuickAction[] {
  return quickActions.filter(action => 
    !action.roles || action.roles.includes(role)
  );
}

// Search suggestions
export const searchSuggestions = [
  { label: 'Assignments', href: '/dashboard/assignments', category: 'Navigation' },
  { label: 'Classes', href: '/dashboard/classes', category: 'Navigation' },
  { label: 'Leaderboard', href: '/dashboard/leaderboard', category: 'Navigation' },
  { label: 'Profile Settings', href: '/dashboard/settings', category: 'Settings' },
  { label: 'Create Assignment', href: '/dashboard/assignments/create', category: 'Actions' },
  { label: 'Join Collaboration', href: '/dashboard/collaboration', category: 'Actions' },
];

// Breadcrumb mapping
export const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/overview': 'Overview',
  '/dashboard/classes': 'Classes',
  '/dashboard/assignments': 'Assignments',
  '/dashboard/leaderboard': 'Leaderboard',
  '/dashboard/collaboration': 'Collaboration',
  '/dashboard/forums': 'Forums',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/profile': 'Profile',
  '/dashboard/settings': 'Settings',
};

// Helper function to get breadcrumbs from pathname
export function getBreadcrumbsFromPath(pathname: string): Array<{ label: string; href?: string }> {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: Array<{ label: string; href?: string }> = [];
  
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = breadcrumbMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    breadcrumbs.push({
      label,
      href: index === segments.length - 1 ? undefined : currentPath,
    });
  });
  
  return breadcrumbs;
}
