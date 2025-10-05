'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { v4 as uuidv4 } from 'uuid';

import { useCall } from '@/hooks/useCall';
import { useFetchWsToken } from '@/hooks/useFetchWsToken';
import { WebSocketService } from '@/lib/websocket';
import type { ConnectionStatus } from '@/types/peer';

import CallControls from './CallControls';
import { ConsolePanel } from './ConsolePanel';
import EditorPanel from './EditorPanel';
import HeaderBar from './HeaderBar';
import PresencePanel from './PresencePanel';

export function PeerProgrammingRoom() {
  const searchParams = useSearchParams();

  // UI / editor state
  const [roomId, setRoomId] = useState('');
  const [code, setCode] = useState<string>('');
  const [wsConnectionStatus, setWsConnectionStatus] =
    useState<ConnectionStatus>('disconnected');
  const [editorPeers, setEditorPeers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<
    Array<{
      type: 'log' | 'error' | 'info' | 'warn';
      message: string;
      timestamp: number;
    }>
  >([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const clearLogs = useCallback(() => setLogs([]), []);

  const executeCode = useCallback((code: string) => {
    setIsExecuting(true);

    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
    };

    const captureLog =
      (type: 'log' | 'error' | 'warn' | 'info') =>
      (...args: any[]) => {
        originalConsole[type](...args);
        const message = args
          .map((arg) => {
            if (typeof arg === 'object' && arg !== null) {
              try {
                return JSON.stringify(arg, null, 2);
              } catch {
                return String(arg);
              }
            }
            return String(arg);
          })
          .join(' ');
        setLogs((prev) => [...prev, { type, message, timestamp: Date.now() }]);
      };

    console.log = captureLog('log');
    console.error = captureLog('error');
    console.warn = captureLog('warn');
    console.info = captureLog('info');

    try {
      const result = new Function(`'use strict'; ${code}`)();
      if (result !== undefined) console.log('Output:', result);
    } catch (err) {
      console.error('Error:', err instanceof Error ? err.message : String(err));
    } finally {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.info = originalConsole.info;
      setIsExecuting(false);
    }
  }, []);

  const userIdRef = useRef<string | null>(null);
  if (!userIdRef.current) userIdRef.current = `user-${uuidv4().slice(0, 8)}`;
  const userId = userIdRef.current!;

  const wsRef = useRef<WebSocketService | null>(null);
  const wsMessageCleanupRef = useRef<(() => void) | null>(null);
  const docVersionRef = useRef<number | null>(null);
  const sendDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchToken = useFetchWsToken();

  useEffect(() => {
    const roomIdFromUrl = searchParams.get('room');
    if (roomIdFromUrl && roomIdFromUrl !== roomId) setRoomId(roomIdFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Buffer for signals that arrive before call handler is ready
  const signalBufferRef = useRef<any[]>([]);

  // call hook
  const overallConnected = wsConnectionStatus === 'connected';
  const call = useCall({ wsRef, userId, roomConnected: overallConnected });

  // keep latest call in ref to avoid stale closures
  const callRef = useRef<any>(null);
  useEffect(() => {
    callRef.current = call;
    // flush buffered signals if handler available
    if (callRef.current && typeof callRef.current.handleSignal === 'function') {
      const buf = signalBufferRef.current.splice(0);
      buf.forEach((m) => {
        try {
          callRef.current.handleSignal(m);
        } catch (err) {
          // non-fatal
          console.warn('Failed to process buffered signal', err);
        }
      });
    }
  }, [call]);

  const handleWsMessage = useCallback(
    (msg: any) => {
      const { type, payload = {} } = msg;

      // forward signaling messages to call handler (single dispatcher)
      if (
        ['offer', 'answer', 'ice-candidate', 'ice', 'call-declined'].includes(
          type
        )
      ) {
        try {
          if (
            callRef.current &&
            typeof callRef.current.handleSignal === 'function'
          ) {
            callRef.current.handleSignal(msg);
          } else {
            // buffer if call handler not ready
            signalBufferRef.current.push(msg);
          }
        } catch (err) {
          console.error('Error forwarding signal to call handler', err);
        }
        return;
      }

      // Editor / document / peers messages
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
        console.warn('Update rejected by server; authoritative doc applied.');
        return;
      }

      if (type === 'error') {
        setError(payload?.message ?? 'Unknown WebSocket error');
        return;
      }

      // other message types: ignore
    },
    // userId is stable (from ref) but we include it to satisfy linter
    [userId]
  );

  const joinRoom = useCallback(async () => {
    if (!roomId?.trim()) {
      setError('Please provide a room id');
      return;
    }

    if (wsRef.current && wsRef.current.isConnected?.()) return;

    setWsConnectionStatus('connecting');
    setError(null);

    // cleanup previous ws if exists
    if (wsRef.current) {
      try {
        wsMessageCleanupRef.current?.();
      } catch (e: any) {
        console.error('Failed to cleanup previous editor WS', e.message);
      }
      try {
        wsRef.current.cleanup();
      } catch (e: any) {
        console.error('Failed to cleanup previous editor WS', e.message);
      }
      wsRef.current = null;
      wsMessageCleanupRef.current = null;
    }

    const token = await fetchToken(userId, roomId).catch(() => null);

    const ws = new WebSocketService(
      userId,
      roomId,
      process.env.NEXT_PUBLIC_SIGNALING_URL || 'ws://localhost:4000'
    );

    // set the ref first so other hooks can observe it
    wsRef.current = ws;

    // register central handler and keep cleanup
    wsMessageCleanupRef.current = ws.addMessageHandler((m) =>
      handleWsMessage(m)
    );

    try {
      await ws.connect(token || undefined);
      try {
        ws.joinRoom();
        ws.requestDoc();
        ws.requestPeers();
      } catch {
        // ignore non-critical
      }
      setWsConnectionStatus('connected');

      // minimal debug helper (optional)
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).wsRefForDebug = wsRef.current;
      } catch (e: any) {
        console.error('Failed to set wsRefForDebug', e.message);
      }
    } catch (e: any) {
      console.error('Editor WebSocket connection failed', e);
      setWsConnectionStatus('disconnected');
      setError((prev) => prev ?? e?.message ?? 'Editor WebSocket failed');
    }
  }, [fetchToken, handleWsMessage, roomId, userId]);

  const leaveRoom = useCallback(() => {
    try {
      try {
        wsMessageCleanupRef.current?.();
      } catch (e: any) {
        console.error('Failed to cleanup previous editor WS', e.message);
      }
      wsMessageCleanupRef.current = null;

      if (wsRef.current) {
        try {
          wsRef.current.leaveRoom();
        } catch (e: any) {
          console.error('Failed to leave room', e.message);
        }
        try {
          wsRef.current.cleanup();
        } catch (e: any) {
          console.error('Failed to cleanup editor WS', e.message);
        }
        wsRef.current = null;
      }
    } catch (e) {
      console.error('Error leaving editor websocket', e);
    } finally {
      setWsConnectionStatus('disconnected');
      setEditorPeers([]);
      docVersionRef.current = null;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (window as any).wsRefForDebug;
      } catch (e: any) {
        console.error('Failed to delete wsRefForDebug', e.message);
      }
    }
  }, []);

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
        setCode(text);
        if (sendDebounce.current) clearTimeout(sendDebounce.current);
        sendDebounce.current = setTimeout(() => {
          try {
            wsRef.current?.sendUpdate(text, docVersionRef.current);
          } catch {
            // ignore
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
    } catch {
      return false;
    }
  }, []);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode((prev) => (prev === newCode ? prev : newCode));
    if (sendDebounce.current) clearTimeout(sendDebounce.current);
    sendDebounce.current = setTimeout(() => {
      try {
        wsRef.current?.sendUpdate(newCode, docVersionRef.current);
      } catch {
        // ignore
      }
      sendDebounce.current = null;
    }, 300);
  }, []);

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

  return (
    <div className="flex flex-col h-screen bg-background">
      <HeaderBar
        roomId={roomId}
        setRoomId={setRoomId}
        joinRoom={joinRoom}
        leaveRoom={leaveRoom}
        overallConnected={overallConnected}
        editorPeersCount={editorPeers.length}
      />

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 text-center">
          {error}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-full md:w-1/4 border-r border-border p-4">
          <PresencePanel
            editorPeers={editorPeers}
            userId={userId}
            wsConnectionStatus={wsConnectionStatus}
          />
          <CallControls
            call={call}
            peers={editorPeers}
            userId={userId}
            roomConnected={overallConnected}
          />
        </aside>

        <PanelGroup direction="vertical" className="flex-1">
          <Panel defaultSize={70} minSize={30} className="overflow-hidden">
            <EditorPanel
              code={code}
              onCodeChange={handleCodeChange}
              onRunCode={executeCode}
              sendData={sendData}
              wsConnectionStatus={wsConnectionStatus}
              userId={userId}
              isExecuting={isExecuting}
            />
          </Panel>

          <PanelResizeHandle className="h-2 bg-gray-100 dark:bg-gray-800 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors" />

          <Panel
            defaultSize={30}
            minSize={10}
            className="overflow-hidden border-t border-gray-200 dark:border-gray-700"
          >
            <ConsolePanel logs={logs} onClear={clearLogs} />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
