import React, { useEffect, useRef, useState } from 'react';

type CallAPI = {
  inCallWith: Set<string> | any;
  incomingCalls: string[] | any;
  isCalling: boolean;
  getLocalStream: () => MediaStream | null;
  startCall: (targets: string[]) => Promise<void> | void;
  acceptCall: (callerId: string) => Promise<void> | void;
  declineCall: (callerId: string) => void;
  hangup: () => void;
};

export default function CallControls({
  call,
  peers,
  userId,
  roomConnected,
}: {
  call: CallAPI;
  peers: string[];
  userId: string;
  roomConnected: boolean;
}) {
  const {
    inCallWith,
    incomingCalls,
    getLocalStream,
    startCall,
    acceptCall,
    declineCall,
    hangup,
  } = call || ({} as CallAPI);

  const [showModal, setShowModal] = useState(false);
  const [ringing, setRinging] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const avatarFor = (id: string) => {
    const label = id?.toString?.() ?? '';
    const name = label.replace(/^user-/, '');
    const initials =
      name
        .split(/[^a-z0-9]+/i)
        .filter(Boolean)
        .map((s) => s[0]?.toUpperCase() ?? '')
        .slice(0, 2)
        .join('') || name.slice(0, 2).toUpperCase();
    // color hash
    let hash = 0;
    for (let i = 0; i < label.length; i++)
      hash = (hash << 5) - hash + label.charCodeAt(i);
    const colors = [
      'bg-indigo-500',
      'bg-green-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-sky-500',
      'bg-rose-500',
    ];
    const color = colors[Math.abs(hash) % colors.length];
    return (
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${color}`}
      >
        {initials}
      </div>
    );
  };

  // WebAudio-based ringtone (simple tone loop). This avoids shipping an audio file, but note autoplay policies.
  const startRingtone = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        // resume on user gesture; try to resume anyway
        ctx.resume().catch(() => {});
      }
      if (!oscRef.current) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        // a pleasant ring-ish frequency
        osc.frequency.value = 620;
        gain.gain.value = 0.06;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscRef.current = osc;
        gainRef.current = gain;
      }
    } catch (err) {
      // WebAudio may be blocked; ignore gracefully
      console.debug('[CallControls] ringtone start failed', err);
    }
  };

  const stopRingtone = () => {
    try {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
        } catch (err: any) {
          console.warn('stopRingtone·failed', err.message);
        }
        try {
          oscRef.current.disconnect();
        } catch (err: any) {
          console.warn('stopRingtone·failed', err.message);
        }
        oscRef.current = null;
      }
      if (gainRef.current) {
        try {
          gainRef.current.disconnect();
        } catch (err: any) {
          console.warn('stopRingtone·failed', err.message);
        }
        gainRef.current = null;
      }
      // do not close AudioContext; reuse if resumed later
    } catch (err: any) {
      console.debug('[CallControls] ringtone stop failed', err.message);
    }
  };

  // Manage ringing state (play/stop)
  useEffect(() => {
    const hasIncoming =
      Array.isArray(incomingCalls) && incomingCalls.length > 0;
    setShowModal(hasIncoming);
    if (hasIncoming) {
      setRinging(true);
      startRingtone();
      // flash title for attention
      try {
        const old = document.title;
        let frame = 0;
        const t = setInterval(() => {
          if (!document.hidden) {
            // only flash while tab hidden to be less noisy
            document.title =
              frame % 2 === 0 ? `Incoming call (${incomingCalls.length})` : old;
            frame += 1;
          }
        }, 1000);
        return () => {
          clearInterval(t);
          document.title = old;
        };
      } catch (err: any) {
        console.warn('flashTitle·failed', err.message);
      }
    } else {
      setRinging(false);
      stopRingtone();
    }
  }, [incomingCalls]);

  // Listen for incoming-call DOM event (optional)
  useEffect(() => {
    const onIncoming = (ev: any) => {
      // ensure modal visible; real state updated by incomingCalls too
      setShowModal(true);
      setRinging(true);
      startRingtone();
      console.debug('[CallControls] incoming-call event', ev?.detail);
    };
    window.addEventListener('incoming-call', onIncoming);
    return () => window.removeEventListener('incoming-call', onIncoming);
  }, []);

  // Toggle local mic mute/unmute by disabling audio tracks
  const toggleMic = async () => {
    try {
      const s = getLocalStream?.();
      if (!s) return;
      const tracks = s.getAudioTracks();
      if (!tracks || !tracks.length) return;
      const muted = !tracks[0].enabled;
      tracks.forEach((t) => (t.enabled = muted));
      setMicMuted(!muted);
    } catch (err: any) {
      console.warn('toggleMic·failed', err.message);
    }
  };

  const handleAccept = async (caller: string) => {
    try {
      await acceptCall(caller);
    } catch (e) {
      console.error('Accept failed', e);
    }
  };

  const handleDecline = (caller: string) => {
    try {
      declineCall(caller);
    } catch (e) {
      console.error('Decline failed', e);
    }
  };

  const acceptAll = async () => {
    try {
      if (!Array.isArray(incomingCalls)) return;
      for (const c of incomingCalls.slice()) {
        // accept in series to avoid racing
        // eslint-disable-next-line no-await-in-loop
        await acceptCall(c);
      }
    } catch (err) {
      console.error('Accept all failed', err);
    }
  };

  const declineAll = () => {
    try {
      if (!Array.isArray(incomingCalls)) return;
      for (const c of incomingCalls.slice()) {
        declineCall(c);
      }
    } catch (err) {
      console.error('Decline all failed', err);
    }
  };

  const callAll = () => {
    const targets = peers?.filter((p: string) => p !== userId) ?? [];
    if (!targets.length) return;
    startCall(targets);
  };

  const inCallCount = inCallWith ? (inCallWith as Set<string>).size : 0;

  return (
    <div className="p-3 border-t">
      <h4 className="font-semibold text-sm mb-1">Call</h4>
      <div className="mb-3 text-xs text-muted">
        {roomConnected ? 'Ready' : 'Join room to enable calls'}
      </div>

      <div className="mb-3">
        <div className="text-sm font-medium">Peers</div>
        <div className="text-xs text-muted">{peers?.length ?? 0} peers</div>
      </div>

      <div className="flex gap-2 items-center">
        {inCallCount > 0 ? (
          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:opacity-95 transition"
            onClick={() => hangup()}
            title="Hang up"
          >
            Hang up ({inCallCount})
          </button>
        ) : (
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded hover:opacity-95 transition"
            onClick={callAll}
            disabled={!roomConnected || (peers?.length ?? 0) === 0}
            title="Call all peers"
          >
            Call all
          </button>
        )}

        <button
          className="px-2 py-1 border rounded text-sm ml-auto"
          onClick={toggleMic}
          title={micMuted ? 'Unmute local mic' : 'Mute local mic'}
        >
          {micMuted ? 'Mic Off' : 'Mic On'}
        </button>
      </div>

      {/* Incoming call modal */}
      {showModal &&
        Array.isArray(incomingCalls) &&
        incomingCalls.length > 0 && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-live="assertive"
            role="dialog"
            aria-label="Incoming call"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

            <div
              className="relative w-full max-w-lg mx-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl ring-1 ring-black/10 overflow-hidden animate-fadeIn"
              style={{ transform: 'translateY(0)', zIndex: 60 }}
            >
              <div className="p-4 flex gap-4 items-center">
                <div className="flex-shrink-0">
                  {avatarFor(incomingCalls[0])}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold leading-none">
                        Incoming call
                      </div>
                      <div className="text-sm text-muted">
                        {incomingCalls.length > 1
                          ? `${incomingCalls.length} callers`
                          : `From ${incomingCalls[0]}`}
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted">
                      {ringing ? <span>Ringing…</span> : <span>Waiting</span>}
                    </div>
                  </div>

                  {/* list of callers */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {incomingCalls.map((c: string) => (
                      <div
                        key={c}
                        className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 px-3 py-1 rounded-full text-sm"
                      >
                        <div className="w-6 h-6 rounded-full bg-slate-400 text-white flex items-center justify-center text-xs font-semibold">
                          {c
                            .replace(/^user-/, '')
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div className="truncate max-w-[180px]">{c}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:scale-[1.02] transition-transform"
                    onClick={() => handleAccept(incomingCalls[0])}
                  >
                    Accept
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:opacity-95"
                    onClick={() => handleDecline(incomingCalls[0])}
                  >
                    Decline
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 text-sm bg-white/5 border rounded"
                    onClick={() => acceptAll()}
                    title="Accept all calls"
                  >
                    Accept all
                  </button>
                  <button
                    className="px-3 py-1 text-sm bg-white/5 border rounded"
                    onClick={() => declineAll()}
                    title="Decline all calls"
                  >
                    Decline all
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
