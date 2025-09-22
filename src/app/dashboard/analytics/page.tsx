'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Activity,
  Target,
  Award,
  Clock,
  Brain,
  Zap,
  ArrowRight,
  Eye,
  Download,
  Share
} from 'lucide-react';
import { Role } from '@/types';

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Redirect to role-specific analytics page
    const userRole = session.user?.role as Role;
    
    switch (userRole) {
      case 'STUDENT':
        router.push('/dashboard/analytics/student');
        break;
      case 'TEACHER':
        router.push('/dashboard/analytics/teacher');
        break;
      case 'ADMIN':
        router.push('/dashboard/analytics/admin');
        break;
      default:
        router.push('/dashboard/analytics/student');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // This will be shown briefly before redirect
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Redirecting to your personalized analytics view...
            </p>
          </div>
        </div>

        {/* Quick Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Student Analytics
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Personal Progress</div>
              <p className="text-xs text-muted-foreground">
                Track your coding journey and achievements
              </p>
              <Button size="sm" className="mt-2" onClick={() => router.push('/dashboard/analytics/student')}>
                View Analytics <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Teacher Analytics
              </CardTitle>
              <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Class Management</div>
              <p className="text-xs text-muted-foreground">
                Monitor student progress and class performance
              </p>
              <Button size="sm" className="mt-2" onClick={() => router.push('/dashboard/analytics/teacher')}>
                View Analytics <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Admin Analytics
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Platform Overview</div>
              <p className="text-xs text-muted-foreground">
                Monitor platform performance and user engagement
              </p>
              <Button size="sm" className="mt-2" onClick={() => router.push('/dashboard/analytics/admin')}>
                View Analytics <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Quick Actions
              </CardTitle>
              <Zap className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button size="sm" variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  <Share className="h-4 w-4 mr-2" />
                  Share Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Features Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Analytics Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                    <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium">Progress Tracking</div>
                    <div className="text-sm text-muted-foreground">
                      Monitor your learning journey with detailed metrics
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
                    <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium">Goal Management</div>
                    <div className="text-sm text-muted-foreground">
                      Set and track your learning objectives
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950">
                    <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium">Achievement System</div>
                    <div className="text-sm text-muted-foreground">
                      Earn badges and track your accomplishments
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950">
                    <Brain className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="font-medium">Skill Analysis</div>
                    <div className="text-sm text-muted-foreground">
                      Analyze your strengths and improvement areas
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Available Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="font-medium">Student View</div>
                      <div className="text-sm text-muted-foreground">Personal progress and achievements</div>
                    </div>
                  </div>
                  <Badge variant="outline">Available</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <div className="font-medium">Teacher View</div>
                      <div className="text-sm text-muted-foreground">Class management and student monitoring</div>
                    </div>
                  </div>
                  <Badge variant="outline">Available</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <div>
                      <div className="font-medium">Admin View</div>
                      <div className="text-sm text-muted-foreground">Platform performance and analytics</div>
                    </div>
                  </div>
                  <Badge variant="outline">Available</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}