'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProgressHeatmap } from '@/components/gamification/ProgressHeatmap';
import { SkillRadarChart } from '@/components/gamification/SkillRadarChart';
import { Leaderboard, LeaderboardSelector } from '@/components/gamification/Leaderboard';
import { AchievementShowcase } from '@/components/gamification/AchievementShowcase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  TrendingUp, 
  Calendar,
  Award,
  Users,
  Code,
  BarChart3,
  Activity,
  Flame,
  Crown,
  Medal
} from 'lucide-react';
import { 
  UserProgress, 
  LeaderboardType, 
  LeaderboardScope, 
  LeaderboardPeriod,
  Achievement,
  UserAchievement,
  ActivityHeatmapEntry,
  SkillLevel
} from '@/lib/gamification/achievement-system';
import { getLevelInfo, getLevelProgress, calculateDailyXPGoal } from '@/lib/gamification/xp-system';
import { ACHIEVEMENTS } from '@/lib/gamification/achievement-system';
import { getLeaderboard } from '@/lib/gamification/leaderboard-system';

export default function GamificationPage() {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('TOTAL_XP');
  const [leaderboardScope, setLeaderboardScope] = useState<LeaderboardScope>('GLOBAL');
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<LeaderboardPeriod>('ALL_TIME');
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockUserProgress: UserProgress = {
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
        cpp: 1500,
        typescript: 1000,
      },
      skillLevels: {
        python: {
          language: 'python',
          level: 5,
          xp: 5000,
          proficiency: 'ADVANCED',
          badges: ['Python Novice', 'Python Intermediate'],
          milestones: [],
        },
        javascript: {
          language: 'javascript',
          level: 3,
          xp: 3000,
          proficiency: 'INTERMEDIATE',
          badges: ['JavaScript Novice'],
          milestones: [],
        },
        java: {
          language: 'java',
          level: 2,
          xp: 2000,
          proficiency: 'INTERMEDIATE',
          badges: ['Java Novice'],
          milestones: [],
        },
        cpp: {
          language: 'cpp',
          level: 2,
          xp: 1500,
          proficiency: 'BEGINNER',
          badges: [],
          milestones: [],
        },
        typescript: {
          language: 'typescript',
          level: 1,
          xp: 1000,
          proficiency: 'BEGINNER',
          badges: [],
          milestones: [],
        },
      },
      achievements: [
        {
          id: 'ua1',
          userId: 'user1',
          achievementId: 'first_assignment',
          unlockedAt: new Date('2024-01-15'),
          progress: {},
          isNotified: true,
          achievement: ACHIEVEMENTS[0],
        },
        {
          id: 'ua2',
          userId: 'user1',
          achievementId: 'streak_7',
          unlockedAt: new Date('2024-01-20'),
          progress: {},
          isNotified: true,
          achievement: ACHIEVEMENTS[1],
        },
      ],
      goals: [],
      challenges: [],
    };

    const mockHeatmapData: ActivityHeatmapEntry[] = Array.from({ length: 365 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 5),
        xp: Math.floor(Math.random() * 100),
        activities: ['ASSIGNMENT_COMPLETED', 'DAILY_STREAK'],
      };
    });

    const mockLeaderboardData = [
      { ...mockUserProgress, userId: 'user1' },
      { ...mockUserProgress, userId: 'user2', totalXP: 15000, currentLevel: 6 },
      { ...mockUserProgress, userId: 'user3', totalXP: 10000, currentLevel: 4 },
      { ...mockUserProgress, userId: 'user4', totalXP: 8000, currentLevel: 3 },
      { ...mockUserProgress, userId: 'user5', totalXP: 6000, currentLevel: 2 },
    ];

    setUserProgress(mockUserProgress);
    setLeaderboard(getLeaderboard(mockLeaderboardData, leaderboardType, leaderboardScope, leaderboardPeriod));
    setLoading(false);
  }, [leaderboardType, leaderboardScope, leaderboardPeriod]);

  if (loading || !userProgress) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading gamification data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const levelInfo = getLevelInfo(userProgress.totalXP);
  const levelProgress = getLevelProgress(userProgress.totalXP);
  const dailyGoal = calculateDailyXPGoal(userProgress.currentLevel);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gamification Hub</h1>
            <p className="text-muted-foreground">
              Track your progress, compete with peers, and unlock achievements
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Crown className="h-3 w-3" />
              Level {userProgress.currentLevel}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Flame className="h-3 w-3" />
              {userProgress.streak} day streak
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total XP</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProgress.totalXP.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{userProgress.weeklyXP} this week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Level</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProgress.currentLevel}</div>
              <p className="text-xs text-muted-foreground">
                {levelProgress.xpToNextLevel} XP to next level
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coding Streak</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProgress.streak}</div>
              <p className="text-xs text-muted-foreground">
                days in a row
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProgress.achievements.length}</div>
              <p className="text-xs text-muted-foreground">
                of {ACHIEVEMENTS.length} unlocked
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Level Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{levelInfo.title}</h3>
                  <p className="text-sm text-muted-foreground">{levelInfo.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{userProgress.currentLevel}</div>
                  <div className="text-sm text-muted-foreground">Level</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Level {userProgress.currentLevel + 1}</span>
                  <span>{Math.round(levelProgress.progressPercentage)}%</span>
                </div>
                <Progress value={levelProgress.progressPercentage} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{levelProgress.currentLevelXP} XP</span>
                  <span>{levelProgress.nextLevelXP} XP needed</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="leaderboards">Leaderboards</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ProgressHeatmap
                data={Array.from({ length: 365 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - i);
                  return {
                    date: date.toISOString().split('T')[0],
                    count: Math.floor(Math.random() * 5),
                    xp: Math.floor(Math.random() * 100),
                    activities: ['ASSIGNMENT_COMPLETED', 'DAILY_STREAK'],
                  };
                })}
                colorScheme="github"
              />
              
              <SkillRadarChart
                skills={Object.values(userProgress.skillLevels)}
                colorScheme="primary"
              />
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ProgressHeatmap
                data={Array.from({ length: 365 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - i);
                  return {
                    date: date.toISOString().split('T')[0],
                    count: Math.floor(Math.random() * 5),
                    xp: Math.floor(Math.random() * 100),
                    activities: ['ASSIGNMENT_COMPLETED', 'DAILY_STREAK'],
                  };
                })}
                colorScheme="fire"
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Daily Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Daily XP Goal</span>
                      <span className="text-sm text-muted-foreground">{dailyGoal} XP</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {Math.round(dailyGoal * 0.75)} / {dailyGoal} XP
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leaderboards Tab */}
          <TabsContent value="leaderboards" className="space-y-4">
            <LeaderboardSelector
              selectedType={leaderboardType}
              selectedScope={leaderboardScope}
              selectedPeriod={leaderboardPeriod}
              onTypeChange={setLeaderboardType}
              onScopeChange={setLeaderboardScope}
              onPeriodChange={setLeaderboardPeriod}
            />
            
            {leaderboard && (
              <Leaderboard
                leaderboard={leaderboard}
                currentUserId={userProgress.userId}
                showRankChange={true}
              />
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <AchievementShowcase
              achievements={userProgress.achievements}
              availableAchievements={ACHIEVEMENTS}
              showProgress={true}
              showFilters={true}
              showSearch={true}
            />
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SkillRadarChart
                skills={Object.values(userProgress.skillLevels)}
                colorScheme="success"
                size={400}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Language Mastery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.values(userProgress.skillLevels).map(skill => (
                      <div key={skill.language} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{skill.language.toUpperCase()}</span>
                          <Badge variant="outline">{skill.proficiency}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Level {skill.level}</span>
                          <span>{skill.xp} XP</span>
                        </div>
                        <Progress value={(skill.level / 10) * 100} className="h-2" />
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
