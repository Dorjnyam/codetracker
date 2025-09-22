'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Plus, 
  Calendar, 
  CheckCircle, 
  Clock,
  AlertCircle,
  TrendingUp,
  Star,
  Zap,
  Award,
  Users,
  Code,
  BookOpen
} from 'lucide-react';
import { 
  UserGoal, 
  GoalType 
} from '@/lib/gamification/achievement-system';
import { 
  createGoal,
  updateGoalProgress,
  getGoalProgressPercentage,
  getGoalStatus,
  getActiveGoals,
  getCompletedGoals,
  getOverdueGoals,
  getGoalsDueSoon,
  getGoalStats,
  suggestGoals,
  GOAL_CONFIG
} from '@/lib/gamification/goal-system';

export default function GoalsPage() {
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [suggestedGoals, setSuggestedGoals] = useState<UserGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  // Mock user progress for goal calculations
  const mockUserProgress = {
    userId: 'user1',
    currentLevel: 5,
    currentXP: 2500,
    totalXP: 12500,
    streak: 15,
    lastActiveDate: new Date(),
    weeklyXP: 800,
    monthlyXP: 3200,
    languageXP: {
      python: 5000,
      javascript: 3000,
      java: 2000,
    },
    skillLevels: {},
    achievements: [
      { id: '1', userId: 'user1', achievementId: 'first_assignment', unlockedAt: new Date(), progress: {}, isNotified: true, achievement: { id: '1', name: 'First Assignment', description: 'Complete your first assignment', icon: '🎯', category: 'ASSIGNMENT_COMPLETION', rarity: 'COMMON', xpReward: 50, requirements: [], isHidden: false, isActive: true, unlockConditions: {}, createdAt: new Date() } },
      { id: '2', userId: 'user1', achievementId: 'streak_7', unlockedAt: new Date(), progress: {}, isNotified: true, achievement: { id: '2', name: 'Week Warrior', description: 'Maintain a 7-day coding streak', icon: '🔥', category: 'STREAK', rarity: 'COMMON', xpReward: 100, requirements: [], isHidden: false, isActive: true, unlockConditions: {}, createdAt: new Date() } },
    ],
    goals: [],
    challenges: [],
  };

  useEffect(() => {
    // Mock goals data
    const mockGoals: UserGoal[] = [
      createGoal('user1', 'DAILY_XP', 100, 'Daily Coding Goal', 'Earn 100 XP every day'),
      createGoal('user1', 'WEEKLY_XP', 500, 'Weekly Progress Goal', 'Earn 500 XP this week'),
      createGoal('user1', 'STREAK_DAYS', 30, 'Monthly Streak Goal', 'Maintain a 30-day coding streak'),
      createGoal('user1', 'ACHIEVEMENTS_UNLOCKED', 5, 'Achievement Hunter', 'Unlock 5 achievements this month'),
    ];

    // Update goals with current progress
    const updatedGoals = mockGoals.map(goal => 
      updateGoalProgress(goal, mockUserProgress)
    );

    setGoals(updatedGoals);
    setSuggestedGoals(suggestedGoals);
    setLoading(false);
  }, []);

  const activeGoals = getActiveGoals(goals);
  const completedGoals = getCompletedGoals(goals);
  const overdueGoals = getOverdueGoals(goals);
  const goalsDueSoon = getGoalsDueSoon(goals, 3);
  const stats = getGoalStats(goals);

  const handleCreateGoal = (type: GoalType, target: number, title?: string) => {
    const newGoal = createGoal('user1', type, target, title);
    const updatedGoal = updateGoalProgress(newGoal, mockUserProgress);
    setGoals(prev => [...prev, updatedGoal]);
  };

  const handleCompleteGoal = (goalId: string) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, isCompleted: true, completedAt: new Date() }
          : goal
      )
    );
  };

  const getGoalIcon = (type: GoalType) => {
    switch (type) {
      case 'DAILY_XP':
      case 'WEEKLY_XP':
      case 'MONTHLY_XP':
        return <Star className="h-4 w-4" />;
      case 'STREAK_DAYS':
        return <Zap className="h-4 w-4" />;
      case 'ASSIGNMENTS_COMPLETED':
        return <BookOpen className="h-4 w-4" />;
      case 'LANGUAGE_XP':
        return <Code className="h-4 w-4" />;
      case 'ACHIEVEMENTS_UNLOCKED':
        return <Award className="h-4 w-4" />;
      case 'CODE_LINES_WRITTEN':
        return <Code className="h-4 w-4" />;
      case 'HOURS_CODING':
        return <Clock className="h-4 w-4" />;
      case 'PEER_HELP_SESSIONS':
        return <Users className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading goals...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
            <p className="text-muted-foreground">
              Set and track your coding goals
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Goal
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                In progress
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completionRate.toFixed(0)}% completion rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{goalsDueSoon.length}</div>
              <p className="text-xs text-muted-foreground">
                Next 3 days
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overdue}</div>
              <p className="text-xs text-muted-foreground">
                Need attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>

          {/* Active Goals Tab */}
          <TabsContent value="active" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeGoals.map(goal => {
                const status = getGoalStatus(goal);
                const progressPercentage = getGoalProgressPercentage(goal);
                
                return (
                  <Card key={goal.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getGoalIcon(goal.type)}
                          <div>
                            <CardTitle className="text-lg">{goal.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {goal.description}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(status.status)}>
                          {status.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{progressPercentage.toFixed(0)}%</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{goal.current} {goal.unit}</span>
                            <span>{goal.target} {goal.unit}</span>
                          </div>
                        </div>
                        
                        {/* Deadline */}
                        {goal.deadline && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {status.daysRemaining > 0 
                                ? `${status.daysRemaining} days remaining`
                                : 'Deadline passed'
                              }
                            </span>
                          </div>
                        )}
                        
                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCompleteGoal(goal.id)}
                            disabled={progressPercentage < 100}
                          >
                            Mark Complete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {activeGoals.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No active goals</p>
                  <Button className="mt-4" onClick={() => setActiveTab('suggestions')}>
                    Browse Suggestions
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Completed Goals Tab */}
          <TabsContent value="completed" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedGoals.map(goal => (
                <Card key={goal.id} className="border-green-200 dark:border-green-800">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getGoalIcon(goal.type)}
                        <div>
                          <CardTitle className="text-lg">{goal.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {goal.description}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Completed on {goal.completedAt?.toLocaleDateString()}</span>
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium">{goal.target} {goal.unit}</span>
                        <span className="text-muted-foreground"> achieved</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {completedGoals.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No completed goals yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Overdue Goals Tab */}
          <TabsContent value="overdue" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {overdueGoals.map(goal => {
                const status = getGoalStatus(goal);
                const progressPercentage = getGoalProgressPercentage(goal);
                
                return (
                  <Card key={goal.id} className="border-red-200 dark:border-red-800">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getGoalIcon(goal.type)}
                          <div>
                            <CardTitle className="text-lg">{goal.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {goal.description}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Overdue
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          <span>Overdue by {Math.abs(status.daysRemaining)} days</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{progressPercentage.toFixed(0)}%</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCompleteGoal(goal.id)}
                          disabled={progressPercentage < 100}
                        >
                          Mark Complete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {overdueGoals.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No overdue goals</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(GOAL_CONFIG.TYPES).map(([type, config]) => (
                <Card key={type} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {getGoalIcon(type as GoalType)}
                      <div>
                        <CardTitle className="text-lg">{config.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {config.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Suggested target: {config.defaultTarget} {config.unit}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCreateGoal(type as GoalType, config.defaultTarget)}
                        className="w-full"
                      >
                        Create Goal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
