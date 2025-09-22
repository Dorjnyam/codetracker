'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Share, 
  ShareOff,
  Settings,
  Phone,
  PhoneOff,
  Monitor,
  MonitorOff,
  MessageCircle,
  Code,
  Palette,
  FileText,
  Download,
  Upload,
  Save,
  Play,
  Square,
  MoreHorizontal,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Star,
  Award,
  Target,
  TrendingUp
} from 'lucide-react';
import { CollaborativeEditor } from '@/components/collaboration/CollaborativeEditor';
import { ChatSystem } from '@/components/collaboration/ChatSystem';
import { 
  CollaborationSession, 
  CollaborationUser, 
  ChatMessage,
  CursorPosition,
  CodeSelection,
  Operation,
  DocumentState,
  VoiceVideoCall,
  WhiteboardDrawing
} from '@/types/collaboration';
import { sessionManager } from '@/lib/collaboration/session-manager';
import { webrtcManager } from '@/lib/collaboration/webrtc-manager';
import { cn } from '@/lib/utils';

export default function CollaborationSessionPage() {
  const params = useParams();
  const sessionId = params.id as string;
  
  const [session, setSession] = useState<CollaborationSession | null>(null);
  const [participants, setParticipants] = useState<CollaborationUser[]>([]);
  const [currentUser, setCurrentUser] = useState<CollaborationUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState('editor');
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceCall, setVoiceCall] = useState<VoiceVideoCall | null>(null);
  const [videoCall, setVideoCall] = useState<VoiceVideoCall | null>(null);
  const [screenShare, setScreenShare] = useState<VoiceVideoCall | null>(null);
  const [whiteboardDrawings, setWhiteboardDrawings] = useState<WhiteboardDrawing[]>([]);
  const [documentState, setDocumentState] = useState<DocumentState>({
    content: '',
    version: 0,
    operations: [],
    lastModifiedBy: '',
    lastModifiedAt: new Date(),
  });

  // Mock current user
  const mockCurrentUser: CollaborationUser = {
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
    // Load session data
    const loadSession = () => {
      const sessionData = sessionManager.getSession(sessionId);
      if (sessionData) {
        setSession(sessionData);
        setParticipants(sessionData.participants);
        setCurrentUser(mockCurrentUser);
        
        // Initialize WebRTC
        webrtcManager.initialize(mockCurrentUser, sessionId);
        setIsConnected(true);
        
        // Load mock messages
        setMessages([
          {
            id: 'msg1',
            sessionId,
            userId: 'user1',
            user: mockCurrentUser,
            type: 'TEXT',
            content: 'Welcome to the collaboration session!',
            mentions: [],
            reactions: [],
            timestamp: new Date(Date.now() - 300000),
            isSystemMessage: false,
          },
          {
            id: 'msg2',
            sessionId,
            userId: 'user2',
            user: {
              id: 'user2',
              name: 'Jane Smith',
              email: 'jane@example.com',
              avatar: '/avatars/user2.jpg',
              role: 'STUDENT',
              permission: 'EDIT',
              connectionStatus: 'CONNECTED',
              joinedAt: new Date(),
              lastActiveAt: new Date(),
              isTyping: false,
              isSharingScreen: false,
              isMuted: false,
              isVideoEnabled: true,
              audioLevel: 0.5,
              networkQuality: 'GOOD',
            },
            type: 'TEXT',
            content: 'Thanks for inviting me! Ready to code together.',
            mentions: [],
            reactions: [],
            timestamp: new Date(Date.now() - 180000),
            isSystemMessage: false,
          },
        ]);
      }
    };

    loadSession();
  }, [sessionId]);

  // Handle code changes
  const handleCodeChange = (content: string, operations: Operation[]) => {
    setDocumentState(prev => ({
      ...prev,
      content,
      version: prev.version + 1,
      operations: [...prev.operations, ...operations],
      lastModifiedBy: currentUser?.id || '',
      lastModifiedAt: new Date(),
    }));
  };

  // Handle cursor movement
  const handleCursorMove = (position: CursorPosition) => {
    // Update participant cursor position
    setParticipants(prev => 
      prev.map(p => 
        p.id === position.userId 
          ? { ...p, cursorPosition: position }
          : p
      )
    );
  };

  // Handle selection change
  const handleSelectionChange = (selection: CodeSelection) => {
    // Update participant selection
    setParticipants(prev => 
      prev.map(p => 
        p.id === selection.userId 
          ? { ...p, selection }
          : p
      )
    );
  };

  // Handle save
  const handleSave = () => {
    // Implement save logic
    console.log('Saving document:', documentState);
  };

  // Handle execute
  const handleExecute = () => {
    // Implement code execution
    console.log('Executing code:', documentState.content);
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    console.log('Uploading file:', file.name);
  };

  // Handle file download
  const handleFileDownload = () => {
    console.log('Downloading file');
  };

  // Handle chat message
  const handleSendMessage = (content: string, type: any, metadata?: any) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sessionId,
      userId: currentUser?.id || '',
      user: currentUser!,
      type,
      content,
      mentions: metadata?.mentions || [],
      reactions: [],
      timestamp: new Date(),
      isSystemMessage: false,
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  // Handle code snippet
  const handleSendCodeSnippet = (snippet: any) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sessionId,
      userId: currentUser?.id || '',
      user: currentUser!,
      type: 'CODE_SNIPPET',
      content: 'Code snippet shared',
      codeSnippet: snippet,
      mentions: [],
      reactions: [],
      timestamp: new Date(),
      isSystemMessage: false,
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  // Handle file share
  const handleSendFile = (file: File) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sessionId,
      userId: currentUser?.id || '',
      user: currentUser!,
      type: 'FILE_SHARE',
      content: `Shared file: ${file.name}`,
      fileAttachment: {
        id: `file_${Date.now()}`,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        url: URL.createObjectURL(file),
        uploadedBy: currentUser?.id || '',
        uploadedAt: new Date(),
      },
      mentions: [],
      reactions: [],
      timestamp: new Date(),
      isSystemMessage: false,
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  // Handle message reaction
  const handleReactToMessage = (messageId: string, emoji: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? {
              ...msg,
              reactions: [
                ...msg.reactions,
                {
                  emoji,
                  userId: currentUser?.id || '',
                  userName: currentUser?.name || '',
                  timestamp: new Date(),
                }
              ]
            }
          : msg
      )
    );
  };

  // Handle reply to message
  const handleReplyToMessage = (messageId: string, content: string) => {
    handleSendMessage(`Replying to message: ${content}`, 'TEXT');
  };

  // Handle edit message
  const handleEditMessage = (messageId: string, content: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content, editedAt: new Date() }
          : msg
      )
    );
  };

  // Handle delete message
  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  // Handle mention user
  const handleMentionUser = (userId: string) => {
    console.log('Mentioning user:', userId);
  };

  // Handle voice/video toggle
  const handleToggleAudio = () => {
    if (currentUser) {
      const newMuted = !currentUser.isMuted;
      setCurrentUser(prev => prev ? { ...prev, isMuted: newMuted } : null);
      webrtcManager.toggleAudio(newMuted);
    }
  };

  const handleToggleVideo = () => {
    if (currentUser) {
      const newVideoEnabled = !currentUser.isVideoEnabled;
      setCurrentUser(prev => prev ? { ...prev, isVideoEnabled: newVideoEnabled } : null);
      webrtcManager.toggleVideo(newVideoEnabled);
    }
  };

  const handleToggleScreenShare = () => {
    if (currentUser) {
      const newScreenShare = !currentUser.isSharingScreen;
      setCurrentUser(prev => prev ? { ...prev, isSharingScreen: newScreenShare } : null);
      
      if (newScreenShare) {
        webrtcManager.startScreenShare();
      } else {
        webrtcManager.stopScreenShare();
      }
    }
  };

  // Handle recording
  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
  };

  // Handle end session
  const handleEndSession = () => {
    if (session) {
      sessionManager.endSession(session.id, currentUser?.id || '');
      webrtcManager.disconnectAll();
      // Redirect to collaboration page
      window.location.href = '/dashboard/collaborate';
    }
  };

  if (!session || !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <h1 className="text-xl font-semibold">{session.title}</h1>
          </div>
          
          <Badge variant="outline" className="capitalize">
            {session.type.replace('_', ' ').toLowerCase()}
          </Badge>
          
          <Badge variant="secondary" className="capitalize">
            {session.language}
          </Badge>
          
          <Badge className={cn(
            'capitalize',
            session.status === 'ACTIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            session.status === 'WAITING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
          )}>
            {session.status.toLowerCase()}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Connection Status */}
          <div className="flex items-center gap-1">
            {isConnected ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm text-muted-foreground">
              {participants.length} online
            </span>
          </div>

          {/* Media Controls */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleAudio}
            className={cn(currentUser.isMuted && 'bg-red-100 text-red-800')}
          >
            {currentUser.isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleVideo}
            className={cn(!currentUser.isVideoEnabled && 'bg-red-100 text-red-800')}
          >
            {currentUser.isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleScreenShare}
            className={cn(currentUser.isSharingScreen && 'bg-blue-100 text-blue-800')}
          >
            {currentUser.isSharingScreen ? <ShareOff className="h-4 w-4" /> : <Share className="h-4 w-4" />}
          </Button>

          {/* Recording */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleRecording}
            className={cn(isRecording && 'bg-red-100 text-red-800')}
          >
            {isRecording ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          {/* Settings */}
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>

          {/* End Session */}
          <Button variant="destructive" size="sm" onClick={handleEndSession}>
            <PhoneOff className="h-4 w-4 mr-2" />
            End Session
          </Button>
        </div>
      </div>

      {/* Participants Bar */}
      <div className="flex items-center gap-2 p-2 bg-muted/50 border-b">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Participants:</span>
        
        <div className="flex items-center gap-2">
          {participants.map(participant => (
            <div
              key={participant.id}
              className="flex items-center gap-2 px-2 py-1 rounded-md bg-background border"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={participant.avatar} />
                <AvatarFallback className="text-xs">
                  {participant.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <span className="text-sm font-medium">{participant.name}</span>
              
              <div className="flex items-center gap-1">
                {participant.isMuted && (
                  <MicOff className="h-3 w-3 text-muted-foreground" />
                )}
                
                {participant.isVideoEnabled && (
                  <Video className="h-3 w-3 text-green-500" />
                )}
                
                {participant.isSharingScreen && (
                  <Share className="h-3 w-3 text-blue-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Editor */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="terminal">Terminal</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="flex-1 m-0">
              <CollaborativeEditor
                session={session}
                participants={participants}
                currentUser={currentUser}
                onCodeChange={handleCodeChange}
                onCursorMove={handleCursorMove}
                onSelectionChange={handleSelectionChange}
                onSave={handleSave}
                onExecute={handleExecute}
                onFileUpload={handleFileUpload}
                onFileDownload={handleFileDownload}
                className="h-full"
              />
            </TabsContent>

            <TabsContent value="whiteboard" className="flex-1 m-0">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Whiteboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Palette className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Whiteboard coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files" className="flex-1 m-0">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Files
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">File manager coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terminal" className="flex-1 m-0">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Terminal
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Code className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Terminal coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar - Chat */}
        <div className="w-80 border-l">
          <ChatSystem
            messages={messages}
            currentUser={currentUser}
            participants={participants}
            onSendMessage={handleSendMessage}
            onSendCodeSnippet={handleSendCodeSnippet}
            onSendFile={handleSendFile}
            onReactToMessage={handleReactToMessage}
            onReplyToMessage={handleReplyToMessage}
            onEditMessage={handleEditMessage}
            onDeleteMessage={handleDeleteMessage}
            onMentionUser={handleMentionUser}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
