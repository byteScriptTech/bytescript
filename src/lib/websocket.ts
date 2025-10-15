// websockets.ts
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
  | 'peers-updated'
  | 'ice'
  | 'error'
  // collaborative/document types
  | 'get-doc'
  | 'doc'
  | 'doc-updated'
  | 'update'
  | 'update-rejected'
  | 'cursor'
  | 'get-peers';

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
  private reconnectTimeout = 1000; // base 1s
  private isConnectedFlag = false;
  private isExplicitlyClosed = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private userId: string,
    private roomId: string,
    private baseUrl = 'ws://localhost:4000' // default for dev
  ) {}

  isConnected() {
    return this.isConnectedFlag;
  }

  // Connect takes an optional token (ephemeral JWT or Firebase ID token).
  // Resolves after the socket is open (or rejects on error).
  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Already open
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.isConnectedFlag = true;
        resolve();
        return;
      }

      // Prevent connecting if explicitly closed
      if (this.isExplicitlyClosed) {
        reject(new Error('Connection was explicitly closed'));
        return;
      }

      // Clear any pending reconnect timer
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }

      // Close existing socket if present
      if (this.ws) {
        try {
          this.ws.close();
        } catch {
          // ignore
        }
        this.ws = null;
      }

      try {
        const url = new URL(this.baseUrl);
        if (token) url.searchParams.set('token', token); // Connect with token
        url.searchParams.set('userId', this.userId);
        url.searchParams.set('roomId', this.roomId);

        // If page served over https, use wss
        if (
          typeof window !== 'undefined' &&
          window.location?.protocol === 'https:' &&
          url.protocol === 'ws:'
        ) {
          url.protocol = 'wss:';
        }

        this.ws = new WebSocket(url.toString());

        // wire up handlers
        this.setupEventHandlers();

        // Hook into open/close/error to resolve/reject this connect attempt
        const onOpen = () => {
          this.isConnectedFlag = true;
          this.reconnectAttempts = 0;
          cleanupHandlers();
          resolve();
        };

        const onError = () => {
          cleanupHandlers();
          // Setup attemptReconnect if not explicitly closed
          if (!this.isExplicitlyClosed) {
            this.attemptReconnect();
          }
          reject(new Error('WebSocket connection error'));
        };

        const onClose = () => {
          cleanupHandlers();
          this.isConnectedFlag = false;
          if (!this.isExplicitlyClosed) this.attemptReconnect();
          reject(new Error('WebSocket closed before open'));
        };

        const cleanupHandlers = () => {
          if (!this.ws) return;
          this.ws.removeEventListener('open', onOpen);
          this.ws.removeEventListener('error', onError);
          this.ws.removeEventListener('close', onClose);
        };

        // If ws already open synchronously (unlikely) resolve immediately
        if (this.ws.readyState === WebSocket.OPEN) {
          this.isConnectedFlag = true;
          resolve();
          return;
        }

        this.ws.addEventListener('open', onOpen);
        this.ws.addEventListener('error', onError);
        this.ws.addEventListener('close', onClose);
      } catch (error) {
        reject(error);
      }
    });
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    // onopen
    this.ws.onopen = () => {
      this.isConnectedFlag = true;
      this.reconnectAttempts = 0;
      // optional: notify handlers of a 'connected' system message
      this.notifyHandlers({
        type: 'connected',
        payload: { message: 'ws-open' },
        from: 'system',
      });
    };

    // onclose
    this.ws.onclose = (_ev) => {
      this.isConnectedFlag = false;
      if (!this.isExplicitlyClosed) {
        this.attemptReconnect();
      }
      this.notifyHandlers({
        type: 'error',
        payload: { message: 'WebSocket closed' },
        from: 'system',
      });
    };

    // onerror
    this.ws.onerror = (_ev) => {
      // We still let reconnect handle it
      if (!this.isExplicitlyClosed) {
        this.attemptReconnect();
      }
      this.notifyHandlers({
        type: 'error',
        payload: { message: 'WebSocket error' },
        from: 'system',
      });
    };

    // onmessage
    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        this.notifyHandlers(message);
      } catch (error) {
        console.warn('Failed to parse WS message', error);
        // ignore malformed frames
      }
    };
  }

  private notifyHandlers(message: WebSocketMessage) {
    this.messageHandlers.forEach((handler) => {
      try {
        handler(message);
      } catch (e) {
        console.error('Message handler threw', e);
      }
    });
  }

  private attemptReconnect() {
    if (this.isExplicitlyClosed) return;

    // Already scheduled
    if (this.reconnectTimer) return;

    this.reconnectAttempts++;
    if (this.reconnectAttempts > this.maxReconnectAttempts) {
      // notify handlers of persistent failure
      this.notifyHandlers({
        type: 'error',
        payload: { message: 'Max reconnect attempts reached' },
        from: 'system',
      });
      return;
    }

    const delay = Math.min(
      this.reconnectTimeout * Math.pow(2, this.reconnectAttempts - 1),
      30000
    );

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      // Attempt reconnect without token — caller should manage token lifecycle
      this.connect().catch(() => {
        // ignore, next attempt scheduled by attemptReconnect if needed
      });
    }, delay);
  }

  // Generic send; automatically sets 'from'
  send(message: Omit<WebSocketMessage, 'from'>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ ...message, from: this.userId }));
      } catch (e) {
        console.warn('Failed to send WS message', e);
      }
    } else {
      console.warn('WS not open, cannot send message', message.type);
    }
  }

  // Send arbitrary object (will include `from` if not present)
  sendRaw(obj: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const out = { ...obj, from: obj.from ?? this.userId };
      try {
        this.ws.send(JSON.stringify(out));
      } catch (e) {
        console.warn('sendRaw failed', e);
      }
    } else {
      console.warn('WS not open for sendRaw', obj);
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

    this.isConnectedFlag = false;
  }

  // WebRTC signaling helpers
  sendOffer(offer: RTCSessionDescriptionInit, to: string) {
    console.debug('[WS] sendOffer ->', { to, type: offer?.type });
    this.send({
      type: 'offer',
      payload: { sdp: offer },
      to,
    });
  }

  sendAnswer(answer: RTCSessionDescriptionInit, to: string) {
    console.debug('[WS] sendAnswer ->', { to, type: answer?.type });
    this.send({
      type: 'answer',
      payload: { sdp: answer },
      to,
    });
  }

  // Fixed: send candidate as a single object under payload.candidate
  sendICECandidate(candidate: RTCIceCandidateShape, to: string) {
    const candidateObj = {
      candidate: candidate.candidate,
      sdpMLineIndex: candidate.sdpMLineIndex,
      sdpMid: candidate.sdpMid,
      usernameFragment: (candidate as any).usernameFragment ?? null,
    };

    console.debug('[WS] sendICECandidate ->', { to, candidate: candidateObj });
    this.send({
      type: 'ice-candidate',
      payload: { candidate: candidateObj },
      to,
    });
  }

  // Convenience helpers for collaborative editor logic

  // notify server we joined (server will reply with 'joined'/'peers-updated' etc)
  joinRoom() {
    this.send({
      type: 'join',
      payload: { roomId: this.roomId, userId: this.userId },
      to: undefined,
    });
  }

  leaveRoom() {
    this.send({
      type: 'leave',
      payload: { roomId: this.roomId, userId: this.userId },
      to: undefined,
    });
  }

  // Request authoritative doc for the room
  requestDoc() {
    this.send({
      type: 'get-doc',
      payload: { roomId: this.roomId },
      to: undefined,
    });
  }

  // Request peers list explicitly
  requestPeers() {
    this.send({
      type: 'get-peers',
      payload: { roomId: this.roomId },
      to: undefined,
    });
  }

  // Send an update (full-text optimistic update)
  sendUpdate(text: string, baseVersion: number | null = null) {
    this.send({
      type: 'update',
      payload: {
        roomId: this.roomId,
        userId: this.userId,
        text,
        baseVersion,
        timestamp: Date.now(),
      },
      to: undefined,
    });
  }

  // Send cursor position
  sendCursor(cursor: any | null, selection: any | null = null) {
    this.send({
      type: 'cursor',
      payload: { roomId: this.roomId, userId: this.userId, cursor, selection },
      to: undefined,
    });
  }

  // Cleanup helper
  cleanup() {
    this.disconnect();
    this.messageHandlers.clear();
  }
}
