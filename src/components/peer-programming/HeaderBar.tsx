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
                  onClick={joinRoom}
                  variant="outline"
                  disabled={!roomId.trim()}
                  className="relative"
                >
                  Join Room
                </Button>
                <Button
                  onClick={() => setRoomId(uuidv4().slice(0, 8))}
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
                  ? `Connected: ${editorPeersCount} peer${editorPeersCount !== 1 ? 's' : ''}`
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
  );
}
