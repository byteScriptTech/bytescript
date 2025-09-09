// WebRTC types
export type RTCSessionDescriptionInit = {
  type: 'offer' | 'answer' | 'pranswer' | 'rollback';
  sdp?: string;
};

export type RTCIceCandidate = {
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
  | 'error';

type WebSocketMessage = {
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

  constructor(
    private userId: string,
    private roomId: string
  ) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.ws) {
        this.ws.close();
      }

      try {
        this.ws = new WebSocket(
          `wss://your-websocket-server.com?userId=${this.userId}&roomId=${this.roomId}`
        ) as WebSocket & { terminate?: () => void };

        this.setupEventHandlers();
        this.isConnected = true;
        this.reconnectAttempts = 0;

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.send({ type: 'join', payload: {} });
          resolve();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnected = false;
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.isConnected = false;
          this.attemptReconnect();
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
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(
      this.reconnectTimeout * Math.pow(2, this.reconnectAttempts - 1),
      30000
    );

    console.log(
      `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    setTimeout(() => {
      this.connect().catch(console.error);
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
    if (this.ws) {
      this.send({ type: 'leave', payload: {} });
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
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

  sendICECandidate(candidate: RTCIceCandidate, to: string) {
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
