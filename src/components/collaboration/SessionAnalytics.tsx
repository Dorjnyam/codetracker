'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  MessageCircle, 
  Code, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Award,
  Target,
  Calendar,
  Download,
  Share,
  Eye,
  EyeOff,
  Filter,
  RefreshCw,
  Zap,
  Brain,
  Heart,
  Star,
  ThumbsUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Timer,
  MousePointer,
  Keyboard,
  Monitor
} from 'lucide-react';
import { 
  CollaborationSession, 
  SessionAnalytics, 
  CollaborationUser,
  CollaborationEvent,
  ChatMessage
} from '@/types/collaboration';
import { cn } from '@/lib/utils';

interface SessionAnalyticsProps {
  session: CollaborationSession;
  participants: CollaborationUser[];
  events: CollaborationEvent[];
  messages: ChatMessage[];
  onExport: () => void;
  onShare: () => void;
  className?: string;
}

export function SessionAnalytics({
  session,
  participants,
  events,
  messages,
  onExport,
  onShare,
  className,
}: SessionAnalyticsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('all');
  const [analytics, setAnalytics] = useState<SessionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Calculate analytics from session data
    const calculateAnalytics = () => {
      const sessionAnalytics: SessionAnalytics = {
        totalParticipants: participants.length,
        averageParticipationTime: session.duration || 0,
        totalMessages: messages.length,
        totalCodeChanges: events.filter(e => e.type === 'CODE_CHANGED').length,
        totalLinesAdded: events
          .filter(e => e.type === 'CODE_CHANGED')
          .reduce((total, e) => total + (e.data.linesAdded || 0), 0),
        totalLinesDeleted: events
          .filter(e => e.type === 'CODE_CHANGED')
          .reduce((total, e) => total + (e.data.linesDeleted || 0), 0),
        mostActiveParticipant: getMostActiveParticipant(),
        participationHeatmap: calculateParticipationHeatmap(),
        chatActivity: calculateChatActivity(),
        codeActivity: calculateCodeActivity(),
        sessionQuality: calculateSessionQuality(),
        technicalIssues: events.filter(e => e.type === 'ERROR').length,
        connectionDrops: events.filter(e => e.type === 'USER_LEFT').length,
        averageLatency: calculateAverageLatency(),
      };

      setAnalytics(sessionAnalytics);
      setLoading(false);
    };

    calculateAnalytics();
  }, [session, participants, events, messages]);

  // Get most active participant
  const getMostActiveParticipant = (): string | undefined => {
    const activityCounts = participants.reduce((acc, participant) => {
      const messages = messages.filter(m => m.userId === participant.id).length;
      const codeChanges = events.filter(e => e.userId === participant.id && e.type === 'CODE_CHANGED').length;
      acc[participant.id] = messages + codeChanges;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(activityCounts).reduce((max, [id, count]) => 
      count > (activityCounts[max[0]] || 0) ? [id, count] : max
    )[0];
  };

  // Calculate participation heatmap
  const calculateParticipationHeatmap = (): Record<string, number> => {
    const heatmap: Record<string, number> = {};
    
    participants.forEach(participant => {
      const participantEvents = events.filter(e => e.userId === participant.id);
      const totalTime = participantEvents.reduce((total, event) => {
        return total + (event.data.duration || 0);
      }, 0);
      
      heatmap[participant.id] = totalTime;
    });

    return heatmap;
  };

  // Calculate chat activity
  const calculateChatActivity = (): Record<string, number> => {
    const chatActivity: Record<string, number> = {};
    
    participants.forEach(participant => {
      const messageCount = messages.filter(m => m.userId === participant.id).length;
      chatActivity[participant.id] = messageCount;
    });

    return chatActivity;
  };

  // Calculate code activity
  const calculateCodeActivity = (): Record<string, number> => {
    const codeActivity: Record<string, number> = {};
    
    participants.forEach(participant => {
      const codeChangeCount = events.filter(e => 
        e.userId === participant.id && e.type === 'CODE_CHANGED'
      ).length;
      codeActivity[participant.id] = codeChangeCount;
    });

    return codeActivity;
  };

  // Calculate session quality
  const calculateSessionQuality = (): 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' => {
    const technicalIssues = events.filter(e => e.type === 'ERROR').length;
    const connectionDrops = events.filter(e => e.type === 'USER_LEFT').length;
    const totalEvents = events.length;
    
    const issueRate = (technicalIssues + connectionDrops) / totalEvents;
    
    if (issueRate < 0.05) return 'EXCELLENT';
    if (issueRate < 0.15) return 'GOOD';
    if (issueRate < 0.30) return 'FAIR';
    return 'POOR';
  };

  // Calculate average latency
  const calculateAverageLatency = (): number => {
    const latencyEvents = events.filter(e => e.data.latency);
    if (latencyEvents.length === 0) return 0;
    
    const totalLatency = latencyEvents.reduce((total, e) => total + (e.data.latency || 0), 0);
    return totalLatency / latencyEvents.length;
  };

  // Get participant by ID
  const getParticipantById = (id: string): CollaborationUser | undefined => {
    return participants.find(p => p.id === id);
  };

  // Format duration
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Get quality color
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'EXCELLENT':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'GOOD':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'FAIR':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'POOR':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  if (loading || !analytics) {
    return (
      <Card className={cn('flex flex-col h-full', className)}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('flex flex-col h-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Session Analytics
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="flex-1 space-y-4 p-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Duration</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatDuration(analytics.averageParticipationTime)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total session time
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Participants</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalParticipants}</div>
                  <p className="text-xs text-muted-foreground">
                    Active users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalMessages}</div>
                  <p className="text-xs text-muted-foreground">
                    Chat messages
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Code Changes</CardTitle>
                  <Code className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalCodeChanges}</div>
                  <p className="text-xs text-muted-foreground">
                    Total edits
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Session Quality */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Session Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getQualityColor(analytics.sessionQuality)}>
                      {analytics.sessionQuality}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Based on technical issues and connection stability
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span>{analytics.technicalIssues} issues</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <XCircle className="h-4 w-4 text-orange-500" />
                      <span>{analytics.connectionDrops} disconnections</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Code Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Code Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      +{analytics.totalLinesAdded}
                    </div>
                    <p className="text-sm text-muted-foreground">Lines Added</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      -{analytics.totalLinesDeleted}
                    </div>
                    <p className="text-sm text-muted-foreground">Lines Deleted</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analytics.totalLinesAdded - analytics.totalLinesDeleted}
                    </div>
                    <p className="text-sm text-muted-foreground">Net Change</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants" className="flex-1 space-y-4 p-4">
            <div className="space-y-4">
              {participants.map(participant => {
                const participationTime = analytics.participationHeatmap[participant.id] || 0;
                const messageCount = analytics.chatActivity[participant.id] || 0;
                const codeChanges = analytics.codeActivity[participant.id] || 0;
                const isMostActive = analytics.mostActiveParticipant === participant.id;

                return (
                  <Card key={participant.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={participant.avatar} />
                            <AvatarFallback>
                              {participant.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{participant.name}</span>
                              {isMostActive && (
                                <Badge variant="secondary" className="text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Most Active
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {participant.role} • {participant.permission}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <div className="font-medium">{formatDuration(participationTime)}</div>
                            <p className="text-muted-foreground">Participation</p>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{messageCount}</div>
                            <p className="text-muted-foreground">Messages</p>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{codeChanges}</div>
                            <p className="text-muted-foreground">Code Changes</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="flex-1 space-y-4 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activity Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.slice(0, 10).map(event => {
                    const participant = getParticipantById(event.userId);
                    return (
                      <div key={event.id} className="flex items-center gap-3 p-2 rounded bg-muted/50">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {participant?.name || 'Unknown User'}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {event.type.replace('_', ' ').toLowerCase()}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {event.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="flex-1 space-y-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Network Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Latency</span>
                      <span className="font-medium">{analytics.averageLatency.toFixed(0)}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Connection Drops</span>
                      <span className="font-medium">{analytics.connectionDrops}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Technical Issues</span>
                      <span className="font-medium">{analytics.technicalIssues}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Engagement Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Messages per Hour</span>
                      <span className="font-medium">
                        {Math.round((analytics.totalMessages / analytics.averageParticipationTime) * 60)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Code Changes per Hour</span>
                      <span className="font-medium">
                        {Math.round((analytics.totalCodeChanges / analytics.averageParticipationTime) * 60)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Participation</span>
                      <span className="font-medium">
                        {Math.round((Object.keys(analytics.participationHeatmap).length / analytics.totalParticipants) * 100)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
