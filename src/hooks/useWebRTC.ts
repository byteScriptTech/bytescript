import { useState, useRef, useCallback, useEffect } from 'react';

import {
  WebSocketService,
  RTCSessionDescriptionInit,
  RTCIceCandidate,
} from '@/lib/websocket';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export function useWebRTC(roomId: string, userId: string) {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('disconnected');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [peers, setPeers] = useState<Set<string>>(new Set());

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const dataChannel = useRef<RTCDataChannel | null>(null);
  const wsService = useRef<WebSocketService | null>(null);
  const pendingCandidates = useRef<RTCIceCandidate[]>([]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!roomId || !userId) return;

    const ws = new WebSocketService(userId, roomId);
    wsService.current = ws;

    const handleMessage = async (message: any) => {
      if (!peerConnection.current) return;

      switch (message.type) {
        case 'offer':
          await handleOffer(message.payload.sdp, message.from);
          break;
        case 'answer':
          await handleAnswer(message.payload.sdp, message.from);
          break;
        case 'ice-candidate':
          await handleNewICECandidate(message.payload.candidate);
          break;
        case 'join':
          setPeers((prev) => new Set([...prev, message.from]));
          if (message.from !== userId) {
            await createOffer(message.from);
          }
          break;
        case 'leave':
          setPeers((prev) => {
            const updated = new Set(prev);
            updated.delete(message.from);
            return updated;
          });
          break;
      }
    };

    const cleanup = ws.addMessageHandler(handleMessage);

    ws.connect().catch((err) => {
      setError('Failed to connect to signaling server');
      console.error('WebSocket connection error:', err);
    });

    return () => {
      cleanup();
      ws.cleanup();
      closePeerConnection();
    };
  }, [roomId, userId]);

  // Initialize local media stream
  const initLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      return stream;
    } catch (err) {
      setError('Could not access camera/microphone. Please check permissions.');
      console.error('Error accessing media devices:', err);
      throw err;
    }
  }, []);

  // Create peer connection
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // Add TURN servers in production
      ],
    });

    // Add local stream to peer connection
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && wsService.current) {
        // Send ICE candidate to all peers
        peers.forEach((peerId) => {
          wsService.current?.sendICECandidate(event.candidate!, peerId);
        });
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setConnectionStatus('connected');
      } else if (
        pc.connectionState === 'disconnected' ||
        pc.connectionState === 'failed'
      ) {
        setConnectionStatus('disconnected');
      }
    };

    peerConnection.current = pc;
    return pc;
  }, [localStream, peers]);

  // Create data channel for code sync
  const createDataChannel = useCallback((pc: RTCPeerConnection) => {
    const dc = pc.createDataChannel('code', { negotiated: true, id: 0 });

    dc.onopen = () => {
      console.log('Data channel is open');
      // Process any pending ICE candidates
      pendingCandidates.current.forEach((candidate) => {
        peerConnection.current?.addIceCandidate(candidate);
      });
      pendingCandidates.current = [];
    };

    dc.onclose = () => {
      console.log('Data channel is closed');
    };

    dataChannel.current = dc;
    return dc;
  }, []);

  // Handle incoming offer
  const handleOffer = useCallback(
    async (sdp: RTCSessionDescriptionInit, from: string) => {
      if (!wsService.current) return;

      try {
        const pc = peerConnection.current || (await createPeerConnection());
        const _dc = dataChannel.current || createDataChannel(pc);

        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        wsService.current.sendAnswer(answer, from);
      } catch (err) {
        console.error('Error handling offer:', err);
        setError('Failed to establish connection');
      }
    },
    [createPeerConnection, createDataChannel]
  );

  // Handle incoming answer
  const handleAnswer = useCallback(
    async (sdp: RTCSessionDescriptionInit, _from: string) => {
      if (!peerConnection.current) return;

      try {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(sdp)
        );
      } catch (err) {
        console.error('Error handling answer:', err);
        setError('Failed to establish connection');
      }
    },
    []
  );

  // Handle ICE candidates
  const handleNewICECandidate = useCallback(
    async (candidate: RTCIceCandidate) => {
      try {
        if (peerConnection.current?.remoteDescription) {
          await peerConnection.current.addIceCandidate(candidate);
        } else {
          // Store candidates until we have a remote description
          pendingCandidates.current.push(candidate);
        }
      } catch (err) {
        console.error('Error adding ICE candidate:', err);
      }
    },
    []
  );

  // Create and send offer
  const createOffer = useCallback(
    async (to: string) => {
      if (!wsService.current) return;

      try {
        const pc = peerConnection.current || (await createPeerConnection());
        const _dc = dataChannel.current || createDataChannel(pc);

        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });

        await pc.setLocalDescription(offer);
        wsService.current.sendOffer(offer, to);
      } catch (err) {
        console.error('Error creating offer:', err);
        setError('Failed to create offer');
      }
    },
    [createPeerConnection, createDataChannel]
  );

  // Close peer connection
  const closePeerConnection = useCallback(() => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (dataChannel.current) {
      dataChannel.current.close();
      dataChannel.current = null;
    }
    setConnectionStatus('disconnected');
  }, []);

  // Join room
  const joinRoom = useCallback(async () => {
    try {
      setConnectionStatus('connecting');
      await initLocalStream();
      await createPeerConnection();
      // The WebSocket 'join' message is sent automatically on connection
    } catch (err) {
      console.error('Error joining room:', err);
      setError('Failed to join room');
      setConnectionStatus('disconnected');
    }
  }, [createPeerConnection, initLocalStream]);

  // Leave room
  const leaveRoom = useCallback(() => {
    closePeerConnection();
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);
    setConnectionStatus('disconnected');
  }, [closePeerConnection, localStream]);

  // Send data through data channel
  const sendData = useCallback((data: string) => {
    if (dataChannel.current?.readyState === 'open') {
      dataChannel.current.send(data);
      return true;
    }
    return false;
  }, []);

  // Set up data channel message handler
  const onData = useCallback((callback: (data: string) => void) => {
    if (!dataChannel.current) return () => {};

    const handler = (event: MessageEvent) => {
      callback(event.data);
    };

    dataChannel.current.onmessage = handler;
    return () => {
      if (dataChannel.current) {
        dataChannel.current.onmessage = null;
      }
    };
  }, []);

  return {
    connectionStatus,
    localStream,
    remoteStream,
    error,
    peers: Array.from(peers),
    joinRoom,
    leaveRoom,
    sendData,
    onData,
  };
}
