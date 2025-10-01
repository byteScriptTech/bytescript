import { useState, useRef, useCallback, useEffect } from 'react';

import {
  WebSocketService,
  RTCSessionDescriptionInit,
  RTCIceCandidateShape,
  WebSocketMessage,
} from '@/lib/websocket';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export function useWebRTC(
  roomId: string,
  userId: string,
  signalingUrl = process.env.NEXT_PUBLIC_SIGNALING_URL || 'ws://localhost:4000'
) {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('disconnected');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreamMap, setRemoteStreamMap] = useState<
    Map<string, MediaStream>
  >(new Map());
  const [error, setError] = useState<string | null>(null);
  const [peers, setPeers] = useState<Set<string>>(new Set());

  const wsService = useRef<WebSocketService | null>(null);
  // Map remotePeerId -> RTCPeerConnection
  const pcs = useRef<Map<string, RTCPeerConnection>>(new Map());
  // Map remotePeerId -> pending ICE candidates
  const pendingCandidates = useRef<Map<string, RTCIceCandidateShape[]>>(
    new Map()
  );

  // Helper to fetch ephemeral token (adapt to your auth)
  const fetchToken = useCallback(async () => {
    try {
      // If we have a JWT secret, sign a token with user and room info
      if (process.env.NEXT_PUBLIC_WS_JWT_SECRET) {
        try {
          // Import jose which works in both browser and Node.js
          const { SignJWT } = await import('jose');
          const secret = new TextEncoder().encode(
            process.env.NEXT_PUBLIC_WS_JWT_SECRET
          );

          // Create a JWT with user and room information
          const token = await new SignJWT({
            userId,
            roomId,
            role: 'user',
          })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1h')
            .sign(secret);

          return token;
        } catch (signError) {
          console.error('Error signing token:', signError);
          throw signError;
        }
      }
      // Fallback to fetching from API if no token provided
      try {
        const res = await fetch('/api/ws-token');
        if (!res.ok) {
          const errorText = await res.text();
          console.error('API token fetch failed:', res.status, errorText);
          throw new Error(`API request failed with status ${res.status}`);
        }
        const json = await res.json();
        console.log('API token received');
        return json.token as string;
      } catch (apiError) {
        console.error('API token fetch error:', apiError);
        throw apiError;
      }
    } catch (err) {
      console.error('fetchToken failed with error:', {
        error:
          err instanceof Error
            ? {
                name: err.name,
                message: err.message,
                stack: err.stack,
              }
            : err,
        hasJwtSecret: !!process.env.NEXT_PUBLIC_WS_JWT_SECRET,
        userId,
        roomId,
      });
      return null;
    }
  }, [userId, roomId]);

  // Init local media
  const initLocalStream = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(s);
      return s;
    } catch (err) {
      setError('Could not access camera/mic');
      throw err;
    }
  }, []);

  // create a new PeerConnection for a given remotePeerId
  const createPeerFor = useCallback(
    async (remoteId: string) => {
      if (pcs.current.has(remoteId)) return pcs.current.get(remoteId)!;

      const iceResp = await fetch('/turn'); // your server's turn endpoint (optional)
      const iceJson = iceResp.ok
        ? await iceResp.json().catch(() => ({ iceServers: [] }))
        : { iceServers: [] };

      const pc = new RTCPeerConnection(
        iceJson.iceServers || [{ urls: 'stun:stun.l.google.com:19302' }]
      );

      // add local tracks
      if (localStream) {
        localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));
      }

      // when remote stream arrives — store it in map keyed by remoteId
      pc.ontrack = (ev) => {
        const stream = ev.streams[0];
        setRemoteStreamMap((prev) => {
          const copy = new Map(prev);
          copy.set(remoteId, stream);
          return copy;
        });
      };

      // ICE candidate: send to remote peer
      pc.onicecandidate = (ev) => {
        if (!ev.candidate) return;
        const candidateShape: RTCIceCandidateShape = {
          candidate: ev.candidate.candidate ?? '',
          sdpMLineIndex: ev.candidate.sdpMLineIndex ?? null,
          sdpMid: ev.candidate.sdpMid ?? null,
          usernameFragment: (ev.candidate as any).usernameFragment ?? null,
        };
        wsService.current?.sendICECandidate(candidateShape, remoteId);
      };

      // connection state
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

      pcs.current.set(remoteId, pc);
      pendingCandidates.current.set(remoteId, []);
      return pc;
    },
    [localStream]
  );

  // handle incoming messages from signaling server
  const handleMessage = useCallback(
    async (message: WebSocketMessage) => {
      const { type, payload, from } = message;
      console.debug('WS message received:', { type, from, payload });

      // Don't ignore authoritative peer list updates even if server sets from === userId
      if (from === userId && type !== 'peers-updated' && type !== 'connected') {
        return; // ignore our own signaling echoes for offer/answer/ice
      }

      // --- Peer list updates from server (authoritative) ---
      if (type === 'peers-updated' || type === 'connected') {
        const rawPeers =
          payload?.peers ?? payload?.participants ?? payload ?? [];
        const ids: string[] = Array.isArray(rawPeers)
          ? rawPeers
              .map((p: any) =>
                typeof p === 'string' ? p : (p?.id ?? p?.clientId ?? p?.uid)
              )
              .filter(Boolean)
          : [];

        const filtered = ids.filter((id) => id !== userId);

        setPeers(() => new Set(filtered));

        return;
      }

      if (type === 'join') {
        const newPeerId = from;
        if (newPeerId && newPeerId !== userId) {
          setPeers((prev) => {
            const copy = new Set(prev);
            copy.add(newPeerId);
            return copy;
          });
        }

        // create offer if needed (existing logic)
        if (newPeerId !== userId) {
          try {
            const pc = await createPeerFor(newPeerId);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            wsService.current?.sendOffer(
              offer as unknown as RTCSessionDescriptionInit,
              newPeerId
            );
          } catch (e) {
            console.error('offer creation error', e);
          }
        }
        return;
      }

      // --- offers / answers / ice (unchanged logic) ---
      if (type === 'offer') {
        const remoteId = from;
        try {
          const pc = await createPeerFor(remoteId);

          await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          wsService.current?.sendAnswer(
            answer as unknown as RTCSessionDescriptionInit,
            remoteId
          );

          // flush pending candidates
          const pending = pendingCandidates.current.get(remoteId) || [];
          for (const c of pending) {
            try {
              await pc.addIceCandidate(c as any);
            } catch (e) {
              console.warn('addIceCandidate pending failed', e);
            }
          }
          pendingCandidates.current.set(remoteId, []);
        } catch (e) {
          console.error('handle offer error', e);
        }
        return;
      }

      if (type === 'answer') {
        const remoteId = from;
        const pc = pcs.current.get(remoteId);
        if (!pc) return;
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        } catch (e) {
          console.error('handle answer error', e);
        }
        return;
      }

      if (type === 'ice-candidate' || type === 'ice') {
        const remoteId = from;
        const candidate = payload;
        const candidateShape: RTCIceCandidateShape = {
          candidate: candidate.candidate,
          sdpMLineIndex: candidate.sdpMLineIndex ?? null,
          sdpMid: candidate.sdpMid ?? null,
          usernameFragment: candidate.usernameFragment ?? null,
        };

        const pc = pcs.current.get(remoteId);
        if (pc && pc.remoteDescription) {
          try {
            await pc.addIceCandidate(candidateShape as any);
          } catch (e) {
            console.warn('addIceCandidate failed', e);
          }
        } else {
          const arr = pendingCandidates.current.get(remoteId) || [];
          arr.push(candidateShape);
          pendingCandidates.current.set(remoteId, arr);
        }
        return;
      }
    },
    [createPeerFor, userId]
  );

  // join room: init local media + connect ws and attach handler
  const joinRoom = useCallback(async () => {
    // Don't try to reconnect if already connected/connecting
    if (connectionStatus === 'connected' || connectionStatus === 'connecting') {
      return () => {};
    }

    setConnectionStatus('connecting');
    setError(null);

    // Close any existing connection
    if (wsService.current) {
      wsService.current.disconnect();
    }

    // Initialize connection timeout
    const connectionTimeout = setTimeout(() => {
      setError('Connection timeout');
      setConnectionStatus('disconnected');
      if (wsService.current) {
        wsService.current.disconnect();
        wsService.current = null;
      }
    }, 10000); // 10 second timeout

    try {
      // Initialize local media and fetch token in parallel
      const [token] = await Promise.all([
        fetchToken(),
        initLocalStream().catch((error) => {
          console.warn(
            'Could not initialize media devices, continuing without them',
            error
          );
          // Continue without media if user denies access
        }),
      ]);

      // Create new WebSocket connection
      const ws = new WebSocketService(userId, roomId, signalingUrl);
      wsService.current = ws;

      // Add message handler
      const cleanup = ws.addMessageHandler(handleMessage);
      console.log('token', token);
      // Connect to WebSocket
      await ws.connect(token || undefined);

      // Clear the connection timeout on successful connection
      clearTimeout(connectionTimeout);
      setConnectionStatus('connected');

      // Return cleanup function
      return () => {
        clearTimeout(connectionTimeout);
        cleanup();
        if (wsService.current) {
          wsService.current.disconnect();
          wsService.current = null;
        }
      };
    } catch (error) {
      console.error('joinRoom failed', error);
      clearTimeout(connectionTimeout);
      setError(error instanceof Error ? error.message : 'Failed to join room');
      setConnectionStatus('disconnected');

      // Clean up any partial connection
      if (wsService.current) {
        wsService.current.disconnect();
        wsService.current = null;
      }

      throw error;
    }
  }, [
    connectionStatus,
    fetchToken,
    handleMessage,
    initLocalStream,
    roomId,
    signalingUrl,
    userId,
  ]);

  const leaveRoom = useCallback(() => {
    // close all peer connections
    pcs.current.forEach((pc, _id) => {
      try {
        pc.close();
      } catch (error) {
        console.error('Error closing peer connection:', error);
      }
    });
    pcs.current.clear();
    pendingCandidates.current.clear();
    setPeers(new Set());
    setRemoteStreamMap(new Map());
    setConnectionStatus('disconnected');
    if (wsService.current) {
      wsService.current.disconnect();
      wsService.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      setLocalStream(null);
    }
  }, [localStream]);

  // helper: get the first remote stream
  const getFirstRemoteStream = useCallback(() => {
    for (const s of remoteStreamMap.values()) return s;
    return null;
  }, [remoteStreamMap]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      leaveRoom();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    connectionStatus,
    localStream,
    remoteStreams: remoteStreamMap, // Map<peerId, MediaStream>
    firstRemoteStream: getFirstRemoteStream(),
    error,
    peers: Array.from(peers),
    joinRoom,
    leaveRoom,
  };
}
