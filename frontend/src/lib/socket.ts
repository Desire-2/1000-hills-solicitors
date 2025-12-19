import { io, Socket } from 'socket.io-client';
import apiService from './api';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

class SocketService {
  private socket: Socket | null = null;
  private connected: boolean = false;

  /**
   * Connect to the WebSocket server
   */
  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = apiService.getToken();
    
    this.socket = io(SOCKET_URL, {
      auth: {
        token: token || '',
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.connected = false;
    });

    this.socket.on('status', (data: any) => {
      console.log('Status:', data);
    });

    this.socket.on('error', (data: any) => {
      console.error('Socket error:', data);
    });

    return this.socket;
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Join a case room
   */
  joinCase(caseId: number) {
    if (!this.socket) {
      this.connect();
    }

    const token = apiService.getToken();
    this.socket?.emit('join_case', {
      token,
      case_id: caseId,
    });
  }

  /**
   * Leave a case room
   */
  leaveCase(caseId: number) {
    this.socket?.emit('leave_case', {
      case_id: caseId,
    });
  }

  /**
   * Send a message in a case
   */
  sendMessage(caseId: number, content: string) {
    const token = apiService.getToken();
    this.socket?.emit('send_message', {
      token,
      case_id: caseId,
      content,
    });
  }

  /**
   * Listen for new messages
   */
  onNewMessage(callback: (message: any) => void) {
    this.socket?.on('new_message', callback);
  }

  /**
   * Listen for case updates
   */
  onCaseUpdate(callback: (update: any) => void) {
    this.socket?.on('case_update', callback);
  }

  /**
   * Listen for notifications
   */
  onNotification(callback: (notification: any) => void) {
    this.socket?.on('notification', callback);
  }

  /**
   * Remove all listeners
   */
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

// Export a singleton instance
const socketService = new SocketService();

export default socketService;
