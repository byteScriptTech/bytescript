export type RTCSessionDescriptionInit = {
  type: 'offer' | 'answer' | 'pranswer' | 'rollback';
  sdp?: string;
};

export type RTCIceCandidateShape = {
  candidate: string;
  sdpMLineIndex: number | null;
  sdpMid: string | null;
  usernameFragment?: string | null;
};

type MessageType =
  | 'offer'
  | 'answer'
  | 'ice-candidate'
  | 'join'
  | 'leave'
  | 'connected'
  | 'joined'
  | 'error';

export type WebSocketMessage = {
  type: MessageType;
  payload: any;
  from: string;
  to?: string;
};

type MessageHandler = (message: WebSocketMessage) => void;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers = new Set<MessageHandler>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000; // 1 second
  private isConnected = false;
  private isExplicitlyClosed = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private userId: string,
    private roomId: string,
    private baseUrl = 'ws://localhost:4000' // default for dev
  ) {}

  // Connect takes an optional token (ephemeral JWT or Firebase ID token).
  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }

      if (this.isExplicitlyClosed) {
        reject(new Error('Connection was explicitly closed'));
        return;
      }

      if (this.ws) {
        try {
          this.ws.close();
        } catch (e) {
          // Ignore errors during close
        }
        this.ws = null;
      }

      try {
        const url = new URL(this.baseUrl);
        if (token) url.searchParams.set('token', token); // Connect with token
        url.searchParams.set('userId', this.userId);
        url.searchParams.set('roomId', this.roomId);

        // Force wss:// if page is served over https://
        if (window.location?.protocol === 'https:' && url.protocol === 'ws:') {
          url.protocol = 'wss:';
        }

        this.ws = new WebSocket(url.toString());
        this.setupEventHandlers();
        this.isConnected = false;
        this.reconnectAttempts = 0;

        this.ws.onopen = () => {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onclose = (_event) => {
          this.isConnected = false;
          if (!this.isExplicitlyClosed) {
            this.attemptReconnect();
          }
        };

        this.ws.onerror = (error) => {
          if (!this.isExplicitlyClosed) {
            this.attemptReconnect();
          }
          reject(error);
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.messageHandlers.forEach((handler) => handler(message));
          } catch (error) {
            // Error parsing WebSocket message
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
    };

    this.ws.onclose = () => {
      this.isConnected = false;
      if (!this.isExplicitlyClosed) {
        this.attemptReconnect();
      }
    };

    this.ws.onerror = () => {
      if (!this.isExplicitlyClosed) {
        this.attemptReconnect();
      }
    };
  }

  private notifyHandlers(message: WebSocketMessage) {
    this.messageHandlers.forEach((handler) => handler(message));
  }

  private attemptReconnect() {
    // Don't attempt to reconnect if explicitly closed or already reconnecting
    if (this.isExplicitlyClosed || this.reconnectTimer) {
      // Reconnection attempt in progress
      this.notifyHandlers({
        type: 'error',
        payload: {
          message: 'Connection lost. Please refresh the page to try again.',
        },
        from: 'system',
      });
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(
      this.reconnectTimeout * Math.pow(2, this.reconnectAttempts - 1),
      30000 // Max 30 seconds between attempts
    );

    // Reconnection attempt in progress

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      // Try to reconnect without token (caller should manage token lifecycle)
      this.connect().catch(() => {
        // Ignore connection errors during reconnection
        // The next reconnection attempt will be scheduled if needed
      });
    }, delay);
  }

  send(message: Omit<WebSocketMessage, 'from'>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ ...message, from: this.userId }));
    }
  }

  addMessageHandler(handler: MessageHandler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  disconnect() {
    this.isExplicitlyClosed = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      try {
        this.ws.close(1000, 'User disconnected');
      } catch (error) {
        console.error('Error closing WebSocket:', error);
      } finally {
        this.ws = null;
      }
    }

    this.isConnected = false;
  }

  // WebRTC signaling helpers
  sendOffer(offer: RTCSessionDescriptionInit, to: string) {
    this.send({
      type: 'offer',
      payload: { sdp: offer },
      to,
    });
  }

  sendAnswer(answer: RTCSessionDescriptionInit, to: string) {
    this.send({
      type: 'answer',
      payload: { sdp: answer },
      to,
    });
  }

  sendICECandidate(candidate: RTCIceCandidateShape, to: string) {
    this.send({
      type: 'ice-candidate',
      payload: {
        candidate: candidate.candidate,
        sdpMLineIndex: candidate.sdpMLineIndex,
        sdpMid: candidate.sdpMid,
      },
      to,
    });
  }

  // Cleanup
  cleanup() {
    this.disconnect();
    this.messageHandlers.clear();
  }
}
