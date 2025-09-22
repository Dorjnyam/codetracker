import { 
  CollaborationUser, 
  VoiceVideoCall, 
  WebRTCConnection,
  ConnectionStatus 
} from '@/types/collaboration';

// WebRTC configuration
const RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
  iceCandidatePoolSize: 10,
};

// WebRTC manager for handling peer-to-peer connections
export class WebRTCManager {
  private connections: Map<string, WebRTCConnection> = new Map();
  private localStream: MediaStream | null = null;
  private currentUser: CollaborationUser | null = null;
  private sessionId: string | null = null;
  private isInitialized = false;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.setupEventListeners();
  }

  // Initialize WebRTC manager
  async initialize(user: CollaborationUser, sessionId: string): Promise<{ success: boolean; message: string }> {
    try {
      this.currentUser = user;
      this.sessionId = sessionId;
      this.isInitialized = true;

      this.emit('initialized', { user, sessionId });
      return { success: true, message: 'WebRTC manager initialized successfully' };
    } catch (error) {
      console.error('Failed to initialize WebRTC manager:', error);
      return { success: false, message: 'Failed to initialize WebRTC manager' };
    }
  }

  // Start local media stream
  async startLocalStream(
    audio: boolean = true,
    video: boolean = true,
    screen: boolean = false
  ): Promise<{ success: boolean; message: string; stream?: MediaStream }> {
    try {
      const constraints: MediaStreamConstraints = {
        audio: audio ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } : false,
        video: video ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        } : false,
      };

      if (screen) {
        this.localStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
      } else {
        this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      }

      this.emit('localStreamStarted', { stream: this.localStream, audio, video, screen });
      return { success: true, message: 'Local stream started successfully', stream: this.localStream };
    } catch (error) {
      console.error('Failed to start local stream:', error);
      return { success: false, message: 'Failed to start local stream' };
    }
  }

  // Stop local media stream
  stopLocalStream(): { success: boolean; message: string } {
    try {
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }

      this.emit('localStreamStopped');
      return { success: true, message: 'Local stream stopped successfully' };
    } catch (error) {
      console.error('Failed to stop local stream:', error);
      return { success: false, message: 'Failed to stop local stream' };
    }
  }

  // Create peer connection
  async createPeerConnection(userId: string): Promise<{ success: boolean; message: string; connection?: WebRTCConnection }> {
    try {
      const connection = new RTCPeerConnection(RTC_CONFIG);
      const dataChannel = connection.createDataChannel('collaboration', {
        ordered: true,
      });

      const webRTCConnection: WebRTCConnection = {
        peerId: userId,
        userId,
        connection,
        dataChannel,
        isConnected: false,
        connectionQuality: 'FAIR',
        latency: 0,
        bandwidth: 0,
      };

      // Set up connection event handlers
      this.setupConnectionHandlers(webRTCConnection);

      this.connections.set(userId, webRTCConnection);
      this.emit('peerConnectionCreated', { userId, connection: webRTCConnection });

      return { success: true, message: 'Peer connection created successfully', connection: webRTCConnection };
    } catch (error) {
      console.error('Failed to create peer connection:', error);
      return { success: false, message: 'Failed to create peer connection' };
    }
  }

  // Establish connection with peer
  async connectToPeer(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const connection = this.connections.get(userId);
      if (!connection) {
        return { success: false, message: 'Connection not found' };
      }

      // Add local stream tracks
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          connection.connection.addTrack(track, this.localStream!);
        });
      }

      // Create offer
      const offer = await connection.connection.createOffer();
      await connection.connection.setLocalDescription(offer);

      // Send offer to peer (this would typically go through a signaling server)
      this.emit('offerCreated', { userId, offer });

      return { success: true, message: 'Connection offer created successfully' };
    } catch (error) {
      console.error('Failed to connect to peer:', error);
      return { success: false, message: 'Failed to connect to peer' };
    }
  }

  // Handle incoming offer
  async handleOffer(userId: string, offer: RTCSessionDescriptionInit): Promise<{ success: boolean; message: string }> {
    try {
      let connection = this.connections.get(userId);
      
      if (!connection) {
        const result = await this.createPeerConnection(userId);
        if (!result.success || !result.connection) {
          return { success: false, message: 'Failed to create connection for offer' };
        }
        connection = result.connection;
      }

      await connection.connection.setRemoteDescription(offer);

      // Add local stream tracks
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          connection.connection.addTrack(track, this.localStream!);
        });
      }

      // Create answer
      const answer = await connection.connection.createAnswer();
      await connection.connection.setLocalDescription(answer);

      // Send answer to peer
      this.emit('answerCreated', { userId, answer });

      return { success: true, message: 'Offer handled successfully' };
    } catch (error) {
      console.error('Failed to handle offer:', error);
      return { success: false, message: 'Failed to handle offer' };
    }
  }

  // Handle incoming answer
  async handleAnswer(userId: string, answer: RTCSessionDescriptionInit): Promise<{ success: boolean; message: string }> {
    try {
      const connection = this.connections.get(userId);
      if (!connection) {
        return { success: false, message: 'Connection not found' };
      }

      await connection.connection.setRemoteDescription(answer);
      return { success: true, message: 'Answer handled successfully' };
    } catch (error) {
      console.error('Failed to handle answer:', error);
      return { success: false, message: 'Failed to handle answer' };
    }
  }

  // Handle incoming ICE candidate
  async handleIceCandidate(userId: string, candidate: RTCIceCandidateInit): Promise<{ success: boolean; message: string }> {
    try {
      const connection = this.connections.get(userId);
      if (!connection) {
        return { success: false, message: 'Connection not found' };
      }

      await connection.connection.addIceCandidate(candidate);
      return { success: true, message: 'ICE candidate handled successfully' };
    } catch (error) {
      console.error('Failed to handle ICE candidate:', error);
      return { success: false, message: 'Failed to handle ICE candidate' };
    }
  }

  // Send data through data channel
  sendData(userId: string, data: any): { success: boolean; message: string } {
    try {
      const connection = this.connections.get(userId);
      if (!connection || !connection.dataChannel) {
        return { success: false, message: 'Connection or data channel not found' };
      }

      if (connection.dataChannel.readyState === 'open') {
        connection.dataChannel.send(JSON.stringify(data));
        return { success: true, message: 'Data sent successfully' };
      } else {
        return { success: false, message: 'Data channel is not open' };
      }
    } catch (error) {
      console.error('Failed to send data:', error);
      return { success: false, message: 'Failed to send data' };
    }
  }

  // Mute/unmute audio
  toggleAudio(muted: boolean): { success: boolean; message: string } {
    try {
      if (this.localStream) {
        const audioTrack = this.localStream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = !muted;
        }
      }

      this.emit('audioToggled', { muted });
      return { success: true, message: `Audio ${muted ? 'muted' : 'unmuted'} successfully` };
    } catch (error) {
      console.error('Failed to toggle audio:', error);
      return { success: false, message: 'Failed to toggle audio' };
    }
  }

  // Enable/disable video
  toggleVideo(enabled: boolean): { success: boolean; message: string } {
    try {
      if (this.localStream) {
        const videoTrack = this.localStream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = enabled;
        }
      }

      this.emit('videoToggled', { enabled });
      return { success: true, message: `Video ${enabled ? 'enabled' : 'disabled'} successfully` };
    } catch (error) {
      console.error('Failed to toggle video:', error);
      return { success: false, message: 'Failed to toggle video' };
    }
  }

  // Start screen sharing
  async startScreenShare(): Promise<{ success: boolean; message: string; stream?: MediaStream }> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // Replace video track in all connections
      const videoTrack = screenStream.getVideoTracks()[0];
      this.connections.forEach(connection => {
        const sender = connection.connection.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });

      this.emit('screenShareStarted', { stream: screenStream });
      return { success: true, message: 'Screen sharing started successfully', stream: screenStream };
    } catch (error) {
      console.error('Failed to start screen sharing:', error);
      return { success: false, message: 'Failed to start screen sharing' };
    }
  }

  // Stop screen sharing
  stopScreenShare(): { success: boolean; message: string } {
    try {
      // Stop screen share track
      if (this.localStream) {
        const screenTrack = this.localStream.getVideoTracks().find(track => 
          track.label.includes('screen') || track.label.includes('display')
        );
        if (screenTrack) {
          screenTrack.stop();
        }
      }

      this.emit('screenShareStopped');
      return { success: true, message: 'Screen sharing stopped successfully' };
    } catch (error) {
      console.error('Failed to stop screen sharing:', error);
      return { success: false, message: 'Failed to stop screen sharing' };
    }
  }

  // Get connection quality
  getConnectionQuality(userId: string): { quality: string; latency: number; bandwidth: number } {
    const connection = this.connections.get(userId);
    if (!connection) {
      return { quality: 'POOR', latency: 0, bandwidth: 0 };
    }

    return {
      quality: connection.connectionQuality,
      latency: connection.latency,
      bandwidth: connection.bandwidth,
    };
  }

  // Disconnect from peer
  disconnectFromPeer(userId: string): { success: boolean; message: string } {
    try {
      const connection = this.connections.get(userId);
      if (connection) {
        connection.connection.close();
        this.connections.delete(userId);
      }

      this.emit('peerDisconnected', { userId });
      return { success: true, message: 'Disconnected from peer successfully' };
    } catch (error) {
      console.error('Failed to disconnect from peer:', error);
      return { success: false, message: 'Failed to disconnect from peer' };
    }
  }

  // Disconnect from all peers
  disconnectAll(): { success: boolean; message: string } {
    try {
      this.connections.forEach((connection, userId) => {
        connection.connection.close();
      });
      this.connections.clear();

      this.stopLocalStream();
      this.emit('allDisconnected');
      return { success: true, message: 'Disconnected from all peers successfully' };
    } catch (error) {
      console.error('Failed to disconnect from all peers:', error);
      return { success: false, message: 'Failed to disconnect from all peers' };
    }
  }

  // Get active connections
  getActiveConnections(): WebRTCConnection[] {
    return Array.from(this.connections.values()).filter(conn => conn.isConnected);
  }

  // Get connection statistics
  async getConnectionStats(userId: string): Promise<any> {
    try {
      const connection = this.connections.get(userId);
      if (!connection) {
        return null;
      }

      const stats = await connection.connection.getStats();
      const statsData: any = {};

      stats.forEach((report) => {
        if (report.type === 'inbound-rtp' || report.type === 'outbound-rtp') {
          statsData[report.type] = {
            bytesReceived: report.bytesReceived,
            bytesSent: report.bytesSent,
            packetsReceived: report.packetsReceived,
            packetsSent: report.packetsSent,
            packetsLost: report.packetsLost,
            jitter: report.jitter,
            roundTripTime: report.roundTripTime,
          };
        }
      });

      return statsData;
    } catch (error) {
      console.error('Failed to get connection stats:', error);
      return null;
    }
  }

  // Private methods
  private setupConnectionHandlers(connection: WebRTCConnection): void {
    const { connection: peerConnection, dataChannel, userId } = connection;

    // Connection state change
    peerConnection.onconnectionstatechange = () => {
      connection.isConnected = peerConnection.connectionState === 'connected';
      this.emit('connectionStateChanged', { userId, state: peerConnection.connectionState });
    };

    // ICE connection state change
    peerConnection.oniceconnectionstatechange = () => {
      this.updateConnectionQuality(connection);
      this.emit('iceConnectionStateChanged', { userId, state: peerConnection.iceConnectionState });
    };

    // ICE gathering state change
    peerConnection.onicegatheringstatechange = () => {
      this.emit('iceGatheringStateChanged', { userId, state: peerConnection.iceGatheringState });
    };

    // ICE candidate
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.emit('iceCandidate', { userId, candidate: event.candidate });
      }
    };

    // Track received
    peerConnection.ontrack = (event) => {
      this.emit('trackReceived', { userId, track: event.track, stream: event.streams[0] });
    };

    // Data channel
    if (dataChannel) {
      dataChannel.onopen = () => {
        this.emit('dataChannelOpen', { userId });
      };

      dataChannel.onclose = () => {
        this.emit('dataChannelClose', { userId });
      };

      dataChannel.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit('dataReceived', { userId, data });
        } catch (error) {
          console.error('Failed to parse data channel message:', error);
        }
      };

      dataChannel.onerror = (error) => {
        this.emit('dataChannelError', { userId, error });
      };
    }
  }

  private updateConnectionQuality(connection: WebRTCConnection): void {
    const state = connection.connection.iceConnectionState;
    
    switch (state) {
      case 'connected':
        connection.connectionQuality = 'EXCELLENT';
        connection.latency = 50;
        connection.bandwidth = 1000;
        break;
      case 'completed':
        connection.connectionQuality = 'GOOD';
        connection.latency = 100;
        connection.bandwidth = 500;
        break;
      case 'checking':
        connection.connectionQuality = 'FAIR';
        connection.latency = 200;
        connection.bandwidth = 250;
        break;
      case 'disconnected':
      case 'failed':
      case 'closed':
        connection.connectionQuality = 'POOR';
        connection.latency = 0;
        connection.bandwidth = 0;
        break;
    }
  }

  private setupEventListeners(): void {
    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.disconnectAll();
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Pause connections when tab is hidden
        this.connections.forEach(connection => {
          if (connection.audioTrack) {
            connection.audioTrack.enabled = false;
          }
        });
      } else {
        // Resume connections when tab is visible
        this.connections.forEach(connection => {
          if (connection.audioTrack) {
            connection.audioTrack.enabled = true;
          }
        });
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
export const webrtcManager = new WebRTCManager();
