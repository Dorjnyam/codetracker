'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  BookOpen, 
  Trophy, 
  Target, 
  Calendar,
  TrendingUp,
  Code,
  Users,
  Award,
  Clock,
  CheckCircle,
  Github
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { data: session, status } = useSession();
  const [userStats, setUserStats] = useState({
    totalAssignments: 0,
    completedAssignments: 0,
    totalXP: 0,
    currentLevel: 1,
    streak: 0,
    achievements: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!session?.user) return;

      try {
        // Fetch user progress
        const progressResponse = await fetch('/api/user/progress');
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setUserStats({
            totalAssignments: 12,
            completedAssignments: 8,
            totalXP: progressData.totalXP,
            currentLevel: progressData.currentLevel,
            streak: progressData.streak,
            achievements: 3,
          });
        }
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [session]);
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {session?.user?.name || 'User'}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's your comprehensive progress summary and insights.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalAssignments}</div>
              <p className="text-xs text-muted-foreground">
                {userStats.completedAssignments} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.completedAssignments}</div>
              <p className="text-xs text-muted-foreground">
                {userStats.totalAssignments > 0 ? Math.round((userStats.completedAssignments / userStats.totalAssignments) * 100) : 0}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.streak} days</div>
              <p className="text-xs text-muted-foreground">
                Keep it up! 🔥
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total XP</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalXP.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Level {userStats.currentLevel} Programmer
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest coding achievements and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Completed "Array Manipulation"</p>
                      <p className="text-xs text-muted-foreground">2 hours ago • +50 XP</p>
                    </div>
                    <Badge variant="secondary">JavaScript</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Started "React Components"</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                    <Badge variant="secondary">React</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Earned "Code Warrior" badge</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                    <Badge variant="outline">Achievement</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Joined "Advanced Algorithms" class</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                    <Badge variant="secondary">Class</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Assignments</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Code Reviews</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Collaborations</span>
                    <span>90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">React Hooks Project</p>
                      <p className="text-xs text-muted-foreground">Due in 2 days</p>
                    </div>
                    <Badge variant="destructive">Urgent</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Algorithm Challenge</p>
                      <p className="text-xs text-muted-foreground">Due in 5 days</p>
                    </div>
                    <Badge variant="secondary">Normal</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Team Collaboration</p>
                      <p className="text-xs text-muted-foreground">Due in 1 week</p>
                    </div>
                    <Badge variant="outline">Low</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="mr-2 h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Start New Assignment
                </Button>
                <Button className="w-full" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Join Study Group
                </Button>
                <Button className="w-full" variant="outline">
                  <Clock className="mr-2 h-4 w-4" />
                  View Schedule
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Name:</strong> John Doe</p>
                <p><strong>Email:</strong> john@example.com</p>
                <p><strong>Role:</strong> Student</p>
              </div>
              <div>
                <p><strong>Username:</strong> johndoe</p>
                <p><strong>GitHub:</strong> johndoe</p>
                <p><strong>Member since:</strong> {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
