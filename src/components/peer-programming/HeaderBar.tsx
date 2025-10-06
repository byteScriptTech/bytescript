import { Copy } from 'lucide-react';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = {
  roomId: string;
  setRoomId: (v: string) => void;
  joinRoom: () => void;
  leaveRoom: () => void;
  overallConnected: boolean;
  editorPeersCount: number;
};

export default function HeaderBar({
  roomId,
  setRoomId,
  joinRoom,
  leaveRoom,
  overallConnected,
  editorPeersCount,
}: Props) {
  return (
    <header className="border-b border-border p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Peer Programming</h1>
        <div className="flex items-center gap-4">
          {!overallConnected ? (
            <div className="flex gap-2">
              <div className="flex-1 max-w-xs">
                <Input
                  data-testid="room-id-input"
                  placeholder="Enter Room ID or create one"
                  value={roomId}
                  onChange={(e) =>
                    setRoomId((e.target as HTMLInputElement).value)
                  }
                  onKeyDown={(e) => (e.key === 'Enter' ? joinRoom() : null)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  data-testid="join-room-button"
                  onClick={joinRoom}
                  variant="outline"
                  disabled={!roomId.trim()}
                  className="relative"
                >
                  Join Room
                </Button>
                <Button
                  data-testid="create-room-button"
                  onClick={() => setRoomId(uuidv4().slice(0, 8))}
                  variant="ghost"
                >
                  Create
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    overallConnected ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                />
                <span data-testid="peer-count" className="text-sm font-medium">
                  {editorPeersCount} peer{editorPeersCount !== 1 ? 's' : ''}{' '}
                  connected
                </span>
              </div>

              <div className="flex items-center gap-2 bg-muted/50 rounded-md px-3 py-1.5">
                <span
                  data-testid="room-id-display"
                  className="text-sm font-mono text-muted-foreground"
                >
                  Room: {roomId}
                </span>
                <Button
                  data-testid="copy-room-id-button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={async () => {
                    await navigator.clipboard.writeText(roomId);
                    // Optional: Add toast notification
                    // toast.success('Room ID copied to clipboard');
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span className="sr-only">Copy room ID</span>
                </Button>
              </div>

              <Button
                data-testid="leave-room-button"
                variant="outline"
                size="sm"
                onClick={leaveRoom}
                className="h-9"
              >
                Leave Room
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
