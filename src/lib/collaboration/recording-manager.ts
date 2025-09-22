import { 
  CollaborationSession, 
  CollaborationUser, 
  RecordingStatus,
  RecordingInfo,
  CollaborationEvent,
  ChatMessage,
  DocumentState,
  WhiteboardDrawing
} from '@/types/collaboration';

// Recording manager for handling session recordings
export class RecordingManager {
  private recordings: Map<string, RecordingInfo> = new Map();
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private eventListeners: Map<string, Function[]> = new Map();
  private isRecording = false;
  private sessionId: string | null = null;
  private startTime: Date | null = null;

  constructor() {
    this.setupEventListeners();
  }

  // Start recording a session
  async startRecording(
    sessionId: string,
    participants: CollaborationUser[],
    consentRequired: boolean = true
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (this.isRecording) {
        return { success: false, message: 'Already recording a session' };
      }

      // Check if all participants have given consent
      if (consentRequired) {
        const consentGiven = participants.every(p => p.permission === 'OWNER' || p.permission === 'ADMIN');
        if (!consentGiven) {
          return { success: false, message: 'Recording consent required from all participants' };
        }
      }

      // Request screen capture for recording
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000, // 2.5 Mbps
      });

      this.recordedChunks = [];
      this.sessionId = sessionId;
      this.startTime = new Date();
      this.isRecording = true;

      // Set up recording event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.processRecording();
      };

      this.mediaRecorder.onerror = (error) => {
        this.emit('recordingError', { error, sessionId });
      };

      // Start recording
      this.mediaRecorder.start(1000); // Record in 1-second chunks

      // Create recording info
      const recordingInfo: RecordingInfo = {
        status: 'RECORDING',
        startTime: this.startTime,
        consentRequired,
        consentGiven: true,
        participantsConsent: participants.reduce((acc, p) => {
          acc[p.id] = true;
          return acc;
        }, {} as Record<string, boolean>),
      };

      this.recordings.set(sessionId, recordingInfo);

      this.emit('recordingStarted', { sessionId, recordingInfo });
      return { success: true, message: 'Recording started successfully' };
    } catch (error) {
      console.error('Failed to start recording:', error);
      return { success: false, message: 'Failed to start recording' };
    }
  }

  // Stop recording
  stopRecording(): { success: boolean; message: string } {
    try {
      if (!this.isRecording || !this.mediaRecorder) {
        return { success: false, message: 'No active recording to stop' };
      }

      this.mediaRecorder.stop();
      this.isRecording = false;

      // Stop all tracks
      if (this.mediaRecorder.stream) {
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }

      this.emit('recordingStopped', { sessionId: this.sessionId });
      return { success: true, message: 'Recording stopped successfully' };
    } catch (error) {
      console.error('Failed to stop recording:', error);
      return { success: false, message: 'Failed to stop recording' };
    }
  }

  // Pause recording
  pauseRecording(): { success: boolean; message: string } {
    try {
      if (!this.isRecording || !this.mediaRecorder) {
        return { success: false, message: 'No active recording to pause' };
      }

      if (this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.pause();
        this.emit('recordingPaused', { sessionId: this.sessionId });
        return { success: true, message: 'Recording paused successfully' };
      }

      return { success: false, message: 'Recording is not in recording state' };
    } catch (error) {
      console.error('Failed to pause recording:', error);
      return { success: false, message: 'Failed to pause recording' };
    }
  }

  // Resume recording
  resumeRecording(): { success: boolean; message: string } {
    try {
      if (!this.mediaRecorder) {
        return { success: false, message: 'No recording session found' };
      }

      if (this.mediaRecorder.state === 'paused') {
        this.mediaRecorder.resume();
        this.emit('recordingResumed', { sessionId: this.sessionId });
        return { success: true, message: 'Recording resumed successfully' };
      }

      return { success: false, message: 'Recording is not in paused state' };
    } catch (error) {
      console.error('Failed to resume recording:', error);
      return { success: false, message: 'Failed to resume recording' };
    }
  }

  // Process recorded data
  private async processRecording(): Promise<void> {
    try {
      if (!this.sessionId || this.recordedChunks.length === 0) {
        return;
      }

      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      const fileSize = blob.size;
      const duration = this.startTime ? 
        Math.floor((new Date().getTime() - this.startTime.getTime()) / 1000) : 0;

      // Create object URL for the recording
      const url = URL.createObjectURL(blob);
      
      // Generate thumbnail (simplified - in production, you'd use a proper video processing library)
      const thumbnailUrl = await this.generateThumbnail(blob);

      // Update recording info
      const recordingInfo = this.recordings.get(this.sessionId);
      if (recordingInfo) {
        recordingInfo.status = 'READY';
        recordingInfo.endTime = new Date();
        recordingInfo.duration = duration;
        recordingInfo.fileSize = fileSize;
        recordingInfo.url = url;
        recordingInfo.thumbnailUrl = thumbnailUrl;
        
        this.recordings.set(this.sessionId, recordingInfo);
      }

      this.emit('recordingProcessed', { 
        sessionId: this.sessionId, 
        recordingInfo,
        blob,
        url,
        thumbnailUrl 
      });

      // Reset state
      this.sessionId = null;
      this.startTime = null;
      this.recordedChunks = [];
    } catch (error) {
      console.error('Failed to process recording:', error);
      this.emit('recordingError', { error, sessionId: this.sessionId });
    }
  }

  // Generate thumbnail from video blob
  private async generateThumbnail(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onloadedmetadata = () => {
        // Seek to 10% of the video duration
        video.currentTime = video.duration * 0.1;
      };

      video.onseeked = () => {
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);
          
          canvas.toBlob((thumbnailBlob) => {
            if (thumbnailBlob) {
              resolve(URL.createObjectURL(thumbnailBlob));
            } else {
              reject(new Error('Failed to generate thumbnail'));
            }
          }, 'image/jpeg', 0.8);
        }
      };

      video.onerror = () => {
        reject(new Error('Failed to load video for thumbnail generation'));
      };

      video.src = URL.createObjectURL(blob);
    });
  }

  // Get recording info
  getRecording(sessionId: string): RecordingInfo | undefined {
    return this.recordings.get(sessionId);
  }

  // Get all recordings
  getAllRecordings(): Map<string, RecordingInfo> {
    return new Map(this.recordings);
  }

  // Delete recording
  deleteRecording(sessionId: string): { success: boolean; message: string } {
    try {
      const recording = this.recordings.get(sessionId);
      if (recording) {
        // Clean up URLs
        if (recording.url) {
          URL.revokeObjectURL(recording.url);
        }
        if (recording.thumbnailUrl) {
          URL.revokeObjectURL(recording.thumbnailUrl);
        }
        
        this.recordings.delete(sessionId);
        this.emit('recordingDeleted', { sessionId });
        return { success: true, message: 'Recording deleted successfully' };
      }

      return { success: false, message: 'Recording not found' };
    } catch (error) {
      console.error('Failed to delete recording:', error);
      return { success: false, message: 'Failed to delete recording' };
    }
  }

  // Download recording
  downloadRecording(sessionId: string, filename?: string): { success: boolean; message: string } {
    try {
      const recording = this.recordings.get(sessionId);
      if (!recording || !recording.url) {
        return { success: false, message: 'Recording not found or not ready' };
      }

      const link = document.createElement('a');
      link.href = recording.url;
      link.download = filename || `recording_${sessionId}_${new Date().toISOString().split('T')[0]}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.emit('recordingDownloaded', { sessionId, filename });
      return { success: true, message: 'Recording download started' };
    } catch (error) {
      console.error('Failed to download recording:', error);
      return { success: false, message: 'Failed to download recording' };
    }
  }

  // Record session events for playback
  recordEvent(event: CollaborationEvent): void {
    if (!this.sessionId) return;

    // Store event for playback reconstruction
    this.emit('eventRecorded', { sessionId: this.sessionId, event });
  }

  // Record chat messages
  recordChatMessage(message: ChatMessage): void {
    if (!this.sessionId) return;

    this.emit('chatMessageRecorded', { sessionId: this.sessionId, message });
  }

  // Record document changes
  recordDocumentChange(documentState: DocumentState): void {
    if (!this.sessionId) return;

    this.emit('documentChangeRecorded', { sessionId: this.sessionId, documentState });
  }

  // Record whiteboard drawings
  recordWhiteboardDrawing(drawing: WhiteboardDrawing): void {
    if (!this.sessionId) return;

    this.emit('whiteboardDrawingRecorded', { sessionId: this.sessionId, drawing });
  }

  // Get recording status
  getRecordingStatus(): { isRecording: boolean; sessionId: string | null; status: RecordingStatus } {
    return {
      isRecording: this.isRecording,
      sessionId: this.sessionId,
      status: this.sessionId ? 
        (this.recordings.get(this.sessionId)?.status || 'NOT_RECORDING') : 
        'NOT_RECORDING'
    };
  }

  // Check if recording is supported
  isRecordingSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
  }

  // Get recording capabilities
  getRecordingCapabilities(): {
    supported: boolean;
    formats: string[];
    maxDuration: number;
    maxFileSize: number;
  } {
    return {
      supported: this.isRecordingSupported(),
      formats: ['webm', 'mp4'],
      maxDuration: 3600, // 1 hour
      maxFileSize: 100 * 1024 * 1024, // 100 MB
    };
  }

  // Private methods
  private setupEventListeners(): void {
    // Handle page unload
    window.addEventListener('beforeunload', () => {
      if (this.isRecording) {
        this.stopRecording();
      }
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.isRecording) {
        // Pause recording when tab is hidden
        this.pauseRecording();
      } else if (!document.hidden && this.isRecording) {
        // Resume recording when tab is visible
        this.resumeRecording();
      }
    });
  }

  // Event system
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }
}

// Export singleton instance
export const recordingManager = new RecordingManager();
