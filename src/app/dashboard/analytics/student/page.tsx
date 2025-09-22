'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Target,
  Award,
  Clock,
  Calendar,
  Activity,
  Zap,
  Brain,
  Users,
  BookOpen,
  Code,
  Star,
  Download,
  Share,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { 
  StudentAnalytics, 
  TimeRange, 
  BaseMetric,
  ChartData,
  ActivityHeatmapEntry,
  SkillProgress,
  Goal
} from '@/types/analytics';
import { ActivityHeatmap } from '@/components/analytics/ActivityHeatmap';
import { SkillRadarChart } from '@/components/analytics/SkillRadarChart';
import { ProgressChart } from '@/components/analytics/ProgressChart';
import { MetricCard } from '@/components/analytics/MetricCard';
import { GoalTracker } from '@/components/analytics/GoalTracker';
import { cn } from '@/lib/utils';

export default function StudentAnalyticsPage() {
  const [analytics, setAnalytics] = useState<StudentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('MONTHLY');
  const [refreshing, setRefreshing] = useState(false);

  // Mock analytics data
  const mockAnalytics: StudentAnalytics = {
    userId: 'user1',
    timeRange: 'MONTHLY',
    period: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(),
    },
    
    progress: {
      currentLevel: 12,
      totalXP: 45000,
      levelProgress: 75.5,
      streak: 35,
      achievements: 23,
      skills: [
        {
          skill: 'JavaScript',
          level: 8,
          xp: 12000,
          proficiency: 85,
          trend: 12.5,
          lastPracticed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          exercisesCompleted: 45,
          averageScore: 92,
        },
        {
          skill: 'Python',
          level: 6,
          xp: 8500,
          proficiency: 72,
          trend: 8.3,
          lastPracticed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          exercisesCompleted: 32,
          averageScore: 88,
        },
        {
          skill: 'React',
          level: 5,
          xp: 6200,
          proficiency: 68,
          trend: 15.2,
          lastPracticed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          exercisesCompleted: 28,
          averageScore: 85,
        },
        {
          skill: 'Node.js',
          level: 4,
          xp: 4800,
          proficiency: 55,
          trend: -2.1,
          lastPracticed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          exercisesCompleted: 18,
          averageScore: 78,
        },
      ],
    },
    
    activity: {
      totalSessions: 156,
      totalTimeSpent: 2840, // minutes
      averageSessionLength: 18.2,
      mostActiveDay: 'Tuesday',
      mostActiveHour: 14,
      heatmapData: generateMockHeatmapData(),
    },
    
    assignments: {
      totalAssigned: 24,
      completed: 22,
      completionRate: 91.7,
      averageGrade: 87.5,
      gradeTrend: generateMockGradeTrend(),
      difficultyBreakdown: {
        'Easy': 8,
        'Medium': 12,
        'Hard': 4,
        'Expert': 0,
      },
      languageBreakdown: {
        'JavaScript': 12,
        'Python': 8,
        'React': 4,
      },
    },
    
    insights: {
      strengths: ['Problem Solving', 'JavaScript', 'React Development'],
      weaknesses: ['Node.js', 'Database Design', 'Testing'],
      learningVelocity: 1.3,
      improvementAreas: ['Backend Development', 'System Design', 'Code Optimization'],
      recommendations: [
        'Focus more on Node.js exercises to improve backend skills',
        'Practice database design patterns',
        'Join study groups for system design concepts',
      ],
      studyHabits: {
        preferredStudyTime: 'Evening (6-9 PM)',
        averageStudyDuration: 45,
        consistencyScore: 78,
        breakPatterns: ['25-minute focus, 5-minute break'],
        productivityPeaks: [14, 20, 22],
        recommendations: [
          'Try studying in the morning for better retention',
          'Take longer breaks between intensive sessions',
          'Use the Pomodoro technique consistently',
        ],
      },
    },
    
    peerComparison: {
      percentile: 78,
      averageClassPerformance: 82.3,
      topPerformersCount: 5,
      improvementRanking: 3,
    },
    
    goals: {
      active: [
        {
          id: 'goal1',
          title: 'Master JavaScript ES6+',
          description: 'Complete all advanced JavaScript exercises',
          type: 'SKILL',
          target: 100,
          current: 75,
          progress: 75,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'ACTIVE',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'goal2',
          title: 'Complete 50 Coding Challenges',
          description: 'Solve 50 algorithm and data structure problems',
          type: 'ASSIGNMENT',
          target: 50,
          current: 32,
          progress: 64,
          deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          status: 'ACTIVE',
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        },
      ],
      completed: [
        {
          id: 'goal3',
          title: '30-Day Coding Streak',
          description: 'Code for at least 30 minutes every day',
          type: 'STREAK',
          target: 30,
          current: 30,
          progress: 100,
          deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          status: 'COMPLETED',
          createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
      ],
      upcoming: [
        {
          id: 'goal4',
          title: 'Build a Full-Stack Project',
          description: 'Create a complete web application',
          type: 'CUSTOM',
          target: 1,
          current: 0,
          progress: 0,
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          status: 'ACTIVE',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
      ],
      progressRate: 68.5,
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
    console.log('Exporting analytics data...');
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
            <p className="text-muted-foreground">Loading your analytics...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">My Analytics</h1>
            <p className="text-muted-foreground">
              Track your coding progress and learning journey
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
            title="Current Level"
            value={analytics.progress.currentLevel}
            unit=""
            trend={12.5}
            icon={<Award className="h-4 w-4" />}
            color="blue"
          />
          
          <MetricCard
            title="Total XP"
            value={analytics.progress.totalXP}
            unit=""
            trend={8.3}
            icon={<Zap className="h-4 w-4" />}
            color="green"
          />
          
          <MetricCard
            title="Coding Streak"
            value={analytics.progress.streak}
            unit="days"
            trend={5.2}
            icon={<Calendar className="h-4 w-4" />}
            color="orange"
          />
          
          <MetricCard
            title="Achievements"
            value={analytics.progress.achievements}
            unit=""
            trend={15.8}
            icon={<Star className="h-4 w-4" />}
            color="purple"
          />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Activity Heatmap */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Coding Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityHeatmap data={analytics.activity.heatmapData} />
                </CardContent>
              </Card>

              {/* Skill Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Skill Progression
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SkillRadarChart skills={analytics.progress.skills} />
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Assignment Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Completion Rate</span>
                      <span className="font-medium">{analytics.assignments.completionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average Grade</span>
                      <span className="font-medium">{analytics.assignments.averageGrade.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Completed</span>
                      <span className="font-medium">{analytics.assignments.completed}/{analytics.assignments.totalAssigned}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Peer Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Percentile</span>
                      <span className="font-medium">{analytics.peerComparison.percentile}th</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Class Average</span>
                      <span className="font-medium">{analytics.peerComparison.averageClassPerformance.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Improvement Rank</span>
                      <span className="font-medium">#{analytics.peerComparison.improvementRanking}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Learning Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium">Strengths:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {analytics.insights.strengths.map((strength, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Learning Velocity:</span>
                      <span className="ml-2 font-medium">{analytics.insights.learningVelocity}x</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Activity Heatmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityHeatmap data={analytics.activity.heatmapData} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Study Habits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Preferred Study Time</span>
                      <span className="font-medium">{analytics.insights.studyHabits.preferredStudyTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average Duration</span>
                      <span className="font-medium">{analytics.insights.studyHabits.averageStudyDuration} min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Consistency Score</span>
                      <span className="font-medium">{analytics.insights.studyHabits.consistencyScore}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Most Active Day</span>
                      <span className="font-medium">{analytics.activity.mostActiveDay}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Most Active Hour</span>
                      <span className="font-medium">{analytics.activity.mostActiveHour}:00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Activity Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressChart data={analytics.assignments.gradeTrend} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Skill Radar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SkillRadarChart skills={analytics.progress.skills} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Skill Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.progress.skills.map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{skill.skill}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Level {skill.level}</span>
                            {skill.trend > 0 ? (
                              <ArrowUp className="h-4 w-4 text-green-500" />
                            ) : skill.trend < 0 ? (
                              <ArrowDown className="h-4 w-4 text-red-500" />
                            ) : (
                              <Minus className="h-4 w-4 text-gray-500" />
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{skill.proficiency}% proficiency</span>
                          <span>{skill.exercisesCompleted} exercises</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Grade Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ProgressChart data={analytics.assignments.gradeTrend} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium">Difficulty Distribution:</span>
                      <div className="space-y-2 mt-2">
                        {Object.entries(analytics.assignments.difficultyBreakdown).map(([difficulty, count]) => (
                          <div key={difficulty} className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{difficulty}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Language Distribution:</span>
                      <div className="space-y-2 mt-2">
                        {Object.entries(analytics.assignments.languageBreakdown).map(([language, count]) => (
                          <div key={language} className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{language}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-4">
            <GoalTracker 
              activeGoals={analytics.goals.active}
              completedGoals={analytics.goals.completed}
              upcomingGoals={analytics.goals.upcoming}
              progressRate={analytics.goals.progressRate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

// Helper functions for mock data
function generateMockHeatmapData(): ActivityHeatmapEntry[] {
  const data: ActivityHeatmapEntry[] = [];
  const today = new Date();
  
  for (let i = 365; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const count = Math.floor(Math.random() * 5);
    const intensity = count;
    const activities = count > 0 ? ['coding', 'learning', 'practice'] : [];
    
    data.push({
      date: date.toISOString().split('T')[0],
      count,
      intensity,
      activities,
    });
  }
  
  return data;
}

function generateMockGradeTrend() {
  const data = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      timestamp: date,
      value: 80 + Math.random() * 20, // Random grade between 80-100
    });
  }
  
  return data;
}
