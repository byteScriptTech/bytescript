'use client';

import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWebRTC } from '@/hooks/useWebRTC';

import {
  CollaborativeCodeEditor,
  type RemoteCursor,
} from './CollaborativeCodeEditor';

// ConnectionStatus type is defined in useWebRTC

export function PeerProgrammingRoom() {
  const searchParams = useSearchParams();
  const [roomId, setRoomId] = useState('');
  const [code, setCode] = useState('// Start coding with your peer!');
  const [remoteCursors, setRemoteCursors] = useState<RemoteCursor[]>([]);
  const cursorUpdateTimeouts = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Generate a random user ID for demo purposes
  const userId = `user-${Math.random().toString(36).substr(2, 9)}`;

  const {
    connectionStatus,
    localStream,
    remoteStreams: _remoteStreams, // Prefix with _ to indicate it's intentionally unused
    firstRemoteStream,
    error,
    peers,
    joinRoom: joinRoomRTC,
    leaveRoom: leaveRoomRTC,
    sendData,
    onData,
  } = useWebRTC(roomId, userId);

  // Track if we've set up the data channel handler
  const dataChannelInitialized = useRef(false);

  // Set up video elements when streams change
  useEffect(() => {
    const localVideo = localVideoRef.current;
    const remoteVideo = remoteVideoRef.current;

    if (localVideo && localStream) {
      localVideo.srcObject = localStream;
    }

    // Use the first remote stream if available
    if (remoteVideo && firstRemoteStream) {
      remoteVideo.srcObject = firstRemoteStream;
    } else if (remoteVideo) {
      remoteVideo.srcObject = null;
    }

    return () => {
      if (localVideo) {
        localVideo.srcObject = null;
      }
      if (remoteVideo) {
        remoteVideo.srcObject = null;
      }
    };
  }, [localStream, firstRemoteStream]);

  // Handle incoming data from peers
  useEffect(() => {
    if (!onData || dataChannelInitialized.current) return;

    const handleIncomingData = (from: string, data: string) => {
      try {
        const message = JSON.parse(data);

        if (message.type === 'code-update' && message.code) {
          // Only update code if it's different to prevent cursor jumps
          setCode((prevCode) => {
            return message.code !== prevCode ? message.code : prevCode;
          });
        }
        // Handle cursor updates from peers
        else if (
          message.type === 'cursor-update' &&
          message.userId !== userId
        ) {
          const {
            position,
            selection,
            color,
            name = `User-${message.userId.slice(0, 4)}`,
          } = message;

          // Clear any existing timeout for this user
          if (cursorUpdateTimeouts.current[message.userId]) {
            clearTimeout(cursorUpdateTimeouts.current[message.userId]);
          }

          // Add or update the cursor
          setRemoteCursors((prev) => {
            const existingIndex = prev.findIndex(
              (c) => c.id === message.userId
            );
            const newCursor = {
              id: message.userId,
              name,
              color: color || '#000000',
              position,
              selection,
            };

            if (existingIndex >= 0) {
              const updated = [...prev];
              updated[existingIndex] = newCursor;
              return updated;
            }
            return [...prev, newCursor];
          });

          // Set a timeout to remove the cursor if no updates are received
          cursorUpdateTimeouts.current[message.userId] = setTimeout(() => {
            setRemoteCursors((prev) =>
              prev.filter((c) => c.id !== message.userId)
            );
            delete cursorUpdateTimeouts.current[message.userId];
          }, 3000); // Remove cursor after 3 seconds of inactivity
        }
      } catch (error) {
        console.error('Error handling incoming data:', error);
      }
    };

    // Subscribe to data channel messages
    const cleanup = onData(handleIncomingData);
    dataChannelInitialized.current = true;

    // Cleanup subscription on unmount
    return () => {
      cleanup();
      dataChannelInitialized.current = false;
      // Clear all timeouts
      Object.values(cursorUpdateTimeouts.current).forEach(clearTimeout);
    };
  }, [onData, userId]);

  // Handle code changes and sync with peers
  const handleCodeChange = useCallback(
    (newCode: string) => {
      // Only send if the code has actually changed
      setCode((prevCode) => {
        if (prevCode !== newCode) {
          // Broadcast the change to all connected peers
          sendData(
            JSON.stringify({
              type: 'code-update',
              code: newCode,
            })
          );
          return newCode;
        }
        return prevCode;
      });
    },
    [sendData]
  );

  // Create a new room
  const createRoom = useCallback(async () => {
    if (connectionStatus === 'connected' || connectionStatus === 'connecting') {
      return;
    }

    try {
      setIsCreatingRoom(true);
      // Error is managed by the useWebRTC hook

      // Generate a random room ID
      const newRoomId = Math.random().toString(36).substring(2, 10);
      setRoomId(newRoomId);

      // Update URL with the new room ID
      window.history.pushState({}, '', `?room=${newRoomId}`);

      // Join the room
      await joinRoomRTC();
    } catch (err) {
      console.error('Failed to create room:', err);
      // Error is already handled by the useWebRTC hook
    } finally {
      setIsCreatingRoom(false);
    }
  }, [joinRoomRTC, connectionStatus]);

  // Join an existing room
  const joinRoom = useCallback(async () => {
    if (
      !roomId.trim() ||
      connectionStatus === 'connected' ||
      connectionStatus === 'connecting'
    ) {
      return;
    }

    try {
      // Error is managed by the useWebRTC hook
      // Note: roomId and userId are already provided to the useWebRTC hook
      await joinRoomRTC();
    } catch (err) {
      console.error('Failed to join room:', err);
      // Error is already handled by the useWebRTC hook
    }
  }, [roomId, userId, joinRoomRTC, connectionStatus]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
    }
  }, [localStream]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff((prev) => !prev);
    }
  }, [localStream]);

  // End call
  const endCall = useCallback(() => {
    try {
      leaveRoomRTC();
      setRoomId('');
      // Error state is managed by the useWebRTC hook
      // Update URL to remove room ID
      window.history.pushState({}, '', window.location.pathname);
    } catch (err) {
      console.error('Error leaving room:', err);
      // Error is already handled by the useWebRTC hook
    }
  }, [leaveRoomRTC]);

  // Check for room ID in URL
  useEffect(() => {
    const roomIdFromUrl = searchParams.get('room');
    if (roomIdFromUrl && roomIdFromUrl !== roomId) {
      setRoomId(roomIdFromUrl);
      // Don't auto-join here, let the user click the Join button
    }
  }, [searchParams, roomId]);

  // add near top of component
  const disconnectTimerRef = useRef<number | null>(null);

  // Clean up on unmount — debounce the actual leave to avoid aborting in-progress connects
  useEffect(() => {
    // Clear any lingering timer when component mounts
    if (disconnectTimerRef.current) {
      clearTimeout(disconnectTimerRef.current);
      disconnectTimerRef.current = null;
    }

    return () => {
      try {
        if (
          connectionStatus === 'connected' ||
          connectionStatus === 'connecting'
        ) {
          disconnectTimerRef.current = window.setTimeout(() => {
            try {
              leaveRoomRTC();
              disconnectTimerRef.current = null;
            } catch (err) {
              console.error('Error during delayed leaveRoomRTC():', err);
            }
          }, 250); // 250ms debounce
        }
      } catch (err) {
        console.error('Error during cleanup scheduling:', err);
      }
    };
  }, [connectionStatus, leaveRoomRTC]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Peer Programming</h1>
          <div className="flex items-center gap-4">
            {connectionStatus === 'disconnected' ? (
              <div className="flex gap-2">
                <div className="flex-1 max-w-xs">
                  <Input
                    placeholder="Enter Room ID"
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
                    disabled={
                      !roomId.trim() || connectionStatus !== 'disconnected'
                    }
                    className="relative"
                  >
                    <VideoIcon className="mr-2 h-4 w-4" />
                    Join Room
                  </Button>
                  <div className="relative">
                    <div className="absolute -top-2 -right-2 h-3 w-3 rounded-full bg-green-500 animate-ping"></div>
                    <Button
                      onClick={createRoom}
                      variant="default"
                      disabled={
                        !roomId.trim() || connectionStatus !== 'disconnected'
                      }
                      className="relative"
                    >
                      {isCreatingRoom ? (
                        <>
                          <span className="inline-flex items-center">
                            <span className="h-4 w-4 rounded-full border-2 border-t-transparent border-current animate-spin mr-2"></span>
                            Creating...
                          </span>
                        </>
                      ) : (
                        'Create Room'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-3 w-3 rounded-full ${
                    connectionStatus === 'connected'
                      ? 'bg-green-500'
                      : 'bg-yellow-500'
                  }`}
                />
                <span>
                  {connectionStatus === 'connected'
                    ? `Connected to: ${roomId} (${peers.length} peer${peers.length !== 1 ? 's' : ''})`
                    : 'Connecting...'}
                </span>
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
        {/* Video call section */}
        <div className="w-full md:w-1/3 border-r border-border p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">
            {connectionStatus === 'connected'
              ? `Participants (${peers.length + 1})`
              : 'Video Call'}
          </h2>
          <div className="flex-1 grid grid-cols-1 gap-4">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              {firstRemoteStream ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  aria-label="Remote participant video"
                >
                  <track kind="captions" />
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
                    className={`w-full h-full object-cover ${
                      isVideoOff ? 'bg-muted' : ''
                    }`}
                    aria-label="Your video"
                  >
                    <track kind="captions" />
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted/50">
                    <div className="h-8 w-8 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">You</span>
                    </div>
                  </div>
                )}
                {isVideoOff && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
                    <VideoOff className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={isMuted ? 'secondary' : 'outline'}
                size="sm"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <MicOff className="h-4 w-4 mr-2" />
                ) : (
                  <Mic className="h-4 w-4 mr-2" />
                )}
                {isMuted ? 'Unmute' : 'Mute'}
              </Button>
              <Button
                variant={isVideoOff ? 'secondary' : 'outline'}
                size="sm"
                onClick={toggleVideo}
              >
                {isVideoOff ? (
                  <VideoOff className="h-4 w-4 mr-2" />
                ) : (
                  <VideoIcon className="h-4 w-4 mr-2" />
                )}
                {isVideoOff ? 'Start Video' : 'Stop Video'}
              </Button>
              {connectionStatus === 'connected' && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-auto"
                  onClick={endCall}
                >
                  <PhoneOff className="h-4 w-4 mr-2" />
                  End Call
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Code editor section */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold">Collaborative Editor</h2>
            {connectionStatus === 'connected' && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                <span>
                  Connected with {peers.length} peer
                  {peers.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 relative">
            <div className="h-full w-full">
              <CollaborativeCodeEditor
                code={code}
                onCodeChange={handleCodeChange}
                remoteCursors={remoteCursors}
                language="javascript"
                height="100%"
                theme="light"
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
