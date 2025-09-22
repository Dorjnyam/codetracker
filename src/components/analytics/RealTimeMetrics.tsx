'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Users,
  Clock,
  Zap,
  RefreshCw,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { RealTimeMetric, RealTimeUpdate } from '@/types/analytics';
import { cn } from '@/lib/utils';

interface RealTimeMetricsProps {
  className?: string;
}

export function RealTimeMetrics({ className }: RealTimeMetricsProps) {
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [updateCount, setUpdateCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock real-time metrics data
  const mockMetrics: RealTimeMetric[] = [
    {
      id: 'active_users',
      name: 'Active Users',
      value: Math.floor(Math.random() * 1000) + 500,
      timestamp: new Date(),
      metadata: { change: Math.random() * 20 - 10 },
    },
    {
      id: 'page_views',
      name: 'Page Views',
      value: Math.floor(Math.random() * 10000) + 5000,
      timestamp: new Date(),
      metadata: { change: Math.random() * 30 - 15 },
    },
    {
      id: 'assignments_submitted',
      name: 'Assignments Submitted',
      value: Math.floor(Math.random() * 100) + 50,
      timestamp: new Date(),
      metadata: { change: Math.random() * 25 - 12 },
    },
    {
      id: 'collaboration_sessions',
      name: 'Active Sessions',
      value: Math.floor(Math.random() * 50) + 20,
      timestamp: new Date(),
      metadata: { change: Math.random() * 15 - 7 },
    },
    {
      id: 'response_time',
      name: 'Response Time (ms)',
      value: Math.floor(Math.random() * 200) + 100,
      timestamp: new Date(),
      metadata: { change: Math.random() * 50 - 25 },
    },
    {
      id: 'error_rate',
      name: 'Error Rate (%)',
      value: Math.random() * 2,
      timestamp: new Date(),
      metadata: { change: Math.random() * 1 - 0.5 },
    },
  ];

  // Simulate WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      // Simulate connection
      setIsConnected(true);
      
      // Simulate real-time updates
      intervalRef.current = setInterval(() => {
        if (!isPaused) {
          setMetrics(prevMetrics => 
            prevMetrics.map(metric => ({
              ...metric,
              value: metric.value + (Math.random() * 10 - 5),
              timestamp: new Date(),
              metadata: { 
                ...metric.metadata,
                change: Math.random() * 20 - 10 
              },
            }))
          );
          setLastUpdate(new Date());
          setUpdateCount(prev => prev + 1);
        }
      }, 2000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setIsConnected(false);
      };
    };

    // Initialize with mock data
    setMetrics(mockMetrics);
    
    const cleanup = connectWebSocket();
    
    return cleanup;
  }, [isPaused]);

  const handleRefresh = () => {
    setMetrics(mockMetrics);
    setLastUpdate(new Date());
    setUpdateCount(prev => prev + 1);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const formatValue = (value: number, name: string) => {
    if (name.includes('Rate') || name.includes('%')) {
      return `${value.toFixed(2)}%`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return Math.round(value).toLocaleString();
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 dark:text-green-400';
    if (change < 0) return 'text-red-600 dark:text-red-400';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />;
    if (change < 0) return <TrendingDown className="h-4 w-4" />;
    return null;
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Real-Time Metrics</h2>
          <p className="text-muted-foreground">
            Live platform performance and user activity
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handlePauseResume}
          >
            {isPaused ? (
              <Eye className="h-4 w-4 mr-2" />
            ) : (
              <EyeOff className="h-4 w-4 mr-2" />
            )}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-3 h-3 rounded-full',
                isConnected ? 'bg-green-500' : 'bg-red-500'
              )} />
              <div>
                <div className="font-medium">
                  {isConnected ? 'Live Data Stream Active' : 'Connection Lost'}
                </div>
                <div className="text-sm text-muted-foreground">
                  Last update: {lastUpdate.toLocaleTimeString()} • 
                  Updates received: {updateCount}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? 'default' : 'destructive'}>
                {isConnected ? 'ONLINE' : 'OFFLINE'}
              </Badge>
              {isPaused && (
                <Badge variant="secondary">PAUSED</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.name}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs text-muted-foreground">LIVE</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {formatValue(metric.value, metric.name)}
                </div>
                
                {metric.metadata?.change !== undefined && (
                  <div className={cn(
                    'flex items-center gap-1 text-sm',
                    getChangeColor(metric.metadata.change)
                  )}>
                    {getChangeIcon(metric.metadata.change)}
                    <span>
                      {metric.metadata.change > 0 ? '+' : ''}
                      {metric.metadata.change.toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">vs last update</span>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">
                  Updated: {metric.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Live Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {[
              { id: 1, action: 'User logged in', user: 'alice@example.com', time: new Date(Date.now() - 1000) },
              { id: 2, action: 'Assignment submitted', user: 'bob@example.com', time: new Date(Date.now() - 2000) },
              { id: 3, action: 'Collaboration session started', user: 'carol@example.com', time: new Date(Date.now() - 3000) },
              { id: 4, action: 'Code executed', user: 'david@example.com', time: new Date(Date.now() - 4000) },
              { id: 5, action: 'Achievement unlocked', user: 'eve@example.com', time: new Date(Date.now() - 5000) },
              { id: 6, action: 'Report generated', user: 'frank@example.com', time: new Date(Date.now() - 6000) },
              { id: 7, action: 'User logged out', user: 'grace@example.com', time: new Date(Date.now() - 7000) },
              { id: 8, action: 'Assignment graded', user: 'henry@example.com', time: new Date(Date.now() - 8000) },
            ].map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-2 border rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{activity.action}</div>
                  <div className="text-xs text-muted-foreground">{activity.user}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {activity.time.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">CPU Usage</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }} />
                  </div>
                  <span className="text-sm font-medium">65%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Memory Usage</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-muted rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }} />
                  </div>
                  <span className="text-sm font-medium">78%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Disk Usage</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }} />
                  </div>
                  <span className="text-sm font-medium">45%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Online Users</span>
                <span className="text-sm font-medium">892</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Sessions</span>
                <span className="text-sm font-medium">156</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">New Users Today</span>
                <span className="text-sm font-medium">23</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Session Duration</span>
                <span className="text-sm font-medium">24.7 min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
