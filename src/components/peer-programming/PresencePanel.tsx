import React from 'react';

type Props = {
  wsConnectionStatus: 'disconnected' | 'connecting' | 'connected';
  editorPeers: string[];
  userId: string;
};

export default function PresencePanel({
  wsConnectionStatus,
  editorPeers,
  userId,
}: Props) {
  return (
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
          {editorPeers?.length === 0 ? (
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
  );
}
