import { 
  CollaborationSession, 
  CollaborationUser, 
  SessionSettings, 
  SessionInvitation,
  CollaborationType,
  SessionStatus,
  PermissionLevel,
  SessionTemplate,
  CollaborationEvent
} from '@/types/collaboration';

// Session manager for handling collaboration sessions
export class SessionManager {
  private sessions: Map<string, CollaborationSession> = new Map();
  private invitations: Map<string, SessionInvitation> = new Map();
  private templates: Map<string, SessionTemplate> = new Map();
  private events: Map<string, CollaborationEvent[]> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
  }

  // Create a new collaboration session
  createSession(
    ownerId: string,
    owner: CollaborationUser,
    title: string,
    type: CollaborationType,
    settings?: Partial<SessionSettings>,
    description?: string
  ): CollaborationSession {
    const sessionId = this.generateSessionId();
    const inviteCode = this.generateInviteCode();
    
    const session: CollaborationSession = {
      id: sessionId,
      title,
      description,
      type,
      status: 'CREATED',
      ownerId,
      owner,
      participants: [owner],
      maxParticipants: this.getMaxParticipantsForType(type),
      createdAt: new Date(),
      settings: {
        allowGuestJoin: false,
        requireApproval: false,
        enableRecording: true,
        enableChat: true,
        enableVoiceChat: true,
        enableVideoChat: true,
        enableScreenShare: true,
        enableWhiteboard: true,
        enableFileShare: true,
        autoSave: true,
        saveInterval: 30,
        maxFileSize: 10,
        allowedFileTypes: ['.js', '.ts', '.py', '.java', '.cpp', '.c', '.cs', '.php', '.rb', '.go'],
        moderationEnabled: true,
        profanityFilter: true,
        autoEndAfterInactivity: 60,
        breakOutRoomsEnabled: false,
        maxBreakOutRooms: 5,
        ...settings,
      },
      recording: {
        status: 'NOT_RECORDING',
        consentRequired: true,
        consentGiven: false,
        participantsConsent: {},
      },
      analytics: {
        totalParticipants: 1,
        averageParticipationTime: 0,
        totalMessages: 0,
        totalCodeChanges: 0,
        totalLinesAdded: 0,
        totalLinesDeleted: 0,
        participationHeatmap: { [ownerId]: 0 },
        chatActivity: { [ownerId]: 0 },
        codeActivity: { [ownerId]: 0 },
        sessionQuality: 'EXCELLENT',
        technicalIssues: 0,
        connectionDrops: 0,
        averageLatency: 0,
      },
      inviteCode,
      inviteLink: `${window.location.origin}/collaborate/join/${inviteCode}`,
      isPublic: false,
      tags: [],
      language: 'javascript',
      difficulty: 'INTERMEDIATE',
    };

    this.sessions.set(sessionId, session);
    this.events.set(sessionId, []);
    
    this.logEvent(sessionId, 'SESSION_CREATED', ownerId, {
      sessionType: type,
      title,
      settings: session.settings,
    });

    return session;
  }

  // Join a session
  joinSession(
    sessionId: string,
    user: CollaborationUser,
    inviteCode?: string
  ): { success: boolean; message: string; session?: CollaborationSession } {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return { success: false, message: 'Session not found' };
    }

    if (session.status === 'ENDED' || session.status === 'ARCHIVED') {
      return { success: false, message: 'Session has ended' };
    }

    if (session.participants.length >= session.maxParticipants) {
      return { success: false, message: 'Session is full' };
    }

    if (session.inviteCode !== inviteCode && !session.isPublic) {
      return { success: false, message: 'Invalid invite code' };
    }

    if (session.settings.requireApproval && user.id !== session.ownerId) {
      return { success: false, message: 'Session requires approval from owner' };
    }

    // Check if user is already in session
    const existingParticipant = session.participants.find(p => p.id === user.id);
    if (existingParticipant) {
      return { success: false, message: 'You are already in this session' };
    }

    // Add user to session
    session.participants.push(user);
    session.analytics.totalParticipants = session.participants.length;
    session.analytics.participationHeatmap[user.id] = 0;
    session.analytics.chatActivity[user.id] = 0;
    session.analytics.codeActivity[user.id] = 0;

    // Update session status if it's the first participant joining
    if (session.status === 'CREATED' && session.participants.length > 1) {
      session.status = 'WAITING';
    }

    this.logEvent(sessionId, 'USER_JOINED', user.id, {
      userName: user.name,
      userRole: user.role,
      participantCount: session.participants.length,
    });

    return { success: true, message: 'Successfully joined session', session };
  }

  // Leave a session
  leaveSession(sessionId: string, userId: string): { success: boolean; message: string } {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return { success: false, message: 'Session not found' };
    }

    const participantIndex = session.participants.findIndex(p => p.id === userId);
    if (participantIndex === -1) {
      return { success: false, message: 'You are not in this session' };
    }

    const participant = session.participants[participantIndex];
    session.participants.splice(participantIndex, 1);
    session.analytics.totalParticipants = session.participants.length;

    // Clean up analytics data
    delete session.analytics.participationHeatmap[userId];
    delete session.analytics.chatActivity[userId];
    delete session.analytics.codeActivity[userId];

    this.logEvent(sessionId, 'USER_LEFT', userId, {
      userName: participant.name,
      participantCount: session.participants.length,
    });

    // End session if owner leaves and no other participants
    if (userId === session.ownerId && session.participants.length === 0) {
      this.endSession(sessionId, userId);
    }

    return { success: true, message: 'Successfully left session' };
  }

  // Start a session
  startSession(sessionId: string, userId: string): { success: boolean; message: string } {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return { success: false, message: 'Session not found' };
    }

    if (userId !== session.ownerId) {
      return { success: false, message: 'Only the session owner can start the session' };
    }

    if (session.status !== 'CREATED' && session.status !== 'WAITING') {
      return { success: false, message: 'Session cannot be started in current state' };
    }

    session.status = 'ACTIVE';
    session.startedAt = new Date();

    this.logEvent(sessionId, 'SESSION_STARTED', userId, {
      participantCount: session.participants.length,
      sessionType: session.type,
    });

    return { success: true, message: 'Session started successfully' };
  }

  // End a session
  endSession(sessionId: string, userId: string): { success: boolean; message: string } {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return { success: false, message: 'Session not found' };
    }

    if (userId !== session.ownerId && !session.participants.find(p => p.id === userId && p.permission === 'ADMIN')) {
      return { success: false, message: 'Only the session owner or admin can end the session' };
    }

    session.status = 'ENDED';
    session.endedAt = new Date();
    session.duration = session.startedAt ? 
      Math.floor((session.endedAt.getTime() - session.startedAt.getTime()) / (1000 * 60)) : 0;

    // Calculate final analytics
    session.analytics.averageParticipationTime = session.duration / session.analytics.totalParticipants;

    this.logEvent(sessionId, 'SESSION_ENDED', userId, {
      duration: session.duration,
      participantCount: session.participants.length,
      totalMessages: session.analytics.totalMessages,
      totalCodeChanges: session.analytics.totalCodeChanges,
    });

    return { success: true, message: 'Session ended successfully' };
  }

  // Update session settings
  updateSessionSettings(
    sessionId: string,
    userId: string,
    settings: Partial<SessionSettings>
  ): { success: boolean; message: string } {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return { success: false, message: 'Session not found' };
    }

    if (userId !== session.ownerId && !session.participants.find(p => p.id === userId && p.permission === 'ADMIN')) {
      return { success: false, message: 'Only the session owner or admin can update settings' };
    }

    session.settings = { ...session.settings, ...settings };

    this.logEvent(sessionId, 'SETTINGS_UPDATED', userId, {
      updatedSettings: Object.keys(settings),
    });

    return { success: true, message: 'Session settings updated successfully' };
  }

  // Change user permission
  changeUserPermission(
    sessionId: string,
    userId: string,
    targetUserId: string,
    newPermission: PermissionLevel
  ): { success: boolean; message: string } {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return { success: false, message: 'Session not found' };
    }

    const user = session.participants.find(p => p.id === userId);
    const targetUser = session.participants.find(p => p.id === targetUserId);

    if (!user || !targetUser) {
      return { success: false, message: 'User not found in session' };
    }

    if (userId !== session.ownerId && user.permission !== 'ADMIN') {
      return { success: false, message: 'Only the session owner or admin can change permissions' };
    }

    if (targetUserId === session.ownerId) {
      return { success: false, message: 'Cannot change owner permission' };
    }

    const oldPermission = targetUser.permission;
    targetUser.permission = newPermission;

    this.logEvent(sessionId, 'PERMISSION_CHANGED', userId, {
      targetUserId,
      targetUserName: targetUser.name,
      oldPermission,
      newPermission,
    });

    return { success: true, message: 'User permission updated successfully' };
  }

  // Create session invitation
  createInvitation(
    sessionId: string,
    invitedBy: string,
    invitedUser: string,
    permission: PermissionLevel = 'EDIT',
    expiresInHours: number = 24
  ): { success: boolean; message: string; invitation?: SessionInvitation } {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return { success: false, message: 'Session not found' };
    }

    const inviter = session.participants.find(p => p.id === invitedBy);
    if (!inviter || (inviter.permission !== 'ADMIN' && inviter.id !== session.ownerId)) {
      return { success: false, message: 'You do not have permission to invite users' };
    }

    const invitation: SessionInvitation = {
      id: this.generateInvitationId(),
      sessionId,
      invitedBy,
      invitedUser,
      permission,
      expiresAt: new Date(Date.now() + expiresInHours * 60 * 60 * 1000),
      createdAt: new Date(),
    };

    this.invitations.set(invitation.id, invitation);

    this.logEvent(sessionId, 'INVITATION_CREATED', invitedBy, {
      invitedUser,
      permission,
      expiresAt: invitation.expiresAt,
    });

    return { success: true, message: 'Invitation created successfully', invitation };
  }

  // Accept invitation
  acceptInvitation(invitationId: string, userId: string): { success: boolean; message: string } {
    const invitation = this.invitations.get(invitationId);
    
    if (!invitation) {
      return { success: false, message: 'Invitation not found' };
    }

    if (invitation.invitedUser !== userId) {
      return { success: false, message: 'This invitation is not for you' };
    }

    if (invitation.expiresAt < new Date()) {
      return { success: false, message: 'Invitation has expired' };
    }

    if (invitation.acceptedAt || invitation.declinedAt) {
      return { success: false, message: 'Invitation has already been responded to' };
    }

    invitation.acceptedAt = new Date();

    this.logEvent(invitation.sessionId, 'INVITATION_ACCEPTED', userId, {
      invitationId,
      permission: invitation.permission,
    });

    return { success: true, message: 'Invitation accepted successfully' };
  }

  // Get session by ID
  getSession(sessionId: string): CollaborationSession | undefined {
    return this.sessions.get(sessionId);
  }

  // Get sessions by user
  getUserSessions(userId: string): CollaborationSession[] {
    return Array.from(this.sessions.values()).filter(session =>
      session.participants.some(p => p.id === userId)
    );
  }

  // Get public sessions
  getPublicSessions(): CollaborationSession[] {
    return Array.from(this.sessions.values()).filter(session =>
      session.isPublic && session.status === 'ACTIVE'
    );
  }

  // Get session events
  getSessionEvents(sessionId: string): CollaborationEvent[] {
    return this.events.get(sessionId) || [];
  }

  // Create session from template
  createSessionFromTemplate(
    templateId: string,
    ownerId: string,
    owner: CollaborationUser,
    title: string,
    customizations?: Partial<SessionSettings>
  ): { success: boolean; message: string; session?: CollaborationSession } {
    const template = this.templates.get(templateId);
    
    if (!template) {
      return { success: false, message: 'Template not found' };
    }

    const session = this.createSession(
      ownerId,
      owner,
      title,
      template.type,
      { ...template.settings, ...customizations },
      template.description
    );

    session.language = template.defaultLanguage;
    session.framework = template.defaultFramework;
    session.difficulty = template.difficulty;
    session.tags = [...template.tags];

    // Update template usage count
    template.usageCount++;

    return { success: true, message: 'Session created from template successfully', session };
  }

  // Get session templates
  getTemplates(): SessionTemplate[] {
    return Array.from(this.templates.values());
  }

  // Get templates by type
  getTemplatesByType(type: CollaborationType): SessionTemplate[] {
    return Array.from(this.templates.values()).filter(template => template.type === type);
  }

  // Rate session template
  rateTemplate(
    templateId: string,
    userId: string,
    rating: number,
    comment?: string
  ): { success: boolean; message: string } {
    const template = this.templates.get(templateId);
    
    if (!template) {
      return { success: false, message: 'Template not found' };
    }

    if (rating < 1 || rating > 5) {
      return { success: false, message: 'Rating must be between 1 and 5' };
    }

    const review = {
      id: this.generateReviewId(),
      templateId,
      userId,
      rating,
      comment,
      createdAt: new Date(),
    };

    template.reviews.push(review);
    template.rating = template.reviews.reduce((sum, r) => sum + r.rating, 0) / template.reviews.length;

    return { success: true, message: 'Template rated successfully' };
  }

  // Private helper methods
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateInviteCode(): string {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  private generateInvitationId(): string {
    return `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateReviewId(): string {
    return `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getMaxParticipantsForType(type: CollaborationType): number {
    switch (type) {
      case 'PAIR_PROGRAMMING':
        return 2;
      case 'GROUP_PROJECT':
        return 8;
      case 'CODE_REVIEW':
        return 6;
      case 'LIVE_DEMO':
        return 50;
      case 'DEBUGGING_SESSION':
        return 4;
      case 'INTERVIEW_PRACTICE':
        return 3;
      case 'HACKATHON_TEAM':
        return 10;
      case 'STUDY_GROUP':
        return 12;
      default:
        return 8;
    }
  }

  private logEvent(
    sessionId: string,
    type: CollaborationEvent['type'],
    userId: string,
    data: Record<string, any>
  ): void {
    const event: CollaborationEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      type,
      userId,
      timestamp: new Date(),
      data,
    };

    const events = this.events.get(sessionId) || [];
    events.push(event);
    this.events.set(sessionId, events);
  }

  private initializeDefaultTemplates(): void {
    // Pair Programming Template
    const pairProgrammingTemplate: SessionTemplate = {
      id: 'pair-programming-default',
      name: 'Pair Programming Session',
      description: 'A collaborative coding session for two developers to work together',
      type: 'PAIR_PROGRAMMING',
      settings: {
        allowGuestJoin: false,
        requireApproval: false,
        enableRecording: true,
        enableChat: true,
        enableVoiceChat: true,
        enableVideoChat: true,
        enableScreenShare: true,
        enableWhiteboard: true,
        enableFileShare: true,
        autoSave: true,
        saveInterval: 30,
        maxFileSize: 10,
        allowedFileTypes: ['.js', '.ts', '.py', '.java', '.cpp'],
        moderationEnabled: false,
        profanityFilter: false,
        autoEndAfterInactivity: 120,
        breakOutRoomsEnabled: false,
        maxBreakOutRooms: 0,
      },
      defaultLanguage: 'javascript',
      difficulty: 'INTERMEDIATE',
      estimatedDuration: 60,
      tags: ['pair-programming', 'collaboration', 'coding'],
      createdBy: 'system',
      createdAt: new Date(),
      isPublic: true,
      usageCount: 0,
      rating: 0,
      reviews: [],
    };

    // Group Project Template
    const groupProjectTemplate: SessionTemplate = {
      id: 'group-project-default',
      name: 'Group Project Session',
      description: 'A collaborative session for team-based coding projects',
      type: 'GROUP_PROJECT',
      settings: {
        allowGuestJoin: false,
        requireApproval: true,
        enableRecording: true,
        enableChat: true,
        enableVoiceChat: true,
        enableVideoChat: true,
        enableScreenShare: true,
        enableWhiteboard: true,
        enableFileShare: true,
        autoSave: true,
        saveInterval: 15,
        maxFileSize: 25,
        allowedFileTypes: ['.js', '.ts', '.py', '.java', '.cpp', '.html', '.css', '.json'],
        moderationEnabled: true,
        profanityFilter: true,
        autoEndAfterInactivity: 180,
        breakOutRoomsEnabled: true,
        maxBreakOutRooms: 3,
      },
      defaultLanguage: 'javascript',
      defaultFramework: 'react',
      difficulty: 'ADVANCED',
      estimatedDuration: 180,
      tags: ['group-project', 'teamwork', 'collaboration'],
      createdBy: 'system',
      createdAt: new Date(),
      isPublic: true,
      usageCount: 0,
      rating: 0,
      reviews: [],
    };

    this.templates.set(pairProgrammingTemplate.id, pairProgrammingTemplate);
    this.templates.set(groupProjectTemplate.id, groupProjectTemplate);
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();
