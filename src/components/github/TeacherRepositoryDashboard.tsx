'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  BookOpen, 
  Code, 
  GitBranch, 
  GitPullRequest, 
  GitCommit, 
  Star, 
  GitFork, 
  Eye, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Settings,
  Filter,
  Search,
  Download,
  Upload,
  Copy,
  ExternalLink,
  Trash2,
  Edit,
  Share,
  Lock,
  Globe,
  BarChart3,
  Activity,
  TrendingUp,
  Target,
  Award,
  Users2,
  FileText,
  Zap,
  Shield,
  Package,
  RefreshCw,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Play,
  Square,
  Pause,
  RotateCcw,
  Archive,
  Tag,
  Branch,
  GitMerge,
  GitCommit,
  History,
  Download as DownloadIcon,
  Upload as UploadIcon,
  FolderOpen,
  FileCode,
  Database,
  Server,
  Cloud,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop
} from 'lucide-react';
import { 
  GitHubRepository, 
  GitHubUser, 
  GitHubCommit,
  GitHubPullRequest
} from '@/types/github';
import { cn } from '@/lib/utils';

interface TeacherRepositoryDashboardProps {
  teacherId: string;
  className?: string;
}

interface AssignmentRepository {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  repositoryId: number;
  repositoryName: string;
  repositoryUrl: string;
  templateRepositoryId?: number;
  templateRepositoryName?: string;
  studentCount: number;
  submissionCount: number;
  lastActivity: string;
  status: 'active' | 'archived' | 'draft';
  language: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  dueDate: string;
  createdAt: string;
}

interface StudentProgress {
  studentId: string;
  studentName: string;
  studentEmail: string;
  avatarUrl?: string;
  repositoryUrl: string;
  commitsCount: number;
  lastCommit: string;
  pullRequestsCount: number;
  issuesCount: number;
  progress: number; // 0-100
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
}

