import { renderHook, act } from '@testing-library/react';

import { useCall } from '../useCall';

type MediaStreamTrackState = 'live' | 'ended';
type MediaTrackConstraints = Record<string, any>;
type MediaTrackCapabilities = Record<string, any>;
type MediaTrackSettings = Record<string, any>;
type AddEventListenerOptions =
  | boolean
  | { capture?: boolean; once?: boolean; passive?: boolean };
type EventListenerOptions = boolean | { capture?: boolean };

// Use the global MediaStreamTrack type
type MediaStreamTrackEventMap = globalThis.MediaStreamTrackEventMap;

// Test data
const TEST_USER_ID = 'test-user';
const TEST_PEER_ID = 'peer-user';
const TEST_OFFER = { type: 'offer', sdp: 'test-sdp' };
const TEST_ANSWER = { type: 'answer', sdp: 'test-answer' };

// Mock WebSocket
const mockSend = jest.fn();
const mockAddMessageHandler = jest.fn();
const mockWsRef = {
  current: {
    send: mockSend,
    sendRaw: mockSend,
    addMessageHandler: mockAddMessageHandler,
  },
};

// Mock MediaStream
class MockMediaStream {
  tracks: MockMediaStreamTrack[] = [];

  addTrack(track: MockMediaStreamTrack) {
    this.tracks.push(track);
  }

  getTracks() {
    return this.tracks;
  }

  getAudioTracks() {
    return this.tracks.filter((t) => t.kind === 'audio');
  }

  removeTrack() {}
}

// Mock MediaStreamTrack
class MockMediaStreamTrack implements MediaStreamTrack {
  id = `mock-track-${Math.random().toString(36).substr(2, 9)}`;
  kind: 'audio' | 'video' = 'audio';
  enabled = true;
  muted = false;
  contentHint: string = '';
  label: string = 'mock-track';
  readyState: MediaStreamTrackState = 'live';
  onmute: ((this: MediaStreamTrack, ev: Event) => any) | null = null;
  onunmute: ((this: MediaStreamTrack, ev: Event) => any) | null = null;
  onended: ((this: MediaStreamTrack, ev: Event) => any) | null = null;
  oncapturehandlechange: ((this: MediaStreamTrack, ev: Event) => any) | null =
    null;

  // Required methods
  stop = jest.fn();

  clone = (): MediaStreamTrack => {
    const track = new MockMediaStreamTrack();
    track.kind = this.kind;
    track.enabled = this.enabled;
    track.muted = this.muted;
    track.contentHint = this.contentHint;
    return track;
  };

  // Additional required methods with mock implementations
  applyConstraints(_constraints?: MediaTrackConstraints): Promise<void> {
    return Promise.resolve();
  }

  getCapabilities(): MediaTrackCapabilities {
    return {} as MediaTrackCapabilities;
  }

  getConstraints(): MediaTrackConstraints {
    return {} as MediaTrackConstraints;
  }

  getSettings(): MediaTrackSettings {
    return {} as MediaTrackSettings;
  }

  addEventListener<K extends keyof MediaStreamTrackEventMap>(
    _type: K,
    _listener: (this: MediaStreamTrack, ev: MediaStreamTrackEventMap[K]) => any,
    _options?: boolean | AddEventListenerOptions
  ): void {
    // Mock implementation
  }

  removeEventListener<K extends keyof MediaStreamTrackEventMap>(
    _type: K,
    _listener: (this: MediaStreamTrack, ev: MediaStreamTrackEventMap[K]) => any,
    _options?: boolean | EventListenerOptions
  ): void {
    // Mock implementation
  }

  dispatchEvent(_event: Event): boolean {
    return true;
  }
}

// Add global mocks
global.MediaStream = MockMediaStream as any;

// Mock MediaStream
const mockMediaStream = {
  getTracks: jest.fn(() => [new MockMediaStreamTrack()]),
  getAudioTracks: jest.fn(() => [new MockMediaStreamTrack()]),
  addTrack: jest.fn(),
  removeTrack: jest.fn(),
};

// Mock RTCPeerConnection
const mockRTCPeerConnection = {
  createOffer: jest.fn().mockResolvedValue(TEST_OFFER),
  createAnswer: jest.fn().mockResolvedValue(TEST_ANSWER),
  setLocalDescription: jest.fn().mockResolvedValue(undefined),
  setRemoteDescription: jest.fn().mockResolvedValue(undefined),
  addIceCandidate: jest.fn().mockResolvedValue(undefined),
  addTrack: jest.fn(),
  removeTrack: jest.fn(),
  getSenders: jest.fn(() => []),
  close: jest.fn(),
  connectionState: 'connected',
  iceConnectionState: 'connected',
};

