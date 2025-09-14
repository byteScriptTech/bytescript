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
      // If already connected or connecting, resolve immediately
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      // Clear any existing reconnection timer
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }

      // If explicitly closed, don't reconnect
      if (this.isExplicitlyClosed) {
        reject(new Error('Connection was explicitly closed'));
        return;
      }

      // Close existing connection if any
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      try {
        // Build the URL: baseUrl + query token/userId/roomId
        const url = new URL(this.baseUrl);
        if (token) url.searchParams.set('token', token);
        url.searchParams.set('userId', this.userId);
        url.searchParams.set('roomId', this.roomId);

        this.ws = new WebSocket(url.toString());
        this.setupEventHandlers();
        this.isConnected = false; // Will be set to true on successful connection
        this.reconnectAttempts = 0;

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0; // Reset reconnection attempts on successful connection

          // Announce join via server-side join handler
          this.send({ type: 'join', payload: {}, to: undefined });
          resolve();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnected = false;
          if (this.reconnectAttempts === 0) {
            // Only reject on first attempt to avoid unhandled promise rejections
            reject(error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected', {
            code: event.code,
            reason: event.reason,
          });
          this.isConnected = false;

          // Only attempt to reconnect if not explicitly closed and not a normal closure
          if (!this.isExplicitlyClosed && event.code !== 1000) {
            this.attemptReconnect();
          }
        };
      } catch (error) {
        console.error('Failed to create WebSocket:', error);
        reject(error);
      }
    });
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data as string) as WebSocketMessage;
        this.notifyHandlers(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }

  private notifyHandlers(message: WebSocketMessage) {
    this.messageHandlers.forEach((handler) => handler(message));
  }

  private attemptReconnect() {
    // Don't attempt to reconnect if explicitly closed or already reconnecting
    if (this.isExplicitlyClosed || this.reconnectTimer) {
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
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

    console.log(
      `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

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
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  addMessageHandler(handler: MessageHandler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  disconnect() {
    // Mark as explicitly closed to prevent reconnections
    this.isExplicitlyClosed = true;

    // Clear any pending reconnection
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Close the WebSocket connection if it exists
    if (this.ws) {
      try {
        // Try to close gracefully with a normal closure code
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