export function TeacherRepositoryDashboard({ teacherId, className }: TeacherRepositoryDashboardProps) {
  const [assignmentRepositories, setAssignmentRepositories] = useState<AssignmentRepository[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assignments');
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentRepository | null>(null);

  // Mock data for demonstration
  const mockAssignmentRepositories: AssignmentRepository[] = [
    {
      id: '1',
      assignmentId: 'assign-1',
      assignmentTitle: 'React Todo Application',
      repositoryId: 1,
      repositoryName: 'react-todo-template',
      repositoryUrl: 'https://github.com/teacher/react-todo-template',
      templateRepositoryId: 1,
      templateRepositoryName: 'react-todo-template',
      studentCount: 25,
      submissionCount: 18,
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      language: 'JavaScript',
      difficulty: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      assignmentId: 'assign-2',
      assignmentTitle: 'Python Data Analysis Project',
      repositoryId: 2,
      repositoryName: 'python-data-analysis-template',
      repositoryUrl: 'https://github.com/teacher/python-data-analysis-template',
      templateRepositoryId: 2,
      templateRepositoryName: 'python-data-analysis-template',
      studentCount: 20,
      submissionCount: 15,
      lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      language: 'Python',
      difficulty: 'hard',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      assignmentId: 'assign-3',
      assignmentTitle: 'Web Scraping with BeautifulSoup',
      repositoryId: 3,
      repositoryName: 'web-scraping-template',
      repositoryUrl: 'https://github.com/teacher/web-scraping-template',
      templateRepositoryId: 3,
      templateRepositoryName: 'web-scraping-template',
      studentCount: 15,
      submissionCount: 12,
      lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'archived',
      language: 'Python',
      difficulty: 'easy',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const mockStudentProgress: StudentProgress[] = [
    {
      studentId: 'student-1',
      studentName: 'Alice Johnson',
      studentEmail: 'alice@example.com',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
      repositoryUrl: 'https://github.com/alice/react-todo-app',
      commitsCount: 12,
      lastCommit: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      pullRequestsCount: 3,
      issuesCount: 1,
      progress: 85,
      status: 'in_progress',
    },
    {
      studentId: 'student-2',
      studentName: 'Bob Smith',
      studentEmail: 'bob@example.com',
      avatarUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
      repositoryUrl: 'https://github.com/bob/react-todo-app',
      commitsCount: 8,
      lastCommit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      pullRequestsCount: 2,
      issuesCount: 0,
      progress: 60,
      status: 'in_progress',
    },
    {
      studentId: 'student-3',
      studentName: 'Carol Davis',
      studentEmail: 'carol@example.com',
      avatarUrl: 'https://avatars.githubusercontent.com/u/3?v=4',
      repositoryUrl: 'https://github.com/carol/react-todo-app',
      commitsCount: 15,
      lastCommit: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      pullRequestsCount: 4,
      issuesCount: 2,
      progress: 100,
      status: 'completed',
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAssignmentRepositories(mockAssignmentRepositories);
        setStudentProgress(mockStudentProgress);
      } catch (error) {
        console.error('Failed to load teacher repository data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [teacherId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'expert':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 dark:text-green-400';
    if (progress >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (progress >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
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

  const totalAssignments = assignmentRepositories.length;
  const activeAssignments = assignmentRepositories.filter(a => a.status === 'active').length;
  const totalStudents = assignmentRepositories.reduce((sum, a) => sum + a.studentCount, 0);
  const totalSubmissions = assignmentRepositories.reduce((sum, a) => sum + a.submissionCount, 0);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading repository data...</span>
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
          <h2 className="text-2xl font-bold">Repository Management</h2>
          <p className="text-muted-foreground">
            Manage assignment repositories and track student progress
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment Repository
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalAssignments}</div>
                <div className="text-sm text-muted-foreground">Total Assignments</div>
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
                <div className="text-2xl font-bold">{activeAssignments}</div>
                <div className="text-sm text-muted-foreground">Active</div>
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
                <div className="text-2xl font-bold">{totalStudents}</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950">
                <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalSubmissions}</div>
                <div className="text-sm text-muted-foreground">Submissions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assignments">Assignment Repositories</TabsTrigger>
          <TabsTrigger value="students">Student Progress</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Assignment Repositories */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Assignment Repositories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignmentRepositories.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                        <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">{assignment.assignmentTitle}</h3>
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status}
                          </Badge>
                          <Badge variant="outline" className={getDifficultyColor(assignment.difficulty)}>
                            {assignment.difficulty}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          Repository: {assignment.repositoryName}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{assignment.studentCount} students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>{assignment.submissionCount} submissions</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Due {formatDate(assignment.dueDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Updated {formatDate(assignment.lastActivity)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={assignment.repositoryUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
                        </a>
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Student Progress */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Student Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentProgress.map((student) => (
                  <div key={student.studentId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.avatarUrl} />
                        <AvatarFallback>
                          {student.studentName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium">{student.studentName}</h3>
                        <p className="text-sm text-muted-foreground">{student.studentEmail}</p>
                        
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <GitCommit className="h-3 w-3" />
                            <span>{student.commitsCount} commits</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GitPullRequest className="h-3 w-3" />
                            <span>{student.pullRequestsCount} PRs</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            <span>{student.issuesCount} issues</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Last commit {formatDate(student.lastCommit)}</span>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span className={cn('font-medium', getProgressColor(student.progress))}>
                              {student.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={cn('h-2 rounded-full', {
                                'bg-green-500': student.progress >= 80,
                                'bg-yellow-500': student.progress >= 60 && student.progress < 80,
                                'bg-orange-500': student.progress >= 40 && student.progress < 60,
                                'bg-red-500': student.progress < 40,
                              })}
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={student.status === 'completed' ? 'default' : 'secondary'}
                        className={cn({
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': student.status === 'completed',
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': student.status === 'in_progress',
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': student.status === 'overdue',
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200': student.status === 'not_started',
                        })}
                      >
                        {student.status.replace('_', ' ')}
                      </Badge>
                      
                      <Button variant="outline" size="sm" asChild>
                        <a href={student.repositoryUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Repo
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
                  Assignment Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Assignments</span>
                    <span className="font-medium">{totalAssignments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Assignments</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{activeAssignments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Students</span>
                    <span className="font-medium">{totalStudents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Submissions</span>
                    <span className="font-medium">{totalSubmissions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Submission Rate</span>
                    <span className="font-medium">
                      {totalStudents > 0 ? Math.round((totalSubmissions / totalStudents) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Language Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['JavaScript', 'Python', 'TypeScript', 'Java'].map((language) => {
                    const count = assignmentRepositories.filter(a => a.language === language).length;
                    const percentage = totalAssignments > 0 ? (count / totalAssignments) * 100 : 0;
                    
                    return (
                      <div key={language} className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{language}</div>
                          <div className="text-xs text-muted-foreground">{count} assignments</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{Math.round(percentage)}%</div>
                          <div className="w-20 bg-muted rounded-full h-2 mt-1">
                            <div 
                              className="bg-primary h-2 rounded-full"
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
