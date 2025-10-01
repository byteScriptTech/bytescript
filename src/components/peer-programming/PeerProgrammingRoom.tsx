'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWebRTC } from '@/hooks/useWebRTC';
import { WebSocketService } from '@/lib/websocket';

import { CollaborativeCodeEditor } from './CollaborativeCodeEditor';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export function PeerProgrammingRoom() {
  const searchParams = useSearchParams();

  // UI / editor state
  const [roomId, setRoomId] = useState('');
  const [code, setCode] = useState('// Start coding with your peer!');
  const [wsConnectionStatus, setWsConnectionStatus] =
    useState<ConnectionStatus>('disconnected');
  const [editorPeers, setEditorPeers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // stable userId for the session
  const userIdRef = useRef<string | null>(null);
  if (!userIdRef.current) userIdRef.current = `user-${uuidv4().slice(0, 8)}`;
  const userId = userIdRef.current!;

  // WebSocketService instance (editor/collab)
  const wsRef = useRef<WebSocketService | null>(null);

  // local version of the server doc (authoritative)
  const docVersionRef = useRef<number | null>(null);

  // debounce timer for sending edits
  const sendDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // This hook manages its own signaling connection and peer connections for media.
  // We intentionally keep it separate from the editor WebSocket.
  const {
    connectionStatus: rtcConnectionStatus,
    localStream,
    firstRemoteStream,
    peers: rtcPeerList,
    joinRoom: joinRoomRTC,
    leaveRoom: leaveRoomRTC,
  } = useWebRTC(roomId, userId, process.env.NEXT_PUBLIC_SIGNALING_URL);

  // local UI toggles for audio/video
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Refs for <video> elements
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // If the search param contains a room, show it in the UI
  useEffect(() => {
    const roomIdFromUrl = searchParams.get('room');
    if (roomIdFromUrl && roomIdFromUrl !== roomId) {
      setRoomId(roomIdFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Helper: fetch token for editor WebSocket (best-effort)
  const fetchToken = useCallback(async (): Promise<string | null> => {
    try {
      const res = await fetch('/api/ws-token');
      if (!res.ok) return null;
      const json = await res.json();
      return json.token as string;
    } catch {
      return null;
    }
  }, []);

  // Handler for incoming editor WebSocket messages
  const handleWsMessage = useCallback(
    (msg: any) => {
      const { type, payload = {} } = msg;

      if (type === 'joined' || type === 'peers-updated') {
        const rawPeers =
          payload?.peers ?? payload?.participants ?? payload ?? [];
        const ids: string[] = Array.isArray(rawPeers)
          ? rawPeers
              .map((p: any) =>
                typeof p === 'string' ? p : (p?.id ?? p?.clientId ?? p?.uid)
              )
              .filter(Boolean)
          : [];
        const others = ids.filter((id) => id !== userId);
        setEditorPeers(others);
        return;
      }

      if (type === 'doc') {
        docVersionRef.current = payload?.version ?? null;
        setCode(typeof payload?.text === 'string' ? payload.text : '');
        return;
      }

      if (type === 'doc-updated') {
        const incomingVersion = payload?.version ?? null;
        if (
          incomingVersion == null ||
          docVersionRef.current == null ||
          incomingVersion > docVersionRef.current
        ) {
          docVersionRef.current = incomingVersion;
          setCode(typeof payload?.text === 'string' ? payload.text : '');
        }
        return;
      }

      if (type === 'update-rejected') {
        docVersionRef.current = payload?.currentVersion ?? null;
        setCode(typeof payload?.text === 'string' ? payload.text : '');
        console.warn(
          'Update rejected by server; authoritative doc applied.',
          payload
        );
        return;
      }

      if (type === 'cursor') {
        // Optional: forward to editor to show cursors (not implemented here)
        return;
      }

      if (type === 'error') {
        setError(payload?.message ?? 'Unknown WebSocket error');
        return;
      }
    },
    [userId]
  );

  // Connect + join both editor WebSocket and RTC (video)
  const joinRoom = useCallback(async () => {
    if (!roomId?.trim()) {
      setError('Please provide a room id');
      return;
    }

    // If already connected to both, do nothing
    if (
      wsRef.current &&
      wsRef.current.isConnected?.() &&
      rtcConnectionStatus === 'connected'
    ) {
      return;
    }

    setWsConnectionStatus('connecting');
    setError(null);

    // Clean previous editor WS if present
    if (wsRef.current) {
      try {
        wsRef.current.cleanup();
      } catch (e) {
        console.error('Failed to cleanup previous editor WS', e);
      }
      wsRef.current = null;
    }

    const token = await fetchToken().catch(() => null);

    // Create new editor WebSocket and connect
    const ws = new WebSocketService(
      userId,
      roomId,
      process.env.NEXT_PUBLIC_SIGNALING_URL || 'ws://localhost:4000'
    );
    wsRef.current = ws;
    const cleanupHandler = ws.addMessageHandler((m) => handleWsMessage(m));

    try {
      await ws.connect(token || undefined);
      // Join room on editor WS
      try {
        ws.joinRoom();
        ws.requestDoc();
        ws.requestPeers();
      } catch (e) {
        // server might not support helper methods — ignore
      }
      setWsConnectionStatus('connected');
    } catch (e: any) {
      console.error('Editor WebSocket connection failed', e);
      setWsConnectionStatus('disconnected');
      setError((prev) => prev ?? e?.message ?? 'Editor WebSocket failed');
      // keep going — video may still work
    }

    // Start RTC video flow (separate signaling managed by useWebRTC)
    try {
      await joinRoomRTC();
    } catch (e) {
      console.warn('RTC join failed', e);
      // leave it to hook to update its own status
    }

    // cleanup function that will be returned by joinRoom (but not used by UI directly)
    return () => {
      cleanupHandler();
    };
  }, [
    fetchToken,
    handleWsMessage,
    joinRoomRTC,
    roomId,
    rtcConnectionStatus,
    userId,
  ]);

  // Leave both editor websocket and RTC
  const leaveRoom = useCallback(() => {
    // Editor WS
    try {
      if (wsRef.current) {
        try {
          wsRef.current.leaveRoom();
        } catch {
          console;
        }
        wsRef.current.cleanup();
        wsRef.current = null;
      }
    } catch (e) {
      console.error('Error leaving editor websocket', e);
    } finally {
      setWsConnectionStatus('disconnected');
      setEditorPeers([]);
      docVersionRef.current = null;
    }

    // RTC
    try {
      leaveRoomRTC();
    } catch (e) {
      console.error('Error leaving rtc room', e);
    }
  }, [leaveRoomRTC]);

  // sendData wrapper used by CollaborativeCodeEditor — we interpret code-update messages
  const sendData = useCallback((data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (
        parsed &&
        typeof parsed === 'object' &&
        parsed.type === 'code-update' &&
        typeof parsed.code === 'string'
      ) {
        const text = parsed.code;
        setCode(text); // optimistic local update
        if (sendDebounce.current) clearTimeout(sendDebounce.current);
        sendDebounce.current = setTimeout(() => {
          try {
            wsRef.current?.sendUpdate(text, docVersionRef.current);
          } catch (e) {
            console.warn('sendUpdate failed', e);
          }
          sendDebounce.current = null;
        }, 300);
        return true;
      }
    } catch {
      // not JSON
    }

    try {
      if (!wsRef.current) return false;
      wsRef.current.sendRaw({ type: 'raw', payload: data });
      return true;
    } catch (e) {
      console.warn('sendData fallback failed', e);
      return false;
    }
  }, []);

  // direct editor callback when user edits in the editor component
  const handleCodeChange = useCallback((newCode: string) => {
    setCode((prev) => (prev === newCode ? prev : newCode));
    if (sendDebounce.current) clearTimeout(sendDebounce.current);
    sendDebounce.current = setTimeout(() => {
      try {
        wsRef.current?.sendUpdate(newCode, docVersionRef.current);
      } catch (e) {
        console.warn('sendUpdate failed', e);
      }
      sendDebounce.current = null;
    }, 300);
  }, []);

  // Attach streams to <video> elements
  useEffect(() => {
    const lv = localVideoRef.current;
    const rv = remoteVideoRef.current;
    if (lv) {
      lv.srcObject = localStream ?? null;
    }
    if (rv) {
      rv.srcObject = firstRemoteStream ?? null;
    }
    return () => {
      if (lv) lv.srcObject = null;
      if (rv) rv.srcObject = null;
    };
  }, [localStream, firstRemoteStream]);

  // toggle mute/video
  const toggleMute = useCallback(() => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setIsMuted((s) => !s);
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    if (!localStream) return;
    localStream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setIsVideoOff((v) => !v);
  }, [localStream]);

  // generate room id
  const createRoom = useCallback(() => {
    const newId = uuidv4().slice(0, 8);
    setRoomId(newId);
  }, []);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (sendDebounce.current) {
        clearTimeout(sendDebounce.current);
        sendDebounce.current = null;
      }
      leaveRoom();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Overall "connected" indicator: show green if either editor WS or RTC is connected
  const overallConnected =
    wsConnectionStatus === 'connected' || rtcConnectionStatus === 'connected';

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Peer Programming</h1>
          <div className="flex items-center gap-4">
            {!overallConnected ? (
              <div className="flex gap-2">
                <div className="flex-1 max-w-xs">
                  <Input
                    placeholder="Enter Room ID or create one"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={joinRoom}
                    variant="outline"
                    disabled={!roomId.trim()}
                    className="relative"
                  >
                    Join Room
                  </Button>
                  <Button onClick={createRoom} variant="ghost">
                    Create
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-3 w-3 rounded-full ${overallConnected ? 'bg-green-500' : 'bg-yellow-500'}`}
                />
                <span>
                  {overallConnected
                    ? `Connected to: ${roomId} (${editorPeers.length} peer${editorPeers.length !== 1 ? 's' : ''})`
                    : 'Connecting...'}
                </span>
                <Button variant="link" onClick={leaveRoom}>
                  Leave
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 text-center">
          {error}
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Video column */}
        <div className="w-full md:w-1/3 border-r border-border p-4 flex flex-col gap-4">
          <h2 className="text-lg font-semibold">
            {rtcConnectionStatus === 'connected'
              ? `Participants (${rtcPeerList.length + 1})`
              : 'Video Call'}
          </h2>

          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            {firstRemoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                aria-label="Remote participant video"
              >
                <track
                  kind="captions"
                  src=""
                  srcLang="en"
                  label="English"
                  default
                />
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/50">
                <div className="h-16 w-16 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                  <span className="text-muted-foreground">Peer</span>
                </div>
              </div>
            )}

            <div className="absolute bottom-2 right-2 w-32 h-24 bg-muted rounded overflow-hidden border border-border">
              {localStream ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover ${isVideoOff ? 'bg-muted' : ''}`}
                  aria-label="Your video"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/50">
                  <div className="h-8 w-8 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">You</span>
                  </div>
                </div>
              )}
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
                  <span className="text-muted-foreground">Video Off</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              variant={isMuted ? 'secondary' : 'outline'}
              size="sm"
              onClick={toggleMute}
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>
            <Button
              variant={isVideoOff ? 'secondary' : 'outline'}
              size="sm"
              onClick={toggleVideo}
            >
              {isVideoOff ? 'Start Video' : 'Stop Video'}
            </Button>
            {overallConnected && (
              <Button
                variant="destructive"
                size="sm"
                className="ml-auto"
                onClick={leaveRoom}
              >
                End Call
              </Button>
            )}
          </div>
        </div>

        {/* Editor column */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold">Collaborative Editor</h2>
            <div className="text-sm text-muted-foreground">
              {wsConnectionStatus === 'connected'
                ? `Connected with ${editorPeers.length} peer${editorPeers.length !== 1 ? 's' : ''}`
                : 'Disconnected'}
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="h-full w-full">
              <CollaborativeCodeEditor
                code={code}
                onCodeChange={handleCodeChange}
                onCursorChange={() => {}}
                height="100%"
                userId={userId}
                sendData={sendData}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
