'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WebSocketService } from '@/lib/websocket';

import { CollaborativeCodeEditor } from './CollaborativeCodeEditor';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export function PeerProgrammingRoom() {
  const searchParams = useSearchParams();

  // UI / editor state
  const [roomId, setRoomId] = useState('');
  const [code, setCode] = useState<string>('');
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

  // If the search param contains a room, show it in the UI
  useEffect(() => {
    const roomIdFromUrl = searchParams.get('room');
    if (roomIdFromUrl && roomIdFromUrl !== roomId) {
      setRoomId(roomIdFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Helper: fetch  for editor WebSocket (best-effort)
  const fetchToken = useCallback(
    async (userId: string, roomId: string): Promise<string | null> => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/ws-token`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, roomId }),
          }
        );

        if (!res.ok) return null;
        const { token } = await res.json();
        return token;
      } catch (error) {
        console.error('Failed to fetch token:', error);
        return null;
      }
    },
    []
  );

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

  // Connect + join editor WebSocket (video removed)
  const joinRoom = useCallback(async () => {
    if (!roomId?.trim()) {
      setError('Please provide a room id');
      return;
    }

    if (wsRef.current && wsRef.current.isConnected?.()) {
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

    const token = await fetchToken(userId, roomId).catch(() => null);

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
    }

    // cleanup function that will be returned by joinRoom (but not used by UI directly)
    return () => {
      cleanupHandler();
    };
  }, [fetchToken, handleWsMessage, roomId, userId]);

  // Leave editor websocket
  const leaveRoom = useCallback(() => {
    // Editor WS
    try {
      if (wsRef.current) {
        try {
          wsRef.current.leaveRoom();
        } catch {
          /* empty */
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
  }, []);

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

  // Overall "connected" indicator (only editor WS now)
  const overallConnected = wsConnectionStatus === 'connected';

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
                  <Button
                    onClick={() => {
                      const newId = uuidv4().slice(0, 8);
                      setRoomId(newId);
                    }}
                    variant="ghost"
                  >
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
        {/* Presence / info panel */}
        <aside className="w-full md:w-1/4 border-r border-border p-4">
          <h2 className="text-lg font-semibold mb-2">Participants</h2>
          <div className="text-sm text-muted-foreground mb-4">
            {wsConnectionStatus === 'connected'
              ? `${editorPeers.length + 1} in room`
              : 'Not connected'}
          </div>

          <div>
            <strong>Your ID:</strong>
            <div className="text-sm my-2">{userId}</div>
          </div>

          <div className="mt-4">
            <strong>Peers</strong>
            <ul className="mt-2">
              {editorPeers.length === 0 ? (
                <li className="text-sm text-muted-foreground">No peers</li>
              ) : (
                editorPeers.map((p) => (
                  <li key={p} className="text-sm">
                    {p}
                  </li>
                ))
              )}
            </ul>
          </div>
        </aside>

        {/* Editor */}
        <section className="flex-1 flex flex-col">
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
        </section>
      </main>
    </div>
  );
}
