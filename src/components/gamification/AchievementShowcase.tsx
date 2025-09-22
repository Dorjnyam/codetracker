'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Achievement, 
  UserAchievement, 
  AchievementCategory, 
  AchievementRarity 
} from '@/lib/gamification/achievement-system';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Users, 
  Code, 
  Gift, 
  Eye,
  EyeOff,
  Filter,
  Search,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementShowcaseProps {
  achievements: UserAchievement[];
  availableAchievements: Achievement[];
  onAchievementClick?: (achievement: Achievement) => void;
  className?: string;
  showProgress?: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
  maxDisplay?: number;
}

export function AchievementShowcase({
  achievements,
  availableAchievements,
  onAchievementClick,
  className,
  showProgress = true,
  showFilters = true,
  showSearch = true,
  maxDisplay = 20,
}: AchievementShowcaseProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'ALL'>('ALL');
  const [selectedRarity, setSelectedRarity] = useState<AchievementRarity | 'ALL'>('ALL');
  const [showHidden, setShowHidden] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'rarity' | 'date' | 'progress'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Get rarity color
  const getRarityColor = (rarity: AchievementRarity) => {
    switch (rarity) {
      case 'COMMON':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'UNCOMMON':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'RARE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'EPIC':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'LEGENDARY':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: AchievementCategory) => {
    switch (category) {
      case 'STREAK':
        return <Zap className="h-4 w-4" />;
      case 'LANGUAGE_MASTERY':
        return <Code className="h-4 w-4" />;
      case 'ASSIGNMENT_COMPLETION':
        return <Target className="h-4 w-4" />;
      case 'COLLABORATION':
        return <Users className="h-4 w-4" />;
      case 'CODE_QUALITY':
        return <Star className="h-4 w-4" />;
      case 'MENTORING':
        return <Users className="h-4 w-4" />;
      case 'CHALLENGE':
        return <Trophy className="h-4 w-4" />;
      case 'SPECIAL_EVENT':
        return <Gift className="h-4 w-4" />;
      case 'HIDDEN':
        return <EyeOff className="h-4 w-4" />;
      case 'SOCIAL':
        return <Users className="h-4 w-4" />;
      default:
        return <Trophy className="h-4 w-4" />;
    }
  };

  // Filter and sort achievements
  const filteredAchievements = availableAchievements
    .filter(achievement => {
      // Search filter
      if (searchTerm && !achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !achievement.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (selectedCategory !== 'ALL' && achievement.category !== selectedCategory) {
        return false;
      }
      
      // Rarity filter
      if (selectedRarity !== 'ALL' && achievement.rarity !== selectedRarity) {
        return false;
      }
      
      // Hidden filter
      if (!showHidden && achievement.isHidden) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rarity':
          const rarityOrder = { COMMON: 1, UNCOMMON: 2, RARE: 3, EPIC: 4, LEGENDARY: 5 };
          comparison = rarityOrder[a.rarity] - rarityOrder[b.rarity];
          break;
        case 'date':
          const aUnlocked = achievements.find(ua => ua.achievementId === a.id)?.unlockedAt;
          const bUnlocked = achievements.find(ua => ua.achievementId === b.id)?.unlockedAt;
          comparison = (aUnlocked?.getTime() || 0) - (bUnlocked?.getTime() || 0);
          break;
        case 'progress':
          // This would need progress calculation logic
          comparison = 0;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    })
    .slice(0, maxDisplay);

  // Get achievement progress
  const getAchievementProgress = (achievement: Achievement) => {
    const userAchievement = achievements.find(ua => ua.achievementId === achievement.id);
    if (userAchievement) {
      return { unlocked: true, progress: 100, unlockedAt: userAchievement.unlockedAt };
    }
    
    // Calculate progress based on requirements
    // This is a simplified version - in reality, you'd need more complex logic
    return { unlocked: false, progress: Math.random() * 100, unlockedAt: null };
  };

  // Get categories
  const categories: AchievementCategory[] = [
    'STREAK', 'LANGUAGE_MASTERY', 'ASSIGNMENT_COMPLETION', 'COLLABORATION',
    'CODE_QUALITY', 'MENTORING', 'CHALLENGE', 'SPECIAL_EVENT', 'HIDDEN', 'SOCIAL'
  ];

  const rarities: AchievementRarity[] = [
    'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              {showSearch && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search achievements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
                  />
                </div>
              )}

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as AchievementCategory | 'ALL')}
                className="p-2 border rounded-md bg-background"
              >
                <option value="ALL">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>

              {/* Rarity Filter */}
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value as AchievementRarity | 'ALL')}
                className="p-2 border rounded-md bg-background"
              >
                <option value="ALL">All Rarities</option>
                {rarities.map(rarity => (
                  <option key={rarity} value={rarity}>
                    {rarity}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="flex-1 p-2 border rounded-md bg-background"
                >
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                  <option value="rarity">Rarity</option>
                  <option value="progress">Progress</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-2"
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Additional Options */}
            <div className="flex items-center gap-4 mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showHidden}
                  onChange={(e) => setShowHidden(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show hidden achievements</span>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map(achievement => {
          const { unlocked, progress, unlockedAt } = getAchievementProgress(achievement);
          
          return (
            <Card
              key={achievement.id}
              className={cn(
                'transition-all duration-200 hover:shadow-md cursor-pointer',
                unlocked ? 'ring-2 ring-primary/20' : 'opacity-75',
                achievement.isHidden && !showHidden && 'hidden'
              )}
              onClick={() => onAchievementClick?.(achievement)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{achievement.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getCategoryIcon(achievement.category)}
                          {achievement.category.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {achievement.isHidden && (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {achievement.description}
                </p>
                
                {/* Progress */}
                {showProgress && !unlocked && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
                
                {/* Unlocked Info */}
                {unlocked && unlockedAt && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Trophy className="h-4 w-4" />
                      <span>Unlocked!</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {unlockedAt.toLocaleDateString()}
                    </div>
                  </div>
                )}
                
                {/* XP Reward */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">XP Reward</span>
                  <Badge variant="secondary">{achievement.xpReward} XP</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No achievements found</p>
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Achievement Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {achievements.length}
              </div>
              <div className="text-sm text-muted-foreground">Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {availableAchievements.length}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.round((achievements.length / availableAchievements.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Completion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {achievements.reduce((sum, ua) => sum + ua.achievement.xpReward, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total XP</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
