'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Plus, 
  Calendar, 
  Clock, 
  Copy, 
  Share, 
  Settings,
  Play,
  Pause,
  Square,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  MoreHorizontal,
  Search,
  Filter,
  Star,
  TrendingUp,
  Award,
  Target,
  Code,
  MessageSquare,
  Camera,
  Headphones
} from 'lucide-react';
import { 
  CollaborationSession, 
  CollaborationType, 
  SessionStatus,
  CollaborationUser,
  SessionTemplate
} from '@/types/collaboration';
import { sessionManager } from '@/lib/collaboration/session-manager';
import { cn } from '@/lib/utils';

export default function CollaboratePage() {
  const [sessions, setSessions] = useState<CollaborationSession[]>([]);
  const [templates, setTemplates] = useState<SessionTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-sessions');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<CollaborationType | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<SessionStatus | 'ALL'>('ALL');

  // Mock current user
  const currentUser: CollaborationUser = {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/avatars/user1.jpg',
    role: 'STUDENT',
    permission: 'OWNER',
    connectionStatus: 'CONNECTED',
    joinedAt: new Date(),
    lastActiveAt: new Date(),
    isTyping: false,
    isSharingScreen: false,
    isMuted: false,
    isVideoEnabled: false,
    audioLevel: 0,
    networkQuality: 'EXCELLENT',
  };

  useEffect(() => {
    // Load sessions and templates
    const loadData = () => {
      const userSessions = sessionManager.getUserSessions(currentUser.id);
      const sessionTemplates = sessionManager.getTemplates();
      
      setSessions(userSessions);
      setTemplates(sessionTemplates);
      setLoading(false);
    };

    loadData();
  }, [currentUser.id]);

  // Create new session
  const handleCreateSession = (type: CollaborationType, templateId?: string) => {
    if (templateId) {
      const result = sessionManager.createSessionFromTemplate(
        templateId,
        currentUser.id,
        currentUser,
        `New ${type.replace('_', ' ').toLowerCase()} session`
      );
      
      if (result.success && result.session) {
        setSessions(prev => [...prev, result.session!]);
      }
    } else {
      const session = sessionManager.createSession(
        currentUser.id,
        currentUser,
        `New ${type.replace('_', ' ').toLowerCase()} session`,
        type
      );
      
      setSessions(prev => [...prev, session]);
    }
  };

  // Join session
  const handleJoinSession = (sessionId: string) => {
    window.location.href = `/dashboard/collaborate/session/${sessionId}`;
  };

  // Start session
  const handleStartSession = (sessionId: string) => {
    const result = sessionManager.startSession(sessionId, currentUser.id);
    if (result.success) {
      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, status: 'ACTIVE', startedAt: new Date() }
            : session
        )
      );
    }
  };

  // End session
  const handleEndSession = (sessionId: string) => {
    const result = sessionManager.endSession(sessionId, currentUser.id);
    if (result.success) {
      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, status: 'ENDED', endedAt: new Date() }
            : session
        )
      );
    }
  };

  // Copy invite link
  const handleCopyInviteLink = (inviteLink: string) => {
    navigator.clipboard.writeText(inviteLink);
    // Show toast notification
  };

  // Get session type icon
  const getSessionTypeIcon = (type: CollaborationType) => {
    switch (type) {
      case 'PAIR_PROGRAMMING':
        return <Users className="h-4 w-4" />;
      case 'GROUP_PROJECT':
        return <Code className="h-4 w-4" />;
      case 'CODE_REVIEW':
        return <MessageSquare className="h-4 w-4" />;
      case 'LIVE_DEMO':
        return <Monitor className="h-4 w-4" />;
      case 'DEBUGGING_SESSION':
        return <Target className="h-4 w-4" />;
      case 'INTERVIEW_PRACTICE':
        return <Award className="h-4 w-4" />;
      case 'HACKATHON_TEAM':
        return <TrendingUp className="h-4 w-4" />;
      case 'STUDY_GROUP':
        return <Star className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  // Get status color
  const getStatusColor = (status: SessionStatus) => {
    switch (status) {
      case 'CREATED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'WAITING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PAUSED':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'ENDED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || session.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || session.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading collaboration sessions...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Collaborate</h1>
            <p className="text-muted-foreground">
              Create and join real-time coding sessions
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Session
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sessions.filter(s => s.status === 'ACTIVE').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently running
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessions.length}</div>
              <p className="text-xs text-muted-foreground">
                All time
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
              <p className="text-xs text-muted-foreground">
                Available
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collaboration Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sessions.reduce((total, session) => total + (session.duration || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Minutes this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="my-sessions">My Sessions</TabsTrigger>
            <TabsTrigger value="public-sessions">Public Sessions</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          {/* My Sessions Tab */}
          <TabsContent value="my-sessions" className="space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search sessions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-md w-full"
                  />
                </div>
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as CollaborationType | 'ALL')}
                className="px-3 py-2 border rounded-md"
              >
                <option value="ALL">All Types</option>
                <option value="PAIR_PROGRAMMING">Pair Programming</option>
                <option value="GROUP_PROJECT">Group Project</option>
                <option value="CODE_REVIEW">Code Review</option>
                <option value="LIVE_DEMO">Live Demo</option>
                <option value="DEBUGGING_SESSION">Debugging</option>
                <option value="INTERVIEW_PRACTICE">Interview Practice</option>
                <option value="HACKATHON_TEAM">Hackathon</option>
                <option value="STUDY_GROUP">Study Group</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as SessionStatus | 'ALL')}
                className="px-3 py-2 border rounded-md"
              >
                <option value="ALL">All Status</option>
                <option value="CREATED">Created</option>
                <option value="WAITING">Waiting</option>
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Paused</option>
                <option value="ENDED">Ended</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {/* Sessions List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSessions.map(session => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getSessionTypeIcon(session.type)}
                        <div>
                          <CardTitle className="text-lg">{session.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {session.description || 'No description'}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Session Info */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Participants</span>
                          <span>{session.participants.length}/{session.maxParticipants}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Language</span>
                          <Badge variant="outline" className="capitalize">
                            {session.language}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Difficulty</span>
                          <Badge variant="outline" className="capitalize">
                            {session.difficulty.toLowerCase()}
                          </Badge>
                        </div>
                        
                        {session.duration && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Duration</span>
                            <span>{session.duration} minutes</span>
                          </div>
                        )}
                      </div>

                      {/* Participants */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Participants:</div>
                        <div className="flex items-center gap-2">
                          {session.participants.slice(0, 3).map(participant => (
                            <Avatar key={participant.id} className="h-6 w-6">
                              <AvatarImage src={participant.avatar} />
                              <AvatarFallback className="text-xs">
                                {participant.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {session.participants.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{session.participants.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {session.status === 'CREATED' || session.status === 'WAITING' ? (
                          <Button
                            size="sm"
                            onClick={() => handleStartSession(session.id)}
                            className="flex-1"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start
                          </Button>
                        ) : session.status === 'ACTIVE' ? (
                          <Button
                            size="sm"
                            onClick={() => handleJoinSession(session.id)}
                            className="flex-1"
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Join
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                            className="flex-1"
                          >
                            <Square className="h-4 w-4 mr-2" />
                            Ended
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyInviteLink(session.inviteLink)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredSessions.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No sessions found</p>
                  <Button className="mt-4" onClick={() => setActiveTab('create')}>
                    Create Your First Session
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Public Sessions Tab */}
          <TabsContent value="public-sessions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Mock public sessions */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Code className="h-4 w-4" />
                      <div>
                        <CardTitle className="text-lg">React Workshop</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Learn React fundamentals together
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      ACTIVE
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Participants</span>
                        <span>8/20</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Language</span>
                        <Badge variant="outline">JavaScript</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Difficulty</span>
                        <Badge variant="outline">Intermediate</Badge>
                      </div>
                    </div>

                    <Button size="sm" className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Join Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map(template => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getSessionTypeIcon(template.type)}
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {template.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{template.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Type</span>
                          <Badge variant="outline" className="capitalize">
                            {template.type.replace('_', ' ').toLowerCase()}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Language</span>
                          <Badge variant="outline" className="capitalize">
                            {template.defaultLanguage}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Duration</span>
                          <span>{template.estimatedDuration} min</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Usage</span>
                          <span>{template.usageCount} times</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleCreateSession(template.type, template.id)}
                          className="flex-1"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Use Template
                        </Button>
                        
                        <Button size="sm" variant="outline">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Create New Tab */}
          <TabsContent value="create" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { type: 'PAIR_PROGRAMMING', label: 'Pair Programming', icon: Users, description: 'Work together with one partner' },
                { type: 'GROUP_PROJECT', label: 'Group Project', icon: Code, description: 'Collaborate on a team project' },
                { type: 'CODE_REVIEW', label: 'Code Review', icon: MessageSquare, description: 'Review and discuss code' },
                { type: 'LIVE_DEMO', label: 'Live Demo', icon: Monitor, description: 'Demonstrate coding live' },
                { type: 'DEBUGGING_SESSION', label: 'Debugging', icon: Target, description: 'Debug code together' },
                { type: 'INTERVIEW_PRACTICE', label: 'Interview Practice', icon: Award, description: 'Practice coding interviews' },
                { type: 'HACKATHON_TEAM', label: 'Hackathon', icon: TrendingUp, description: 'Compete in coding challenges' },
                { type: 'STUDY_GROUP', label: 'Study Group', icon: Star, description: 'Study and learn together' },
              ].map(({ type, label, icon: Icon, description }) => (
                <Card
                  key={type}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleCreateSession(type as CollaborationType)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{label}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <Button size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Session
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