describe('useCall', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSend.mockClear();
    mockAddMessageHandler.mockClear();

    // Reset all mock implementations
    mockMediaStream.getTracks.mockClear();
    mockMediaStream.getAudioTracks.mockClear();
    mockMediaStream.addTrack.mockClear();
    mockMediaStream.removeTrack.mockClear();

    // Setup global mocks
    global.RTCPeerConnection = class MockRTCPeerConnection {
      static generateCertificate = jest.fn().mockResolvedValue({});

      constructor() {
        return {
          ...mockRTCPeerConnection,
          // Reset mock for each test
          createOffer: jest.fn().mockResolvedValue(TEST_OFFER),
          createAnswer: jest.fn().mockResolvedValue(TEST_ANSWER),
        };
      }
    } as unknown as typeof RTCPeerConnection;

    Object.defineProperty(global.navigator, 'mediaDevices', {
      value: {
        getUserMedia: jest.fn().mockResolvedValue(mockMediaStream),
      },
      writable: true,
      configurable: true,
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() =>
      useCall({
        wsRef: mockWsRef as any,
        userId: TEST_USER_ID,
        roomConnected: true,
      })
    );

    expect(result.current.inCallWith).toBeInstanceOf(Set);
    expect(result.current.inCallWith.size).toBe(0);
  });

  it('should set up peer connection when starting a call', async () => {
    // Setup mock for getUserMedia
    const mockStream = new MediaStream();
    const mockTrack = new MockMediaStreamTrack();
    mockStream.addTrack(mockTrack);

    // Mock the RTCPeerConnection instance
    const mockPc = {
      ...mockRTCPeerConnection,
      addTrack: jest.fn(),
      onicecandidate: jest.fn(),
    };

    // Mock the createOffer method to call the success callback
    mockPc.createOffer.mockImplementation((options, successCallback) => {
      if (successCallback) {
        successCallback(TEST_OFFER);
      }
      return Promise.resolve(TEST_OFFER);
    });

    // Mock RTCPeerConnection constructor to return our mock
    const mockPcConstructor = jest.fn().mockImplementation(() => mockPc);
    global.RTCPeerConnection = mockPcConstructor as any;

    // Mock getUserMedia to return our mock stream
    global.navigator.mediaDevices.getUserMedia = jest
      .fn()
      .mockResolvedValue(mockStream);

    const { result } = renderHook(() =>
      useCall({
        wsRef: mockWsRef as any,
        userId: TEST_USER_ID,
        roomConnected: true,
      })
    );

    await act(async () => {
      await result.current.startCall([TEST_PEER_ID]);
    });

    // Verify peer connection was created with correct config
    expect(global.RTCPeerConnection).toHaveBeenCalledWith({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    // Verify media stream was requested
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
      audio: true,
    });

    // Verify track was added to peer connection
    expect(mockPc.addTrack).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: 'audio',
        readyState: 'live',
      }),
      expect.any(MockMediaStream)
    );

    // Verify offer was created and local description was set
    expect(mockPc.createOffer).toHaveBeenCalled();
    expect(mockPc.setLocalDescription).toHaveBeenCalledWith(TEST_OFFER);

    // Verify WebSocket message was sent with the offer
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'offer',
        to: TEST_PEER_ID,
        from: TEST_USER_ID,
        payload: {
          sdp: TEST_OFFER,
        },
      })
    );

    // Verify we're now in a call with the peer
    expect(result.current.inCallWith.has(TEST_PEER_ID)).toBe(true);
    expect(result.current.isCalling).toBe(true);
  });

  it('should handle incoming calls', () => {
    let messageHandler: (msg: any) => void = () => {};

    mockAddMessageHandler.mockImplementation((handler) => {
      messageHandler = handler;
      return () => {};
    });

    const { result } = renderHook(() =>
      useCall({
        wsRef: mockWsRef as any,
        userId: 'test-user',
        roomConnected: true,
      })
    );

    // Simulate incoming call with the correct format
    act(() => {
      messageHandler({
        type: 'offer',
        from: 'peer1',
        to: 'test-user',
        payload: {
          sdp: {
            type: 'offer',
            sdp: 'test-sdp',
          },
        },
      });
    });

    expect(result.current.incomingCalls).toContain('peer1');
  });

  it('should toggle microphone mute state', async () => {
    const { result } = renderHook(() =>
      useCall({
        wsRef: mockWsRef as any,
        userId: 'test-user',
        roomConnected: true,
      })
    );

    // Toggle mute
    await act(async () => {
      await result.current.toggleMicMute(true);
    });

    // Toggle unmute
    await act(async () => {
      await result.current.toggleMicMute(false);
    });
  });
});
