/**
 * WebSocket Service for Real-time Messaging
 * Handles socket.io connection and message events
 */

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

interface MessageData {
  id: number;
  case_id: number;
  content: string;
  sender_id: number;
  sender_name: string;
  created_at: string;
}

interface CaseUpdateData {
  case_id: number;
  status: string;
}

interface NotificationData {
  type: string;
  message: string;
  data?: any;
}

class WebSocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private connected: boolean = false;

  /**
   * Initialize socket connection with authentication token
   */
  connect(token: string) {
    if (this.connected && this.socket) {
      console.log('[WebSocket] Already connected');
      return;
    }

    this.token = token;
    
    console.log('[WebSocket] Connecting to:', SOCKET_URL);
    
    this.socket = io(SOCKET_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    this.setupEventListeners();
  }

  /**
   * Setup socket event listeners
   */
  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('[WebSocket] Connected with ID:', this.socket?.id);
      this.connected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[WebSocket] Disconnected:', reason);
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('[WebSocket] Connection error:', error);
      this.connected = false;
    });

    this.socket.on('status', (data) => {
      console.log('[WebSocket] Status:', data);
    });

    this.socket.on('error', (data) => {
      console.error('[WebSocket] Error:', data);
    });
  }

  /**
   * Join a case room to receive real-time updates
   */
  joinCaseRoom(caseId: number) {
    if (!this.socket || !this.token || !this.connected) {
      console.warn('[WebSocket] Cannot join room: Not connected');
      return;
    }

    console.log('[WebSocket] Joining case room:', caseId);
    this.socket.emit('join_case', {
      token: this.token,
      case_id: caseId
    });
  }

  /**
   * Leave a case room
   */
  leaveCaseRoom(caseId: number) {
    if (!this.socket || !this.connected) {
      return;
    }

    console.log('[WebSocket] Leaving case room:', caseId);
    this.socket.emit('leave_case', {
      case_id: caseId
    });
  }

  /**
   * Send a message via WebSocket
   */
  sendMessage(caseId: number, content: string) {
    if (!this.socket || !this.token || !this.connected) {
      console.warn('[WebSocket] Cannot send message: Not connected');
      return false;
    }

    console.log('[WebSocket] Sending message to case:', caseId);
    this.socket.emit('send_message', {
      token: this.token,
      case_id: caseId,
      content: content
    });

    return true;
  }

  /**
   * Listen for new messages
   */
  onNewMessage(callback: (data: MessageData) => void) {
    if (!this.socket) return;

    this.socket.on('new_message', (data: MessageData) => {
      console.log('[WebSocket] New message received:', data);
      callback(data);
    });
  }

  /**
   * Listen for case updates
   */
  onCaseUpdate(callback: (data: CaseUpdateData) => void) {
    if (!this.socket) return;

    this.socket.on('case_update', (data: CaseUpdateData) => {
      console.log('[WebSocket] Case update received:', data);
      callback(data);
    });
  }

  /**
   * Listen for notifications
   */
  onNotification(callback: (data: NotificationData) => void) {
    if (!this.socket) return;

    this.socket.on('notification', (data: NotificationData) => {
      console.log('[WebSocket] Notification received:', data);
      callback(data);
    });
  }

  /**
   * Remove message listener
   */
  offNewMessage() {
    if (!this.socket) return;
    this.socket.off('new_message');
  }

  /**
   * Remove case update listener
   */
  offCaseUpdate() {
    if (!this.socket) return;
    this.socket.off('case_update');
  }

  /**
   * Remove notification listener
   */
  offNotification() {
    if (!this.socket) return;
    this.socket.off('notification');
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (this.socket) {
      console.log('[WebSocket] Disconnecting');
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.token = null;
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected && this.socket !== null;
  }

  /**
   * Get socket instance (for advanced usage)
   */
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Export singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
