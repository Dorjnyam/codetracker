'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  CheckCircle, 
  Clock, 
  Plus,
  Calendar,
  TrendingUp,
  Award,
  Star
} from 'lucide-react';
import { Goal } from '@/types/analytics';
import { cn } from '@/lib/utils';

interface GoalTrackerProps {
  activeGoals: Goal[];
  completedGoals: Goal[];
  upcomingGoals: Goal[];
  progressRate: number;
  className?: string;
}

export function GoalTracker({ 
  activeGoals, 
  completedGoals, 
  upcomingGoals, 
  progressRate,
  className 
}: GoalTrackerProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'upcoming'>('active');

  const getGoalIcon = (type: Goal['type']) => {
    switch (type) {
      case 'SKILL':
        return <TrendingUp className="h-4 w-4" />;
      case 'ASSIGNMENT':
        return <CheckCircle className="h-4 w-4" />;
      case 'STREAK':
        return <Clock className="h-4 w-4" />;
      case 'ACHIEVEMENT':
        return <Award className="h-4 w-4" />;
      case 'CUSTOM':
        return <Star className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getGoalColor = (type: Goal['type']) => {
    switch (type) {
      case 'SKILL':
        return 'text-blue-600 dark:text-blue-400';
      case 'ASSIGNMENT':
        return 'text-green-600 dark:text-green-400';
      case 'STREAK':
        return 'text-orange-600 dark:text-orange-400';
      case 'ACHIEVEMENT':
        return 'text-purple-600 dark:text-purple-400';
      case 'CUSTOM':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysUntilDeadline = (deadline?: Date) => {
    if (!deadline) return null;
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderGoalCard = (goal: Goal) => {
    const daysUntilDeadline = getDaysUntilDeadline(goal.deadline);
    const isOverdue = daysUntilDeadline !== null && daysUntilDeadline < 0;

    return (
      <Card key={goal.id} className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-lg bg-muted', getGoalColor(goal.type))}>
                {getGoalIcon(goal.type)}
              </div>
              <div>
                <CardTitle className="text-lg">{goal.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {goal.description}
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(goal.status)}>
              {goal.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {goal.current}/{goal.target} ({goal.progress.toFixed(1)}%)
                </span>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>

            {/* Deadline */}
            {goal.deadline && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Due:</span>
                <span className={cn(
                  'font-medium',
                  isOverdue ? 'text-red-600 dark:text-red-400' : 'text-foreground'
                )}>
                  {formatDate(goal.deadline)}
                </span>
                {daysUntilDeadline !== null && (
                  <span className={cn(
                    'text-xs',
                    isOverdue ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'
                  )}>
                    ({isOverdue ? `${Math.abs(daysUntilDeadline)} days overdue` : `${daysUntilDeadline} days left`})
                  </span>
                )}
              </div>
            )}

            {/* Created Date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Created:</span>
              <span>{formatDate(goal.createdAt)}</span>
            </div>

            {/* Completed Date */}
            {goal.completedAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Completed:</span>
                <span>{formatDate(goal.completedAt)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Goal Tracker</h2>
          <p className="text-muted-foreground">
            Track your learning objectives and achievements
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {progressRate.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Progress Rate</div>
          </div>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeGoals.length}</div>
                <div className="text-sm text-muted-foreground">Active Goals</div>
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
                <div className="text-2xl font-bold">{completedGoals.length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{upcomingGoals.length}</div>
                <div className="text-sm text-muted-foreground">Upcoming</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('active')}
          >
            Active ({activeGoals.length})
          </Button>
          <Button
            variant={activeTab === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('completed')}
          >
            Completed ({completedGoals.length})
          </Button>
          <Button
            variant={activeTab === 'upcoming' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming ({upcomingGoals.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTab === 'active' && activeGoals.map(renderGoalCard)}
          {activeTab === 'completed' && completedGoals.map(renderGoalCard)}
          {activeTab === 'upcoming' && upcomingGoals.map(renderGoalCard)}
        </div>

        {/* Empty State */}
        {((activeTab === 'active' && activeGoals.length === 0) ||
          (activeTab === 'completed' && completedGoals.length === 0) ||
          (activeTab === 'upcoming' && upcomingGoals.length === 0)) && (
          <Card>
            <CardContent className="text-center py-8">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No {activeTab} goals found
              </p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
