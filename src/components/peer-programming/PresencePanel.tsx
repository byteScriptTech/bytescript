import React from 'react';

import { cn } from '@/lib/utils';

type Props = {
  wsConnectionStatus: 'disconnected' | 'connecting' | 'connected';
  editorPeers: string[];
  userId: string;
};

// Helper function to get user initials
const getInitials = (name: string) => {
  if (!name) return '??';
  const parts = name.split(/[ -]/);
  let initials = '';
  for (let i = 0; i < Math.min(2, parts.length); i++) {
    if (parts[i].length > 0) {
      initials += parts[i][0].toUpperCase();
    }
  }
  return initials || '??';
};

// Helper function to generate a consistent color from a string
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
};

// Avatar component
const Avatar = ({ name, isYou = false }: { name: string; isYou?: boolean }) => {
  const initials = getInitials(name);
  const bgColor = stringToColor(name);

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-xs',
          'flex-shrink-0',
          isYou ? 'ring-2 ring-primary' : ''
        )}
        style={{ backgroundColor: bgColor }}
        title={isYou ? `${name} (You)` : name}
      >
        {initials}
      </div>
      <span className={cn('text-sm', isYou ? 'font-medium' : '')}>
        {isYou ? 'You' : name}
      </span>
    </div>
  );
};
export default function PresencePanel({
  wsConnectionStatus,
  editorPeers,
  userId,
}: Props) {
  // Filter out the current user from the participants list
  const otherParticipants = editorPeers.filter((peerId) => peerId !== userId);
  const totalParticipants = otherParticipants.length + 1; // +1 for current user

  return (
    <div className="w-full h-full">
      <h2 className="text-lg font-semibold mb-4">Participants</h2>

      <div className="space-y-4">
        {/* Current User */}
        <div className="p-3 rounded-lg bg-muted/30">
          <Avatar name={userId} isYou />
        </div>

        {/* Other Participants */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">
              {wsConnectionStatus === 'connected'
                ? `Others (${otherParticipants.length})`
                : 'Not connected'}
            </p>
            {wsConnectionStatus === 'connected' && (
              <span className="text-xs text-muted-foreground">
                {totalParticipants} total
              </span>
            )}
          </div>

          <div className="space-y-2">
            {wsConnectionStatus !== 'connected' ? (
              <p className="text-sm text-muted-foreground">
                Connect to see other participants
              </p>
            ) : otherParticipants.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No other participants yet
              </p>
            ) : (
              <div className="space-y-2">
                {otherParticipants.map((peerId) => (
                  <div key={peerId} className="py-1.5">
                    <Avatar name={peerId} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
