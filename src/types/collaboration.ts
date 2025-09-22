// Core collaboration types and interfaces

export type CollaborationType = 
  | 'PAIR_PROGRAMMING'
  | 'GROUP_PROJECT'
  | 'CODE_REVIEW'
  | 'LIVE_DEMO'
  | 'DEBUGGING_SESSION'
  | 'INTERVIEW_PRACTICE'
  | 'HACKATHON_TEAM'
  | 'STUDY_GROUP';

export type SessionStatus = 
  | 'CREATED'
  | 'WAITING'
  | 'ACTIVE'
  | 'PAUSED'
  | 'ENDED'
  | 'ARCHIVED';

export type PermissionLevel = 
  | 'VIEW_ONLY'
  | 'EDIT'
  | 'ADMIN'
  | 'OWNER';

export type ConnectionStatus = 
  | 'CONNECTING'
  | 'CONNECTED'
  | 'DISCONNECTED'
  | 'RECONNECTING'
  | 'ERROR';

export type MessageType = 
  | 'TEXT'
  | 'CODE_SNIPPET'
  | 'FILE_SHARE'
  | 'SYSTEM'
  | 'VOICE_NOTE'
  | 'EMOJI_REACTION'
  | 'MENTION';

export type RecordingStatus = 
  | 'NOT_RECORDING'
  | 'RECORDING'
  | 'PAUSED'
  | 'PROCESSING'
  | 'READY';

// User in collaboration session
export interface CollaborationUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  permission: PermissionLevel;
  connectionStatus: ConnectionStatus;
  joinedAt: Date;
  lastActiveAt: Date;
  cursorPosition?: CursorPosition;
  selection?: CodeSelection;
  isTyping: boolean;
  isSharingScreen: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  audioLevel: number;
  networkQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
}

// Cursor position in editor
export interface CursorPosition {
  line: number;
  column: number;
  userId: string;
  userName: string;
  color: string;
  timestamp: Date;
}

// Code selection range
export interface CodeSelection {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
  userId: string;
  userName: string;
  color: string;
  timestamp: Date;
}

// Collaboration session
export interface CollaborationSession {
  id: string;
  title: string;
  description?: string;
  type: CollaborationType;
  status: SessionStatus;
  ownerId: string;
  owner: CollaborationUser;
  participants: CollaborationUser[];
  maxParticipants: number;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  scheduledAt?: Date;
  duration?: number; // in minutes
  settings: SessionSettings;
  recording: RecordingInfo;
  analytics: SessionAnalytics;
  inviteCode: string;
  inviteLink: string;
  isPublic: boolean;
  tags: string[];
  language: string;
  framework?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
}

// Session settings
export interface SessionSettings {
  allowGuestJoin: boolean;
  requireApproval: boolean;
  enableRecording: boolean;
  enableChat: boolean;
  enableVoiceChat: boolean;
  enableVideoChat: boolean;
  enableScreenShare: boolean;
  enableWhiteboard: boolean;
  enableFileShare: boolean;
  autoSave: boolean;
  saveInterval: number; // in seconds
  maxFileSize: number; // in MB
  allowedFileTypes: string[];
  moderationEnabled: boolean;
  profanityFilter: boolean;
  autoEndAfterInactivity: number; // in minutes
  breakOutRoomsEnabled: boolean;
  maxBreakOutRooms: number;
}

// Recording information
export interface RecordingInfo {
  status: RecordingStatus;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // in seconds
  fileSize?: number; // in MB
  url?: string;
  thumbnailUrl?: string;
  consentRequired: boolean;
  consentGiven: boolean;
  participantsConsent: Record<string, boolean>;
}

// Session analytics
export interface SessionAnalytics {
  totalParticipants: number;
  averageParticipationTime: number; // in minutes
  totalMessages: number;
  totalCodeChanges: number;
  totalLinesAdded: number;
  totalLinesDeleted: number;
  mostActiveParticipant?: string;
  participationHeatmap: Record<string, number>; // userId -> minutes
  chatActivity: Record<string, number>; // userId -> message count
  codeActivity: Record<string, number>; // userId -> changes count
  sessionQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  technicalIssues: number;
  connectionDrops: number;
  averageLatency: number; // in ms
}

// Chat message
export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  user: CollaborationUser;
  type: MessageType;
  content: string;
  codeSnippet?: CodeSnippet;
  fileAttachment?: FileAttachment;
  replyTo?: string;
  mentions: string[]; // user IDs
  reactions: MessageReaction[];
  timestamp: Date;
  editedAt?: Date;
  deletedAt?: Date;
  isSystemMessage: boolean;
  metadata?: Record<string, any>;
}

// Code snippet in chat
export interface CodeSnippet {
  language: string;
  code: string;
  fileName?: string;
  lineNumbers: boolean;
  highlightLines?: number[];
  isExecutable: boolean;
  executionResult?: CodeExecutionResult;
}

// File attachment
export interface FileAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  uploadedBy: string;
  uploadedAt: Date;
}

// Message reaction
export interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
  timestamp: Date;
}

// Code execution result
export interface CodeExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime: number; // in ms
  memoryUsage: number; // in MB
  exitCode?: number;
}

// Whiteboard drawing
export interface WhiteboardDrawing {
  id: string;
  sessionId: string;
  userId: string;
  tool: 'PEN' | 'HIGHLIGHTER' | 'ERASER' | 'SHAPE' | 'TEXT';
  color: string;
  strokeWidth: number;
  points: DrawingPoint[];
  shape?: 'RECTANGLE' | 'CIRCLE' | 'LINE' | 'ARROW';
  text?: string;
  fontSize?: number;
  timestamp: Date;
}

