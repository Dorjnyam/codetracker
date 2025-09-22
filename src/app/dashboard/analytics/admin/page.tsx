'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Server,
  Shield,
  DollarSign,
  Activity,
  Download,
  Share,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Award,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Minus,
  Calendar,
  Brain,
  Zap,
  Globe,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  FileText,
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { 
  AdminAnalytics, 
  TimeRange, 
  FeatureUsage,
  ResourceUtilization,
  ContentMetrics,
  FeedbackTrend,
  SupportMetrics,
  AuditEntry
} from '@/types/analytics';
import { MetricCard } from '@/components/analytics/MetricCard';
import { ProgressChart } from '@/components/analytics/ProgressChart';
import { cn } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('MONTHLY');
  const [refreshing, setRefreshing] = useState(false);

  // Mock analytics data
  const mockAnalytics: AdminAnalytics = {
    timeRange: 'MONTHLY',
    period: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(),
    },
    
    usage: {
      totalUsers: 1247,
      activeUsers: 892,
      newUsers: 156,
      userGrowth: 12.5,
      retentionRate: 78.3,
      sessionDuration: 24.7, // minutes
      pageViews: 45678,
    },
    
    features: {
      assignments: {
        adoptionRate: 95.2,
        usageFrequency: 4.2,
        userSatisfaction: 8.7,
        retentionImpact: 0.15,
        growthTrend: 8.3,
      },
      collaboration: {
        adoptionRate: 67.8,
        usageFrequency: 2.1,
        userSatisfaction: 9.1,
        retentionImpact: 0.22,
        growthTrend: 15.7,
      },
      gamification: {
        adoptionRate: 89.4,
        usageFrequency: 3.8,
        userSatisfaction: 9.3,
        retentionImpact: 0.18,
        growthTrend: 12.2,
      },
      analytics: {
        adoptionRate: 45.6,
        usageFrequency: 1.2,
        userSatisfaction: 8.9,
        retentionImpact: 0.08,
        growthTrend: 25.4,
      },
      forums: {
        adoptionRate: 72.3,
        usageFrequency: 2.8,
        userSatisfaction: 8.2,
        retentionImpact: 0.12,
        growthTrend: 6.8,
      },
    },
    
    performance: {
      uptime: 99.8,
      responseTime: 245, // ms
      errorRate: 0.12,
      throughput: 1250, // requests per minute
      resourceUtilization: {
        cpu: 68.5,
        memory: 72.3,
        storage: 45.7,
        bandwidth: 89.2,
        database: 56.8,
      },
    },
    
    content: {
      mostPopularAssignments: [
        {
          id: 'assign1',
          title: 'JavaScript Fundamentals',
          usage: 1245,
          effectiveness: 9.2,
          satisfaction: 8.9,
          completionRate: 87.3,
        },
        {
          id: 'assign2',
          title: 'Python Data Structures',
          usage: 987,
          effectiveness: 8.8,
          satisfaction: 8.7,
          completionRate: 82.1,
        },
        {
          id: 'assign3',
          title: 'React Components',
          usage: 756,
          effectiveness: 9.0,
          satisfaction: 9.1,
          completionRate: 89.5,
        },
      ],
      mostEffectiveResources: [
        {
          id: 'resource1',
          title: 'Interactive Code Editor',
          usage: 2345,
          effectiveness: 9.5,
          satisfaction: 9.3,
          completionRate: 92.1,
        },
        {
          id: 'resource2',
          title: 'Video Tutorials',
          usage: 1876,
          effectiveness: 8.9,
          satisfaction: 8.8,
          completionRate: 85.7,
        },
        {
          id: 'resource3',
          title: 'Peer Review System',
          usage: 1234,
          effectiveness: 9.1,
          satisfaction: 9.0,
          completionRate: 88.9,
        },
      ],
      userSatisfaction: 8.7,
      contentEngagement: 84.2,
    },
    
    satisfaction: {
      overallRating: 4.3,
      npsScore: 67,
      feedbackTrends: [
        {
          category: 'User Interface',
          sentiment: 'POSITIVE',
          count: 234,
          trend: 12.5,
          period: 'Last 30 days',
        },
        {
          category: 'Performance',
          sentiment: 'POSITIVE',
          count: 189,
          trend: 8.7,
          period: 'Last 30 days',
        },
        {
          category: 'Features',
          sentiment: 'NEUTRAL',
          count: 156,
          trend: -2.1,
          period: 'Last 30 days',
        },
        {
          category: 'Support',
          sentiment: 'POSITIVE',
          count: 98,
          trend: 15.3,
          period: 'Last 30 days',
        },
      ],
      supportTickets: {
        totalTickets: 234,
        resolvedTickets: 198,
        averageResolutionTime: 4.2, // hours
        satisfactionScore: 8.6,
        commonIssues: [
          'Login issues',
          'Assignment submission problems',
          'Code editor not loading',
          'Video playback issues',
          'Mobile app crashes',
        ],
      },
    },
    
    security: {
      securityIncidents: 2,
      complianceScore: 94.5,
      dataBreaches: 0,
      auditTrail: [
        {
          id: 'audit1',
          userId: 'user123',
          action: 'LOGIN',
          resource: 'Authentication',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0...',
          result: 'SUCCESS',
        },
        {
          id: 'audit2',
          userId: 'user456',
          action: 'DATA_EXPORT',
          resource: 'User Data',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0...',
          result: 'SUCCESS',
        },
        {
          id: 'audit3',
          userId: 'user789',
          action: 'FAILED_LOGIN',
          resource: 'Authentication',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0...',
          result: 'FAILURE',
        },
      ],
    },
    
    financial: {
      revenue: 45678.90,
      costs: 23456.78,
      profit: 22222.12,
      userLifetimeValue: 156.78,
      acquisitionCost: 23.45,
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
    console.log('Exporting admin analytics...');
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
            <p className="text-muted-foreground">Loading platform analytics...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
            <p className="text-muted-foreground">
              Monitor platform performance and user engagement
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
            title="Total Users"
            value={analytics.usage.totalUsers}
            unit=""
            trend={analytics.usage.userGrowth}
            icon={<Users className="h-4 w-4" />}
            color="blue"
          />
          
          <MetricCard
            title="Active Users"
            value={analytics.usage.activeUsers}
            unit=""
            trend={8.7}
            icon={<Activity className="h-4 w-4" />}
            color="green"
          />
          
          <MetricCard
            title="Uptime"
            value={analytics.performance.uptime}
            unit="%"
            trend={0.1}
            icon={<Server className="h-4 w-4" />}
            color="orange"
          />
          
          <MetricCard
            title="User Satisfaction"
            value={analytics.satisfaction.overallRating}
            unit="/5"
            trend={5.2}
            icon={<Star className="h-4 w-4" />}
            color="purple"
          />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Platform Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Platform Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Uptime</span>
                      <span className="font-medium">{analytics.performance.uptime}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Response Time</span>
                      <span className="font-medium">{analytics.performance.responseTime}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Error Rate</span>
                      <span className="font-medium">{analytics.performance.errorRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Throughput</span>
                      <span className="font-medium">{analytics.performance.throughput} req/min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Growth */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    User Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">New Users</span>
                      <span className="font-medium">{analytics.usage.newUsers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Growth Rate</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        +{analytics.usage.userGrowth}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Retention Rate</span>
                      <span className="font-medium">{analytics.usage.retentionRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Session Duration</span>
                      <span className="font-medium">{analytics.usage.sessionDuration} min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                      <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{analytics.usage.pageViews.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Page Views</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
                      <ThumbsUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{analytics.satisfaction.npsScore}</div>
                      <div className="text-sm text-muted-foreground">NPS Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950">
                      <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{analytics.security.complianceScore}%</div>
                      <div className="text-sm text-muted-foreground">Compliance Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Feature Adoption */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Feature Adoption
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analytics.features).map(([feature, data]) => (
                      <div key={feature} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">
                            {feature.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {data.adoptionRate}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${data.adoptionRate}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Satisfaction: {data.userSatisfaction}/10</span>
                          <span>Frequency: {data.usageFrequency}/week</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* User Engagement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    User Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Users</span>
                      <span className="font-medium">{analytics.usage.totalUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Users</span>
                      <span className="font-medium">{analytics.usage.activeUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">New Users</span>
                      <span className="font-medium">{analytics.usage.newUsers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Retention Rate</span>
                      <span className="font-medium">{analytics.usage.retentionRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Session Duration</span>
                      <span className="font-medium">{analytics.usage.sessionDuration} min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* System Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    System Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Uptime</span>
                      <span className="font-medium">{analytics.performance.uptime}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Response Time</span>
                      <span className="font-medium">{analytics.performance.responseTime}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Error Rate</span>
                      <span className="font-medium">{analytics.performance.errorRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Throughput</span>
                      <span className="font-medium">{analytics.performance.throughput} req/min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resource Utilization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Resource Utilization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analytics.performance.resourceUtilization).map(([resource, usage]) => (
                      <div key={resource} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {resource === 'cpu' && <Cpu className="h-4 w-4" />}
                            {resource === 'memory' && <HardDrive className="h-4 w-4" />}
                            {resource === 'storage' && <HardDrive className="h-4 w-4" />}
                            {resource === 'bandwidth' && <Wifi className="h-4 w-4" />}
                            {resource === 'database' && <Database className="h-4 w-4" />}
                            <span className="text-sm font-medium capitalize">{resource}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{usage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={cn(
                              'h-2 rounded-full transition-all duration-300',
                              usage > 80 ? 'bg-red-500' : usage > 60 ? 'bg-orange-500' : 'bg-green-500'
                            )}
                            style={{ width: `${usage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Popular Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Popular Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.content.mostPopularAssignments.map((assignment) => (
                      <div key={assignment.id} className="space-y-2 p-3 border rounded-lg">
                        <div className="font-medium">{assignment.title}</div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{assignment.usage} uses</span>
                          <span>{assignment.completionRate}% completion</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Effectiveness: {assignment.effectiveness}/10</span>
                          <span>Satisfaction: {assignment.satisfaction}/10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Effective Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Effective Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.content.mostEffectiveResources.map((resource) => (
                      <div key={resource.id} className="space-y-2 p-3 border rounded-lg">
                        <div className="font-medium">{resource.title}</div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{resource.usage} uses</span>
                          <span>{resource.completionRate}% completion</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Effectiveness: {resource.effectiveness}/10</span>
                          <span>Satisfaction: {resource.satisfaction}/10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Content Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analytics.content.userSatisfaction}/10</div>
                    <div className="text-sm text-muted-foreground">User Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analytics.content.contentEngagement}%</div>
                    <div className="text-sm text-muted-foreground">Content Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analytics.satisfaction.overallRating}/5</div>
                    <div className="text-sm text-muted-foreground">Overall Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Security Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Security Incidents</span>
                      <span className="font-medium">{analytics.security.securityIncidents}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Compliance Score</span>
                      <span className="font-medium">{analytics.security.complianceScore}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Data Breaches</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {analytics.security.dataBreaches}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Audit Trail */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Recent Audit Trail
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.security.auditTrail.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'w-2 h-2 rounded-full',
                            entry.result === 'SUCCESS' ? 'bg-green-500' : 'bg-red-500'
                          )} />
                          <span className="text-sm font-medium">{entry.action}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {entry.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Support Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Support Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analytics.satisfaction.supportTickets.totalTickets}</div>
                    <div className="text-sm text-muted-foreground">Total Tickets</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analytics.satisfaction.supportTickets.resolvedTickets}</div>
                    <div className="text-sm text-muted-foreground">Resolved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analytics.satisfaction.supportTickets.averageResolutionTime}h</div>
                    <div className="text-sm text-muted-foreground">Avg Resolution</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analytics.satisfaction.supportTickets.satisfactionScore}/10</div>
                    <div className="text-sm text-muted-foreground">Satisfaction</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Common Issues:</h4>
                  <div className="flex flex-wrap gap-2">
                    {analytics.satisfaction.supportTickets.commonIssues.map((issue, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {issue}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
