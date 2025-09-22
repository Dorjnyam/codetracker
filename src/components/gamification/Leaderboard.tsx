'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Leaderboard as LeaderboardType, 
  LeaderboardEntry, 
  LeaderboardType as LBType,
  LeaderboardScope,
  LeaderboardPeriod 
} from '@/lib/gamification/achievement-system';
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  RefreshCw,
  Filter,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  leaderboard: LeaderboardType;
  currentUserId?: string;
  onRefresh?: () => void;
  onExport?: () => void;
  className?: string;
  showRankChange?: boolean;
  showFilters?: boolean;
  maxEntries?: number;
}

export function Leaderboard({
  leaderboard,
  currentUserId,
  onRefresh,
  onExport,
  className,
  showRankChange = true,
  showFilters = false,
  maxEntries = 50,
}: LeaderboardProps) {
  const [filteredEntries, setFilteredEntries] = useState<LeaderboardEntry[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const entries = showAll 
      ? leaderboard.entries 
      : leaderboard.entries.slice(0, maxEntries);
    setFilteredEntries(entries);
  }, [leaderboard.entries, showAll, maxEntries]);

  // Get rank icon
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <Trophy className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Get rank change icon
  const getRankChangeIcon = (change?: number) => {
    if (!change || change === 0) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  // Format score
  const formatScore = (score: number, type: LBType) => {
    switch (type) {
      case 'TOTAL_XP':
      case 'WEEKLY_XP':
      case 'MONTHLY_XP':
        return `${score.toLocaleString()} XP`;
      case 'STREAK':
        return `${score} days`;
      case 'ACHIEVEMENTS':
        return `${score} achievements`;
      case 'ASSIGNMENTS_COMPLETED':
        return `${score} assignments`;
      case 'CHALLENGE_SCORE':
        return `${score} points`;
      default:
        return score.toString();
    }
  };

  // Get user's rank
  const userRank = currentUserId 
    ? leaderboard.entries.find(entry => entry.user.id === currentUserId)
    : null;

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              {leaderboard.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {leaderboard.totalParticipants} participants • Updated {new Date(leaderboard.lastUpdated).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            )}
            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* User's current rank */}
        {userRank && (
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getRankIcon(userRank.rank)}
                  <span className="font-medium">Your Rank: #{userRank.rank}</span>
                </div>
                {showRankChange && userRank.change !== undefined && (
                  <div className="flex items-center gap-1">
                    {getRankChangeIcon(userRank.change)}
                    <span className={cn(
                      'text-sm',
                      userRank.change > 0 ? 'text-green-600' : 
                      userRank.change < 0 ? 'text-red-600' : 'text-muted-foreground'
                    )}>
                      {userRank.change > 0 ? `+${userRank.change}` : userRank.change}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="font-medium">{formatScore(userRank.score, leaderboard.type)}</div>
                <div className="text-sm text-muted-foreground">Level {userRank.user.level}</div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard entries */}
        <div className="space-y-2">
          {filteredEntries.map((entry, index) => {
            const isCurrentUser = currentUserId === entry.user.id;
            
            return (
              <div
                key={entry.user.id}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg transition-colors',
                  isCurrentUser 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-muted/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getRankIcon(entry.rank)}
                    <span className="font-medium w-8">#{entry.rank}</span>
                  </div>
                  
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.user.image} alt={entry.user.name} />
                    <AvatarFallback>
                      {entry.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="font-medium">{entry.user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      @{entry.user.username} • Level {entry.user.level}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {showRankChange && entry.change !== undefined && (
                    <div className="flex items-center gap-1">
                      {getRankChangeIcon(entry.change)}
                      <span className={cn(
                        'text-sm',
                        entry.change > 0 ? 'text-green-600' : 
                        entry.change < 0 ? 'text-red-600' : 'text-muted-foreground'
                      )}>
                        {entry.change > 0 ? `+${entry.change}` : entry.change}
                      </span>
                    </div>
                  )}
                  
                  <div className="text-right">
                    <div className="font-medium">
                      {formatScore(entry.score, leaderboard.type)}
                    </div>
                    {entry.metadata && (
                      <div className="text-sm text-muted-foreground">
                        {leaderboard.type === 'TOTAL_XP' && `Streak: ${entry.user.streak} days`}
                        {leaderboard.type === 'STREAK' && `${entry.user.xp.toLocaleString()} XP`}
                        {leaderboard.type === 'ACHIEVEMENTS' && `Level ${entry.user.level}`}
                        {leaderboard.type === 'LANGUAGE_SPECIFIC' && entry.metadata.proficiency && (
                          <Badge variant="secondary" className="text-xs">
                            {entry.metadata.proficiency}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show more/less button */}
        {leaderboard.entries.length > maxEntries && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2"
            >
              {showAll ? 'Show Less' : `Show All ${leaderboard.entries.length} Entries`}
            </Button>
          </div>
        )}

        {/* Empty state */}
        {filteredEntries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No entries found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Leaderboard selector component
interface LeaderboardSelectorProps {
  selectedType: LBType;
  selectedScope: LeaderboardScope;
  selectedPeriod: LeaderboardPeriod;
  onTypeChange: (type: LBType) => void;
  onScopeChange: (scope: LeaderboardScope) => void;
  onPeriodChange: (period: LeaderboardPeriod) => void;
  className?: string;
}

export function LeaderboardSelector({
  selectedType,
  selectedScope,
  selectedPeriod,
  onTypeChange,
  onScopeChange,
  onPeriodChange,
  className,
}: LeaderboardSelectorProps) {
  const types: { value: LBType; label: string }[] = [
    { value: 'TOTAL_XP', label: 'Total XP' },
    { value: 'WEEKLY_XP', label: 'Weekly XP' },
    { value: 'MONTHLY_XP', label: 'Monthly XP' },
    { value: 'STREAK', label: 'Coding Streak' },
    { value: 'ACHIEVEMENTS', label: 'Achievements' },
    { value: 'ASSIGNMENTS_COMPLETED', label: 'Assignments' },
    { value: 'LANGUAGE_SPECIFIC', label: 'Language Mastery' },
    { value: 'CHALLENGE_SCORE', label: 'Challenge Score' },
  ];

  const scopes: { value: LeaderboardScope; label: string }[] = [
    { value: 'GLOBAL', label: 'Global' },
    { value: 'CLASS', label: 'Class' },
    { value: 'SCHOOL', label: 'School' },
    { value: 'REGION', label: 'Region' },
  ];

  const periods: { value: LeaderboardPeriod; label: string }[] = [
    { value: 'ALL_TIME', label: 'All Time' },
    { value: 'MONTHLY', label: 'This Month' },
    { value: 'WEEKLY', label: 'This Week' },
    { value: 'DAILY', label: 'Today' },
  ];

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Leaderboard Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Type Selector */}
          <div>
            <label className="text-sm font-medium mb-2 block">Type</label>
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value as LBType)}
              className="w-full p-2 border rounded-md bg-background"
            >
              {types.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Scope Selector */}
          <div>
            <label className="text-sm font-medium mb-2 block">Scope</label>
            <select
              value={selectedScope}
              onChange={(e) => onScopeChange(e.target.value as LeaderboardScope)}
              className="w-full p-2 border rounded-md bg-background"
            >
              {scopes.map(scope => (
                <option key={scope.value} value={scope.value}>
                  {scope.label}
                </option>
              ))}
            </select>
          </div>

          {/* Period Selector */}
          <div>
            <label className="text-sm font-medium mb-2 block">Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => onPeriodChange(e.target.value as LeaderboardPeriod)}
              className="w-full p-2 border rounded-md bg-background"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
