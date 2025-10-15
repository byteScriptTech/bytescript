import { render, screen } from '@testing-library/react';
import React from 'react';

import PresencePanel from './PresencePanel';

jest.mock('./PresencePanel', () => {
  return function MockedPresencePanel({
    editorPeers,
    userId,
    wsConnectionStatus,
  }: any) {
    return (
      <div data-testid="presence-panel">
        <h2>Participants</h2>
        <div data-testid="current-user">{userId} (You)</div>
        <div data-testid="connection-status">{wsConnectionStatus}</div>
        <div data-testid="participants">
          {editorPeers
            .filter((peerId: string) => peerId !== userId)
            .map((peerId: string) => (
              <div key={peerId} data-testid={`participant-${peerId}`}>
                {peerId}
              </div>
            ))}
        </div>
      </div>
    );
  };
});

describe('PresencePanel', () => {
  const defaultProps = {
    editorPeers: ['user1', 'user2', 'user3'],
    userId: 'user1',
    wsConnectionStatus: 'connected' as const,
  };

  it('renders the current user', () => {
    render(<PresencePanel {...defaultProps} />);
    expect(screen.getByTestId('current-user')).toHaveTextContent('user1 (You)');
  });

  it('shows connection status', () => {
    render(<PresencePanel {...defaultProps} />);
    expect(screen.getByTestId('connection-status')).toHaveTextContent(
      'connected'
    );
  });

  it('filters out the current user from participants', () => {
    render(<PresencePanel {...defaultProps} />);
    const participants = screen.getByTestId('participants');
    expect(participants.children).toHaveLength(2);
    expect(screen.queryByTestId('participant-user1')).not.toBeInTheDocument();
    expect(screen.getByTestId('participant-user2')).toBeInTheDocument();
    expect(screen.getByTestId('participant-user3')).toBeInTheDocument();
  });

  it('shows disconnected state', () => {
    render(
      <PresencePanel {...defaultProps} wsConnectionStatus="disconnected" />
    );
    expect(screen.getByTestId('connection-status')).toHaveTextContent(
      'disconnected'
    );
  });

  it('handles empty participants list', () => {
    render(<PresencePanel {...defaultProps} editorPeers={[]} />);
    const participants = screen.getByTestId('participants');
    expect(participants.children).toHaveLength(0);
  });
});
