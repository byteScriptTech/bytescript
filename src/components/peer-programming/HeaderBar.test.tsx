import { render, screen, fireEvent } from '@testing-library/react';

import HeaderBar from './HeaderBar';

// Mock the Copy icon
jest.mock('lucide-react', () => ({
  Copy: jest.fn(() => <div data-testid="copy-icon">CopyIcon</div>),
}));

// Mock the uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-room-id'),
}));

// Mock the clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('HeaderBar', () => {
  const defaultProps = {
    roomId: 'test-room',
    setRoomId: jest.fn(),
    joinRoom: jest.fn(),
    leaveRoom: jest.fn(),
    overallConnected: false,
    editorPeersCount: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header with initial state', () => {
    render(<HeaderBar {...defaultProps} />);

    expect(screen.getByTestId('room-id-input')).toBeInTheDocument();
    expect(screen.getByTestId('join-room-button')).toBeInTheDocument();
    expect(screen.getByTestId('create-room-button')).toBeInTheDocument();
  });

  it('allows entering a room ID', () => {
    const setRoomId = jest.fn();
    render(<HeaderBar {...defaultProps} setRoomId={setRoomId} />);

    const input = screen.getByTestId('room-id-input');
    fireEvent.change(input, { target: { value: 'new-room' } });

    expect(setRoomId).toHaveBeenCalledWith('new-room');
  });

  it('calls joinRoom when join button is clicked', () => {
    const joinRoom = jest.fn();
    render(
      <HeaderBar {...defaultProps} roomId="existing-room" joinRoom={joinRoom} />
    );

    const joinButton = screen.getByTestId('join-room-button');
    fireEvent.click(joinButton);

    expect(joinRoom).toHaveBeenCalled();
  });

  it('disables join button when room ID is empty', () => {
    render(<HeaderBar {...defaultProps} roomId="" />);

    const joinButton = screen.getByTestId('join-room-button');
    expect(joinButton).toBeDisabled();
  });

  it('generates a new room ID when create button is clicked', () => {
    const setRoomId = jest.fn();
    render(<HeaderBar {...defaultProps} setRoomId={setRoomId} />);

    const createButton = screen.getByTestId('create-room-button');
    fireEvent.click(createButton);

    // The component slices the first 8 characters of the UUID
    expect(setRoomId).toHaveBeenCalledWith('test-roo');
    // Also verify that the mock was called
    expect(require('uuid').v4).toHaveBeenCalled();
  });

  describe('when connected', () => {
    const connectedProps = {
      ...defaultProps,
      overallConnected: true,
      editorPeersCount: 2,
    };

    it('shows the connected state with peer count', () => {
      render(<HeaderBar {...connectedProps} />);

      expect(screen.getByTestId('peer-count').textContent).toBe(
        '2 peers connected'
      );
      expect(screen.getByTestId('room-id-display').textContent).toBe(
        'Room: test-room'
      );
      expect(screen.getByTestId('leave-room-button')).toBeInTheDocument();
    });

    it('shows single peer count correctly', () => {
      render(<HeaderBar {...connectedProps} editorPeersCount={1} />);

      expect(screen.getByTestId('peer-count').textContent).toBe(
        '1 peer connected'
      );
    });

    it('copies room ID to clipboard when copy button is clicked', async () => {
      render(<HeaderBar {...connectedProps} />);

      const copyButton = screen.getByTestId('copy-room-id-button');
      fireEvent.click(copyButton);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test-room');
    });

    it('calls leaveRoom when leave button is clicked', () => {
      const leaveRoom = jest.fn();
      render(<HeaderBar {...connectedProps} leaveRoom={leaveRoom} />);

      const leaveButton = screen.getByTestId('leave-room-button');
      fireEvent.click(leaveButton);

      expect(leaveRoom).toHaveBeenCalled();
    });
  });
});
