'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Award,
  MessageSquare,
  Code,
  Download,
  Share,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Minus,
  Calendar,
  Activity,
  Brain,
  Zap
} from 'lucide-react';
import { 
  TeacherAnalytics, 
  TimeRange, 
  StudentSummary,
  AtRiskStudent,
  ErrorPattern,
  GradeDistribution,
  AtRiskPrediction,
  PerformanceForecast,
  InterventionRecommendation
} from '@/types/analytics';
import { MetricCard } from '@/components/analytics/MetricCard';
import { ProgressChart } from '@/components/analytics/ProgressChart';
import { cn } from '@/lib/utils';

export default function TeacherAnalyticsPage() {
  const [analytics, setAnalytics] = useState<TeacherAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('MONTHLY');
  const [refreshing, setRefreshing] = useState(false);

  // Mock analytics data
  const mockAnalytics: TeacherAnalytics = {
    teacherId: 'teacher1',
    timeRange: 'MONTHLY',
    period: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(),
    },
    
    classOverview: {
      totalClasses: 4,
      totalStudents: 89,
      activeStudents: 76,
      averageClassSize: 22.25,
      studentEngagement: 84.5,
      overallPerformance: 87.2,
    },
    
    studentProgress: {
      topPerformers: [
        {
          id: 'student1',
          name: 'Alice Johnson',
          performance: 95.2,
          engagement: 92.1,
          improvement: 8.5,
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
          assignmentsCompleted: 18,
          averageGrade: 94.5,
        },
        {
          id: 'student2',
          name: 'Bob Smith',
          performance: 91.8,
          engagement: 88.3,
          improvement: 12.2,
          lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000),
          assignmentsCompleted: 17,
          averageGrade: 91.2,
        },
        {
          id: 'student3',
          name: 'Carol Davis',
          performance: 89.4,
          engagement: 85.7,
          improvement: 6.8,
          lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
          assignmentsCompleted: 16,
          averageGrade: 89.1,
        },
      ],
      strugglingStudents: [
        {
          id: 'student4',
          name: 'David Wilson',
          performance: 65.3,
          engagement: 58.2,
          improvement: -3.2,
          lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
          assignmentsCompleted: 8,
          averageGrade: 67.8,
        },
        {
          id: 'student5',
          name: 'Eva Brown',
          performance: 62.1,
          engagement: 54.6,
          improvement: -5.1,
          lastActive: new Date(Date.now() - 48 * 60 * 60 * 1000),
          assignmentsCompleted: 6,
          averageGrade: 64.2,
        },
      ],
      atRiskStudents: [
        {
          id: 'student6',
          name: 'Frank Miller',
          riskLevel: 'HIGH',
          riskFactors: ['Low engagement', 'Missing assignments', 'Declining grades'],
          lastActive: new Date(Date.now() - 72 * 60 * 60 * 1000),
          assignmentsOverdue: 4,
          gradeTrend: 'DECLINING',
          interventionNeeded: true,
        },
        {
          id: 'student7',
          name: 'Grace Taylor',
          riskLevel: 'MEDIUM',
          riskFactors: ['Inconsistent participation', 'Below average performance'],
          lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
          assignmentsOverdue: 2,
          gradeTrend: 'STABLE',
          interventionNeeded: false,
        },
      ],
      improvementTrends: [
        {
          studentId: 'student1',
          metric: 'Assignment Completion',
          trend: 'IMPROVING',
          changeRate: 15.2,
          period: 'Last 30 days',
        },
        {
          studentId: 'student2',
          metric: 'Code Quality',
          trend: 'IMPROVING',
          changeRate: 8.7,
          period: 'Last 30 days',
        },
        {
          studentId: 'student4',
          metric: 'Engagement',
          trend: 'DECLINING',
          changeRate: -12.3,
          period: 'Last 30 days',
        },
      ],
    },
    
    assignmentAnalysis: {
      totalAssignments: 24,
      averageCompletionRate: 87.3,
      averageGrade: 84.7,
      difficultyEffectiveness: {
        'Easy': 0.92,
        'Medium': 0.85,
        'Hard': 0.78,
        'Expert': 0.65,
      },
      commonErrors: [
        {
          error: 'Syntax errors in JavaScript',
          frequency: 45,
          severity: 'MEDIUM',
          affectedStudents: 23,
          commonSolutions: ['Use a linter', 'Practice basic syntax'],
          preventionTips: ['Review syntax before submitting', 'Use IDE features'],
        },
        {
          error: 'Logic errors in algorithms',
          frequency: 38,
          severity: 'HIGH',
          affectedStudents: 19,
          commonSolutions: ['Trace through code step by step', 'Use debugging tools'],
          preventionTips: ['Plan algorithm before coding', 'Test with sample inputs'],
        },
        {
          error: 'Missing edge cases',
          frequency: 32,
          severity: 'MEDIUM',
          affectedStudents: 16,
          commonSolutions: ['Consider boundary conditions', 'Test edge cases'],
          preventionTips: ['Think about all possible inputs', 'Write comprehensive tests'],
        },
      ],
      gradingDistribution: {
        excellent: 25, // 90-100
        good: 35, // 80-89
        satisfactory: 28, // 70-79
        needsImprovement: 10, // 60-69
        failing: 2, // 0-59
      },
    },
    
    engagement: {
      participationRate: 78.5,
      collaborationActivity: 65.2,
      forumParticipation: 42.8,
      helpSeekingBehavior: 34.1,
      resourceUsage: [
        {
          resource: 'Video Tutorials',
          usageCount: 156,
          effectiveness: 8.5,
          studentSatisfaction: 9.2,
          recommendations: ['Add more interactive examples', 'Include practice exercises'],
        },
        {
          resource: 'Documentation',
          usageCount: 89,
          effectiveness: 7.8,
          studentSatisfaction: 8.1,
          recommendations: ['Improve search functionality', 'Add visual diagrams'],
        },
        {
          resource: 'Peer Reviews',
          usageCount: 67,
          effectiveness: 9.1,
          studentSatisfaction: 8.8,
          recommendations: ['Increase frequency', 'Provide review guidelines'],
        },
      ],
    },
    
    predictions: {
      atRiskStudents: [
        {
          studentId: 'student6',
          probability: 0.78,
          timeframe: 'Next 2 weeks',
          factors: ['Declining engagement', 'Missing assignments', 'Low forum participation'],
          confidence: 0.85,
        },
        {
          studentId: 'student7',
          probability: 0.45,
          timeframe: 'Next month',
          factors: ['Inconsistent performance', 'Below average collaboration'],
          confidence: 0.72,
        },
      ],
      performanceForecasts: [
        {
          studentId: 'student1',
          currentPerformance: 95.2,
          predictedPerformance: 97.1,
          confidence: 0.88,
          timeframe: 'Next month',
          factors: ['Consistent improvement', 'High engagement', 'Active participation'],
        },
        {
          studentId: 'student4',
          currentPerformance: 65.3,
          predictedPerformance: 58.7,
          confidence: 0.82,
          timeframe: 'Next month',
          factors: ['Declining trend', 'Low engagement', 'Missing assignments'],
        },
      ],
      interventionRecommendations: [
        {
          studentId: 'student6',
          type: 'SUPPORT',
          priority: 'HIGH',
          description: 'Provide additional one-on-one support and create a personalized learning plan',
          expectedOutcome: 'Improved engagement and assignment completion',
          resources: ['Tutoring sessions', 'Study group assignment', 'Modified assignments'],
        },
        {
          studentId: 'student7',
          type: 'CHALLENGE',
          priority: 'MEDIUM',
          description: 'Assign more challenging tasks to increase motivation',
          expectedOutcome: 'Higher engagement and improved performance',
          resources: ['Advanced projects', 'Peer mentoring', 'Bonus challenges'],
        },
      ],
    },
  };

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalytics(mockAnalytics);
      setLoading(false);
    };

    loadAnalytics();
  }, [timeRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setRefreshing(false);
  };

  const handleExport = () => {
    console.log('Exporting teacher analytics...');
  };

  const handleShare = () => {
    console.log('Sharing analytics...');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading class analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Failed to load analytics data</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Class Analytics</h1>
            <p className="text-muted-foreground">
              Monitor student progress and class performance
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="YEARLY">Yearly</option>
            </select>
            
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
              Refresh
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Students"
            value={analytics.classOverview.totalStudents}
            unit=""
            trend={5.2}
            icon={<Users className="h-4 w-4" />}
            color="blue"
          />
          
          <MetricCard
            title="Active Students"
            value={analytics.classOverview.activeStudents}
            unit=""
            trend={8.7}
            icon={<Activity className="h-4 w-4" />}
            color="green"
          />
          
          <MetricCard
            title="Engagement Rate"
            value={analytics.classOverview.studentEngagement}
            unit="%"
            trend={3.1}
            icon={<Brain className="h-4 w-4" />}
            color="orange"
          />
          
          <MetricCard
            title="Average Performance"
            value={analytics.classOverview.overallPerformance}
            unit="%"
            trend={2.8}
            icon={<Award className="h-4 w-4" />}
            color="purple"
          />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Class Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Class Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Classes</span>
                      <span className="font-medium">{analytics.classOverview.totalClasses}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average Class Size</span>
                      <span className="font-medium">{analytics.classOverview.averageClassSize.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Student Engagement</span>
                      <span className="font-medium">{analytics.classOverview.studentEngagement.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Overall Performance</span>
                      <span className="font-medium">{analytics.classOverview.overallPerformance.toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Grade Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Grade Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics.assignmentAnalysis.gradingDistribution).map(([grade, count]) => (
                      <div key={grade} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground capitalize">
                          {grade.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(count / 100) * 100}%` }}
                            />
                          </div>
                          <span className="font-medium text-sm w-8">{count}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Users className="h-6 w-6" />
                    <span>View All Students</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <AlertCircle className="h-6 w-6" />
                    <span>At-Risk Students</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <BookOpen className="h-6 w-6" />
                    <span>Assignment Analysis</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.studentProgress.topPerformers.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {student.assignmentsCompleted} assignments • Avg: {student.averageGrade.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="font-medium text-green-600 dark:text-green-400">
                            {student.performance.toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Performance</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-blue-600 dark:text-blue-400">
                            {student.engagement.toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Engagement</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-orange-600 dark:text-orange-400">
                            +{student.improvement.toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Improvement</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* At-Risk Students */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  At-Risk Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.studentProgress.atRiskStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {student.assignmentsOverdue} overdue • {student.gradeTrend.toLowerCase()} trend
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {student.riskFactors.map((factor, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            student.riskLevel === 'HIGH' ? 'destructive' :
                            student.riskLevel === 'MEDIUM' ? 'default' : 'secondary'
                          }
                        >
                          {student.riskLevel}
                        </Badge>
                        {student.interventionNeeded && (
                          <Button size="sm" variant="outline">
                            <Target className="h-4 w-4 mr-2" />
                            Intervene
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Assignment Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Assignment Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Assignments</span>
                      <span className="font-medium">{analytics.assignmentAnalysis.totalAssignments}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Completion Rate</span>
                      <span className="font-medium">{analytics.assignmentAnalysis.averageCompletionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average Grade</span>
                      <span className="font-medium">{analytics.assignmentAnalysis.averageGrade.toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Common Errors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Common Errors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.assignmentAnalysis.commonErrors.map((error, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{error.error}</span>
                          <Badge 
                            variant={
                              error.severity === 'HIGH' ? 'destructive' :
                              error.severity === 'MEDIUM' ? 'default' : 'secondary'
                            }
                          >
                            {error.severity}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {error.frequency} occurrences • {error.affectedStudents} students affected
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <strong>Solutions:</strong> {error.commonSolutions.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Engagement Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Engagement Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Participation Rate</span>
                      <span className="font-medium">{analytics.engagement.participationRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Collaboration Activity</span>
                      <span className="font-medium">{analytics.engagement.collaborationActivity.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Forum Participation</span>
                      <span className="font-medium">{analytics.engagement.forumParticipation.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Help Seeking</span>
                      <span className="font-medium">{analytics.engagement.helpSeekingBehavior.toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resource Usage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Resource Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.engagement.resourceUsage.map((resource, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{resource.resource}</span>
                          <span className="text-sm text-muted-foreground">{resource.usageCount} uses</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Effectiveness</span>
                          <span>{resource.effectiveness}/10</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Satisfaction</span>
                          <span>{resource.studentSatisfaction}/10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Predictions Tab */}
          <TabsContent value="predictions" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* At-Risk Predictions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    At-Risk Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.predictions.atRiskStudents.map((prediction, index) => (
                      <div key={index} className="space-y-2 p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Student {prediction.studentId}</span>
                          <Badge variant="destructive">
                            {(prediction.probability * 100).toFixed(0)}% risk
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Timeframe: {prediction.timeframe}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Confidence: {(prediction.confidence * 100).toFixed(0)}%
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {prediction.factors.map((factor, factorIndex) => (
                            <Badge key={factorIndex} variant="outline" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Intervention Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Intervention Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.predictions.interventionRecommendations.map((recommendation, index) => (
                      <div key={index} className="space-y-2 p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Student {recommendation.studentId}</span>
                          <Badge 
                            variant={
                              recommendation.priority === 'HIGH' ? 'destructive' :
                              recommendation.priority === 'MEDIUM' ? 'default' : 'secondary'
                            }
                          >
                            {recommendation.priority}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Type: {recommendation.type}
                        </div>
                        <div className="text-sm">
                          {recommendation.description}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <strong>Expected Outcome:</strong> {recommendation.expectedOutcome}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {recommendation.resources.map((resource, resourceIndex) => (
                            <Badge key={resourceIndex} variant="outline" className="text-xs">
                              {resource}
                            </Badge>
                          ))}
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
    </DashboardLayout>
  );
}
