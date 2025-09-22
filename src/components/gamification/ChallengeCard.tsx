'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Challenge, ChallengeType } from '@/lib/gamification/achievement-system';
import { 
  Clock, 
  Users, 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Calendar,
  Award,
  Play,
  CheckCircle,
  Timer
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChallengeCardProps {
  challenge: Challenge;
  userParticipation?: {
    score: number;
    rank?: number;
    completed: boolean;
    progress: number;
  };
  onJoin?: (challengeId: string) => void;
  onView?: (challengeId: string) => void;
  className?: string;
}

export function ChallengeCard({
  challenge,
  userParticipation,
  onJoin,
  onView,
  className,
}: ChallengeCardProps) {
  const isActive = challenge.isActive && new Date() < challenge.endDate;
  const isUpcoming = new Date() < challenge.startDate;
  const isExpired = new Date() > challenge.endDate;
  const isParticipating = userParticipation !== undefined;

  // Get challenge type icon
  const getTypeIcon = (type: ChallengeType) => {
    switch (type) {
      case 'DAILY_CODING':
        return <Calendar className="h-4 w-4" />;
      case 'WEEKLY_THEME':
        return <Star className="h-4 w-4" />;
      case 'MONTHLY_HACKATHON':
        return <Trophy className="h-4 w-4" />;
      case 'PEER_TO_PEER':
        return <Users className="h-4 w-4" />;
      case 'TEACHER_CUSTOM':
        return <Target className="h-4 w-4" />;
      case 'SKILL_BUILDING':
        return <Zap className="h-4 w-4" />;
      case 'SPEED_CODING':
        return <Timer className="h-4 w-4" />;
      case 'ALGORITHM_CHALLENGE':
        return <Star className="h-4 w-4" />;
      case 'PROJECT_BUILDING':
        return <Award className="h-4 w-4" />;
      default:
        return <Trophy className="h-4 w-4" />;
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'HARD':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'EXPERT':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  // Get status color
  const getStatusColor = () => {
    if (isExpired) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    if (isUpcoming) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (isActive) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  // Get status text
  const getStatusText = () => {
    if (isExpired) return 'Expired';
    if (isUpcoming) return 'Upcoming';
    if (isActive) return 'Active';
    return 'Inactive';
  };

  // Calculate time remaining
  const getTimeRemaining = () => {
    if (isExpired) return 'Challenge ended';
    if (isUpcoming) {
      const days = Math.ceil((challenge.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return `Starts in ${days} day${days !== 1 ? 's' : ''}`;
    }
    if (isActive) {
      const days = Math.ceil((challenge.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return `${days} day${days !== 1 ? 's' : ''} remaining`;
    }
    return 'Challenge ended';
  };

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-md',
      isExpired && 'opacity-75',
      isActive && 'ring-2 ring-primary/20',
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getTypeIcon(challenge.type)}</div>
            <div>
              <CardTitle className="text-lg">{challenge.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
                <Badge className={getStatusColor()}>
                  {getStatusText()}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  {getTypeIcon(challenge.type)}
                  {challenge.type.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>
          </div>
          {isParticipating && userParticipation?.completed && (
            <CheckCircle className="h-6 w-6 text-green-500" />
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {challenge.description}
        </p>
        
        {/* Challenge Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{getTimeRemaining()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{challenge.participants.length} participants</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Star className="h-4 w-4 text-muted-foreground" />
            <span>{challenge.xpReward} XP reward</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <span>{challenge.maxParticipants || 'Unlimited'} max</span>
          </div>
        </div>

        {/* User Progress */}
        {isParticipating && userParticipation && (
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Your Progress</span>
              <span className="text-sm text-muted-foreground">
                {userParticipation.completed ? 'Completed!' : `${userParticipation.progress}%`}
              </span>
            </div>
            <Progress value={userParticipation.progress} className="h-2" />
            <div className="flex items-center justify-between text-sm">
              <span>Score: {userParticipation.score}</span>
              {userParticipation.rank && (
                <span>Rank: #{userParticipation.rank}</span>
              )}
            </div>
          </div>
        )}

        {/* Rewards */}
        {challenge.rewards.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Rewards</h4>
            <div className="flex flex-wrap gap-1">
              {challenge.rewards.map((reward, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {reward.type}: {reward.value}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isParticipating && isActive && (
            <Button
              onClick={() => onJoin?.(challenge.id)}
              className="flex items-center gap-2"
              disabled={challenge.maxParticipants && challenge.participants.length >= challenge.maxParticipants}
            >
              <Play className="h-4 w-4" />
              Join Challenge
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={() => onView?.(challenge.id)}
            className="flex items-center gap-2"
          >
            View Details
          </Button>
        </div>

        {/* Requirements */}
        {challenge.requirements.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Requirements</h4>
            <ul className="space-y-1">
              {challenge.requirements.map((req, index) => (
                <li key={index} className="text-xs text-muted-foreground">
                  • {req.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
