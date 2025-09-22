'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChallengeCard } from '@/components/gamification/ChallengeCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Plus, 
  Calendar, 
  Users, 
  Target,
  Clock,
  Star,
  Zap,
  Award
} from 'lucide-react';
import { 
  Challenge, 
  ChallengeType, 
  UserChallenge 
} from '@/lib/gamification/achievement-system';
import { 
  createChallenge, 
  getActiveChallenges, 
  getUpcomingChallenges,
  getUserChallenges,
  joinChallenge,
  getChallengeStats
} from '@/lib/gamification/challenge-system';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockChallenges: Challenge[] = [
      createChallenge(
        'Daily Python Practice',
        'Solve 3 Python problems every day',
        'DAILY_CODING',
        'EASY',
        'teacher1',
        {
          requirements: [
            {
              type: 'daily_problems',
              description: 'Solve 3 Python problems',
              criteria: { count: 3, language: 'python' }
            }
          ],
          rewards: [
            { type: 'XP', value: 50, description: '50 XP for completion' },
            { type: 'BADGE', value: 'daily-coder', description: 'Daily Coder badge' }
          ]
        }
      ),
      createChallenge(
        'Weekly Algorithm Mastery',
        'Master advanced algorithms this week',
        'WEEKLY_THEME',
        'HARD',
        'teacher2',
        {
          requirements: [
            {
              type: 'algorithm_problems',
              description: 'Solve 5 advanced algorithm problems',
              criteria: { count: 5, difficulty: 'hard' }
            }
          ],
          rewards: [
            { type: 'XP', value: 300, description: '300 XP for completion' },
            { type: 'ACHIEVEMENT', value: 'algorithm-master', description: 'Algorithm Master achievement' }
          ]
        }
      ),
      createChallenge(
        'Monthly Full-Stack Project',
        'Build a complete full-stack application',
        'MONTHLY_HACKATHON',
        'EXPERT',
        'teacher3',
        {
          requirements: [
            {
              type: 'full_stack_project',
              description: 'Build a complete full-stack application',
              criteria: { frontend: true, backend: true, database: true }
            }
          ],
          rewards: [
            { type: 'XP', value: 750, description: '750 XP for completion' },
            { type: 'BADGE', value: 'full-stack-developer', description: 'Full-Stack Developer badge' }
          ]
        }
      ),
    ];

    // Add some participants to challenges
    mockChallenges[0].participants = [
      {
        userId: 'user1',
        joinedAt: new Date(),
        score: 85,
        submissions: 3,
        completed: true,
        completedAt: new Date(),
      },
      {
        userId: 'user2',
        joinedAt: new Date(),
        score: 72,
        submissions: 2,
        completed: false,
      },
    ];

    mockChallenges[1].participants = [
      {
        userId: 'user1',
        joinedAt: new Date(),
        score: 90,
        submissions: 5,
        completed: true,
        completedAt: new Date(),
      },
    ];

    setChallenges(mockChallenges);
    setUserChallenges(getUserChallenges(mockChallenges, 'user1'));
    setLoading(false);
  }, []);

  const activeChallenges = getActiveChallenges(challenges);
  const upcomingChallenges = getUpcomingChallenges(challenges);

  const handleJoinChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const result = joinChallenge(challenge, 'user1');
    if (result.success) {
      // Update challenges state
      setChallenges(prev => 
        prev.map(c => 
          c.id === challengeId 
            ? { ...c, participants: [...c.participants, result.participant!] }
            : c
        )
      );
      
      // Update user challenges
      setUserChallenges(getUserChallenges(challenges, 'user1'));
    } else {
      alert(result.message);
    }
  };

  const handleViewChallenge = (challengeId: string) => {
    // Navigate to challenge details page
    window.location.href = `/dashboard/challenges/${challengeId}`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading challenges...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Challenges</h1>
            <p className="text-muted-foreground">
              Compete in coding challenges and earn rewards
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Challenge
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeChallenges.length}</div>
              <p className="text-xs text-muted-foreground">
                Available now
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Challenges</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userChallenges.length}</div>
              <p className="text-xs text-muted-foreground">
                Participating
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userChallenges.filter(uc => uc.completed).length}
              </div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total XP</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userChallenges.reduce((sum, uc) => sum + uc.score, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                From challenges
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="my-challenges">My Challenges</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {/* Active Challenges Tab */}
          <TabsContent value="active" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeChallenges.map(challenge => {
                const userParticipation = challenge.participants.find(p => p.userId === 'user1');
                const stats = getChallengeStats(challenge);
                
                return (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    userParticipation={userParticipation ? {
                      score: userParticipation.score,
                      rank: userParticipation.score > 0 ? 
                        challenge.participants.filter(p => p.score > userParticipation.score).length + 1 : undefined,
                      completed: userParticipation.completed,
                      progress: (userParticipation.score / 100) * 100,
                    } : undefined}
                    onJoin={() => handleJoinChallenge(challenge.id)}
                    onView={() => handleViewChallenge(challenge.id)}
                  />
                );
              })}
            </div>
            
            {activeChallenges.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No active challenges available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Upcoming Challenges Tab */}
          <TabsContent value="upcoming" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingChallenges.map(challenge => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onView={() => handleViewChallenge(challenge.id)}
                />
              ))}
            </div>
            
            {upcomingChallenges.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No upcoming challenges</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* My Challenges Tab */}
          <TabsContent value="my-challenges" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userChallenges.map(userChallenge => (
                <ChallengeCard
                  key={userChallenge.id}
                  challenge={userChallenge.challenge}
                  userParticipation={{
                    score: userChallenge.score,
                    rank: userChallenge.rank,
                    completed: userChallenge.completed,
                    progress: userChallenge.progress.completionPercentage || 0,
                  }}
                  onView={() => handleViewChallenge(userChallenge.challengeId)}
                />
              ))}
            </div>
            
            {userChallenges.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">You haven't joined any challenges yet</p>
                  <Button className="mt-4" onClick={() => setActiveTab('active')}>
                    Browse Active Challenges
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Completed Challenges Tab */}
          <TabsContent value="completed" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userChallenges.filter(uc => uc.completed).map(userChallenge => (
                <ChallengeCard
                  key={userChallenge.id}
                  challenge={userChallenge.challenge}
                  userParticipation={{
                    score: userChallenge.score,
                    rank: userChallenge.rank,
                    completed: userChallenge.completed,
                    progress: 100,
                  }}
                  onView={() => handleViewChallenge(userChallenge.challengeId)}
                />
              ))}
            </div>
            
            {userChallenges.filter(uc => uc.completed).length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No completed challenges yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