// Drawing point
export interface DrawingPoint {
  x: number;
  y: number;
  pressure?: number;
  timestamp: Date;
}

// Session invitation
export interface SessionInvitation {
  id: string;
  sessionId: string;
  invitedBy: string;
  invitedUser: string;
  email?: string;
  permission: PermissionLevel;
  expiresAt: Date;
  acceptedAt?: Date;
  declinedAt?: Date;
  createdAt: Date;
  message?: string;
}

// Breakout room
export interface BreakoutRoom {
  id: string;
  sessionId: string;
  name: string;
  participants: string[]; // user IDs
  createdAt: Date;
  endedAt?: Date;
  isActive: boolean;
}

// Voice/video call
export interface VoiceVideoCall {
  id: string;
  sessionId: string;
  participants: string[]; // user IDs
  type: 'VOICE' | 'VIDEO' | 'SCREEN_SHARE';
  status: 'INITIATING' | 'ACTIVE' | 'ENDED';
  startedAt: Date;
  endedAt?: Date;
  duration?: number; // in seconds
  quality: 'HD' | 'SD' | 'LOW';
  recordingEnabled: boolean;
}

// Session template
export interface SessionTemplate {
  id: string;
  name: string;
  description: string;
  type: CollaborationType;
  settings: SessionSettings;
  defaultLanguage: string;
  defaultFramework?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  estimatedDuration: number; // in minutes
  tags: string[];
  createdBy: string;
  createdAt: Date;
  isPublic: boolean;
  usageCount: number;
  rating: number;
  reviews: SessionTemplateReview[];
}

// Session template review
export interface SessionTemplateReview {
  id: string;
  templateId: string;
  userId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
}

// Collaboration event
export interface CollaborationEvent {
  id: string;
  sessionId: string;
  type: 'USER_JOINED' | 'USER_LEFT' | 'CODE_CHANGED' | 'CURSOR_MOVED' | 'SELECTION_CHANGED' | 'MESSAGE_SENT' | 'FILE_SHARED' | 'RECORDING_STARTED' | 'RECORDING_STOPPED' | 'PERMISSION_CHANGED' | 'SESSION_ENDED';
  userId: string;
  timestamp: Date;
  data: Record<string, any>;
}

// Real-time collaboration state
export interface CollaborationState {
  session: CollaborationSession | null;
  participants: CollaborationUser[];
  messages: ChatMessage[];
  cursorPositions: CursorPosition[];
  selections: CodeSelection[];
  whiteboardDrawings: WhiteboardDrawing[];
  currentUser: CollaborationUser | null;
  connectionStatus: ConnectionStatus;
  isTyping: boolean;
  typingUsers: string[];
  voiceCall: VoiceVideoCall | null;
  videoCall: VoiceVideoCall | null;
  screenShare: VoiceVideoCall | null;
  breakoutRooms: BreakoutRoom[];
  isRecording: boolean;
  recordingStatus: RecordingStatus;
  lastActivity: Date;
  unreadMessages: number;
  notifications: CollaborationNotification[];
}

// Collaboration notification
export interface CollaborationNotification {
  id: string;
  type: 'INVITATION' | 'MENTION' | 'PERMISSION_CHANGE' | 'SESSION_START' | 'SESSION_END' | 'RECORDING_START' | 'RECORDING_END' | 'BREAKOUT_ROOM' | 'FILE_SHARE' | 'HELP_REQUEST';
  title: string;
  message: string;
  sessionId?: string;
  userId?: string;
  timestamp: Date;
  isRead: boolean;
  actionRequired?: boolean;
  actionUrl?: string;
}

// WebRTC connection info
export interface WebRTCConnection {
  peerId: string;
  userId: string;
  connection: RTCPeerConnection;
  dataChannel?: RTCDataChannel;
  audioTrack?: MediaStreamTrack;
  videoTrack?: MediaStreamTrack;
  screenTrack?: MediaStreamTrack;
  isConnected: boolean;
  connectionQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  latency: number; // in ms
  bandwidth: number; // in kbps
}

// Operational transformation for conflict resolution
export interface Operation {
  type: 'INSERT' | 'DELETE' | 'RETAIN';
  position: number;
  content?: string;
  length?: number;
  userId: string;
  timestamp: Date;
  version: number;
}

// Document state for operational transformation
export interface DocumentState {
  content: string;
  version: number;
  operations: Operation[];
  lastModifiedBy: string;
  lastModifiedAt: Date;
}

// Collaboration statistics
export interface CollaborationStats {
  totalSessions: number;
  totalParticipants: number;
  totalCollaborationTime: number; // in minutes
  averageSessionDuration: number; // in minutes
  mostPopularType: CollaborationType;
  averageParticipantsPerSession: number;
  totalMessages: number;
  totalCodeChanges: number;
  totalFilesShared: number;
  totalRecordings: number;
  averageRating: number;
  userRanking: number;
  achievements: string[];
  weeklyStats: WeeklyStats[];
}

// Weekly collaboration statistics
export interface WeeklyStats {
  week: string; // YYYY-WW format
  sessions: number;
  participants: number;
  collaborationTime: number; // in minutes
  messages: number;
  codeChanges: number;
  rating: number;
}
