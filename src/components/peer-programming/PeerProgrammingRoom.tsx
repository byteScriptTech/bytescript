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

import { DraggableEditor } from '@/components/editor/DraggableEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWebRTC } from '@/hooks/useWebRTC';

// ConnectionStatus type is defined in useWebRTC

export function PeerProgrammingRoom() {
  const searchParams = useSearchParams();
  const [roomId, setRoomId] = useState('');
  const [code, setCode] = useState('// Start coding with your peer!');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Generate a random user ID for demo purposes
  const userId = `user-${Math.random().toString(36).substr(2, 9)}`;

  const {
    connectionStatus,
    localStream,
    remoteStream,
    error,
    peers,
    joinRoom: joinRoomRTC,
    leaveRoom: leaveRoomRTC,
    sendData,
  } = useWebRTC(roomId, userId);

  // Set up video elements when streams change
  useEffect(() => {
    const localVideo = localVideoRef.current;
    const remoteVideo = remoteVideoRef.current;

    if (localVideo && localStream) {
      localVideo.srcObject = localStream;
    }

    if (remoteVideo && remoteStream) {
      remoteVideo.srcObject = remoteStream;
    }

    return () => {
      if (localVideo) {
        localVideo.srcObject = null;
      }
      if (remoteVideo) {
        remoteVideo.srcObject = null;
      }
    };
  }, [localStream, remoteStream]);

  // Handle code changes and sync with peer
  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode);
      sendData(newCode);
    },
    [sendData]
  );

  // Join room
  const joinRoom = useCallback(() => {
    if (!roomId.trim()) return;
    joinRoomRTC();
  }, [roomId, joinRoomRTC]);

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
    leaveRoomRTC();
    setRoomId('');
  }, [leaveRoomRTC]);

  // Check for room ID in URL
  useEffect(() => {
    const roomIdFromUrl = searchParams.get('room');
    if (roomIdFromUrl) {
      setRoomId(roomIdFromUrl);
    }
  }, [searchParams]);

  // Auto-join if room ID is in URL
  useEffect(() => {
    if (roomId && connectionStatus === 'disconnected') {
      joinRoom();
    }
  }, [roomId, joinRoom, connectionStatus]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Peer Programming</h1>
          <div className="flex items-center gap-4">
            {connectionStatus === 'disconnected' ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
                  className="w-48"
                />
                <Button onClick={joinRoom}>
                  <VideoIcon className="mr-2 h-4 w-4" />
                  Join Room
                </Button>
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
              {remoteStream ? (
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
            <DraggableEditor
              defaultEditorType="javascript"
              defaultPythonCode={code}
              onPythonCodeChange={handleCodeChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
