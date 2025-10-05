import { useCallback, useEffect, useRef, useState } from 'react';
type RTCConfiguration = any;
type RTCSessionDescriptionInit = any;
type RTCIceCandidateInit = any;

interface HTMLAudioElement extends HTMLMediaElement {
  playsInline: boolean;
}

function getField(obj: any, names: string[]) {
  if (!obj) return undefined;
  for (const n of names) {
    if (Object.prototype.hasOwnProperty.call(obj, n)) return obj[n];
    if (obj[n] !== undefined) return obj[n];
  }
  return undefined;
}

type WsRefLike = {
  current: {
    sendRaw: (msg: any) => void;
    addMessageHandler?: (fn: (m: any) => void) => () => void;
  } | null;
};

export function useCall({
  wsRef,
  userId,
  roomConnected,
}: {
  wsRef: WsRefLike;
  userId: string;
  roomConnected: boolean;
}) {
  // public state
  const [inCallWith, setInCallWith] = useState<Set<string>>(new Set());
  const [incomingCalls, setIncomingCalls] = useState<string[]>([]);
  const [isCalling, setIsCalling] = useState(false);

  // internal refs
  const localStreamRef = useRef<MediaStream | null>(null);
  const pcsRef = useRef<Record<string, RTCPeerConnection>>({});
  const remoteStreamsRef = useRef<Record<string, MediaStream>>({});
  const audioElsRef = useRef<Record<string, HTMLAudioElement | null>>({});
  const pendingOffersRef = useRef<
    Record<string, RTCSessionDescriptionInit | null>
  >({});
  const pendingRemoteCandidatesRef = useRef<
    Record<string, RTCIceCandidateInit[]>
  >({});

  const defaultIceServers: RTCConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  function idsMatch(a: any, b: any) {
    if (a == null || b == null) return false;
    const sa = String(a);
    const sb = String(b);
    if (sa === sb) return true;
    if (sa.startsWith('user-') && sa.slice(5) === sb) return true;
    if (sb.startsWith('user-') && sb.slice(5) === sa) return true;
    return false;
  }

  const ensurePeerConnection = useCallback(
    (peerId: string) => {
      if (pcsRef.current[peerId]) return pcsRef.current[peerId];

      const pc = new RTCPeerConnection(defaultIceServers);

      (pc as any).__sentCandidates =
        (pc as any).__sentCandidates || new Set<string>();

      pc.onicecandidate = (ev) => {
        if (!ev.candidate) return;
        const candStr = ev.candidate.candidate;
        const sentSet: Set<string> = (pc as any).__sentCandidates;
        if (sentSet.has(candStr)) return;
        sentSet.add(candStr);

        try {
          const candObj = ev.candidate.toJSON
            ? ev.candidate.toJSON()
            : ev.candidate;
          if (
            wsRef.current &&
            typeof (wsRef.current as any).sendICECandidate === 'function'
          ) {
            (wsRef.current as any).sendICECandidate(
              {
                candidate: candObj.candidate,
                sdpMLineIndex: candObj.sdpMLineIndex ?? null,
                sdpMid: candObj.sdpMid ?? null,
                usernameFragment: (candObj as any).usernameFragment ?? null,
              },
              peerId
            );
          } else {
            wsRef.current?.sendRaw({
              type: 'ice-candidate',
              to: peerId,
              from: userId,
              payload: { candidate: candObj },
            });
          }
        } catch (e) {
          // keep warning but avoid noisy debug
          console.warn('useCall: send ICE candidate failed', e);
        }
      };

      pc.ontrack = (ev) => {
        let stream = remoteStreamsRef.current[peerId];
        if (!stream) {
          stream = new MediaStream();
          remoteStreamsRef.current[peerId] = stream;
        }

        if (ev.streams && ev.streams.length > 0) {
          ev.streams.forEach((s) =>
            s.getTracks().forEach((t) => {
              if (!stream!.getTracks().some((x) => x.id === t.id))
                stream!.addTrack(t);
            })
          );
        } else if (ev.track) {
          if (!stream.getTracks().some((x) => x.id === ev.track.id))
            stream.addTrack(ev.track);
        }

        if (!audioElsRef.current[peerId]) {
          const audio = document.createElement('audio') as HTMLAudioElement;
          audio.autoplay = true;
          audio.playsInline = true;
          audio.style.display = 'none';
          document.body.appendChild(audio);
          audioElsRef.current[peerId] = audio;
        }
        audioElsRef.current[peerId]!.srcObject = stream;
      };

      const buffered = pendingRemoteCandidatesRef.current[peerId];
      if (buffered && buffered.length) {
        buffered.forEach((c) => pc.addIceCandidate(c).catch(() => {}));
        delete pendingRemoteCandidatesRef.current[peerId];
      }

      pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
        if (['disconnected', 'failed', 'closed'].includes(state)) {
          try {
            pc.getSenders().forEach((s) => s.track?.stop());
          } catch (e) {
            console.error('useCall: stop track failed', e);
          }
          try {
            pc.close();
          } catch (e) {
            console.error('useCall: close peer connection failed', e);
          }
          delete pcsRef.current[peerId];

          const audio = audioElsRef.current[peerId];
          if (audio) {
            try {
              audio.pause();
              audio.srcObject = null;
              audio.remove();
            } catch (e) {
              console.error('useCall: remove audio element failed', e);
            }
            delete audioElsRef.current[peerId];
          }
          delete remoteStreamsRef.current[peerId];

          setInCallWith((prev) => {
            const s = new Set(prev);
            s.delete(peerId);
            return s;
          });
        }
      };

      if (localStreamRef.current) {
        localStreamRef.current
          .getTracks()
          .forEach((t) => pc.addTrack(t, localStreamRef.current!));
      }

      pcsRef.current[peerId] = pc;
      return pc;
    },
    [wsRef, userId]
  );

  const ensureLocalStream = useCallback(async () => {
    if (localStreamRef.current) return localStreamRef.current;
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = s;
      Object.values(pcsRef.current).forEach((pc) =>
        s.getTracks().forEach((t) => pc.addTrack(t, s))
      );
      return s;
    } catch (e) {
      console.error('useCall: getUserMedia failed', e);
      throw e;
    }
  }, []);

  const startCall = useCallback(
    async (targets: string[]) => {
      if (!roomConnected) throw new Error('Not connected to room');
      setIsCalling(true);
      await ensureLocalStream();
      for (const target of targets) {
        if (target === userId) continue;
        const pc = ensurePeerConnection(target);
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          if (
            wsRef.current &&
            typeof (wsRef.current as any).sendOffer === 'function'
          ) {
            (wsRef.current as any).sendOffer(
              (offer as any).toJSON ? (offer as any).toJSON() : offer,
              target
            );
          } else {
            wsRef.current?.sendRaw({
              type: 'offer',
              to: target,
              from: userId,
              payload: {
                sdp: (offer as any).toJSON ? (offer as any).toJSON() : offer,
              },
            });
          }
        } catch (e) {
          console.warn('useCall: create/send offer failed for', target, e);
        }
      }
    },
    [ensureLocalStream, ensurePeerConnection, roomConnected, userId, wsRef]
  );

  const acceptCall = useCallback(
    async (callerId: string) => {
      const offer = pendingOffersRef.current[callerId];
      if (!offer) {
        setIncomingCalls((prev) => prev.filter((p) => p !== callerId));
        return;
      }

      try {
        await ensureLocalStream();
        const pc = ensurePeerConnection(callerId);

        const rtcDescCtor = (globalThis as any).RTCSessionDescription;
        const remoteDesc =
          typeof rtcDescCtor !== 'undefined'
            ? new rtcDescCtor(offer)
            : (offer as any);

        await pc.setRemoteDescription(remoteDesc);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        if (
          wsRef.current &&
          typeof (wsRef.current as any).sendAnswer === 'function'
        ) {
          (wsRef.current as any).sendAnswer(
            answer.sdp ? { type: answer.type, sdp: answer.sdp } : answer,
            callerId
          );
        } else {
          wsRef.current?.sendRaw({
            type: 'answer',
            to: callerId,
            from: userId,
            payload: {
              sdp: answer.sdp ? { type: answer.type, sdp: answer.sdp } : answer,
            },
          });
        }

        setInCallWith((prev) => {
          const s = new Set(prev);
          s.add(callerId);
          return s;
        });
      } catch (err) {
        console.error('useCall: acceptCall error for', callerId, err);
        throw err;
      } finally {
        delete pendingOffersRef.current[callerId];
        setIncomingCalls((prev) => prev.filter((p) => p !== callerId));
      }
    },
    [ensureLocalStream, ensurePeerConnection, userId, wsRef]
  );

  const declineCall = useCallback(
    (callerId: string) => {
      delete pendingOffersRef.current[callerId];
      setIncomingCalls((prev) => prev.filter((p) => p !== callerId));
      try {
        wsRef.current?.sendRaw({
          type: 'call-declined',
          to: callerId,
          from: userId,
          payload: {},
        });
      } catch (err) {
        console.error('useCall: declineCall error for', callerId, err);
      }
    },
    [wsRef, userId]
  );

  const hangup = useCallback(() => {
    Object.keys(pcsRef.current).forEach((peerId) => {
      try {
        pcsRef.current[peerId].close();
      } catch (err) {
        console.error('useCall: hangup error for', peerId, err);
      }
      delete pcsRef.current[peerId];
      const audio = audioElsRef.current[peerId];
      if (audio) {
        try {
          audio.pause();
          audio.srcObject = null;
          audio.remove();
        } catch (err) {
          console.error('useCall: hangup error for', peerId, err);
        }
        delete audioElsRef.current[peerId];
      }
      delete remoteStreamsRef.current[peerId];
    });

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }

    setInCallWith(new Set());
    setIsCalling(false);
    setIncomingCalls([]);
  }, []);

  const handleSignal = useCallback(
    (mRaw: any) => {
      const isObject = (x: any) => x && typeof x === 'object';

      let m = mRaw;
      if (mRaw && isObject(mRaw) && 'data' in mRaw) {
        try {
          m = typeof mRaw.data === 'string' ? JSON.parse(mRaw.data) : mRaw.data;
        } catch {
          m = mRaw.data;
        }
      }

      if (!isObject(m) || !('type' in m)) return;

      const type = m.type;
      const from = getField(m, [
        'from',
        'sender',
        'clientId',
        'userId',
        'peerId',
      ]);
      const to = getField(m, ['to', 'target', 'recipient', 'roomMemberId']);
      const payload = m.payload ?? m.data ?? m.payloadData ?? m;

      if (typeof to !== 'undefined' && to !== null && !idsMatch(to, userId))
        return;

      try {
        if (type === 'offer') {
          const sdp =
            payload?.sdp ?? payload?.offer ?? m.sdp ?? m.desc ?? undefined;
          if (!sdp) return;
          const callerId = from ?? 'unknown-' + Date.now();
          pendingOffersRef.current[callerId] = sdp;
          setIncomingCalls((prev) =>
            prev.includes(callerId) ? prev : [...prev, callerId]
          );

          // dispatch a small DOM event so UI can optionally play ringtone / show toast
          try {
            (window as any).dispatchEvent?.(
              new CustomEvent('incoming-call', { detail: { callerId } })
            );
          } catch (err) {
            console.error('useCall: incoming-call event dispatch failed', err);
          }
        } else if (type === 'answer') {
          const sdp = payload?.sdp ?? payload?.answer ?? m.sdp;
          if (!sdp) return;
          const peer = from;
          const pc = pcsRef.current[peer!];
          if (pc) {
            const rtcDescCtor = (globalThis as any).RTCSessionDescription;
            const remoteDesc =
              typeof rtcDescCtor !== 'undefined'
                ? new rtcDescCtor(sdp)
                : (sdp as any);
            pc.setRemoteDescription(remoteDesc).catch(() => {});
            setInCallWith((prev) => {
              const s = new Set(prev);
              if (peer) s.add(peer);
              return s;
            });
          }
        } else if (type === 'ice-candidate' || type === 'ice') {
          const candidate = payload?.candidate ?? m.candidate ?? payload?.ice;
          if (!candidate) return;
          const peer = from;
          const pc = pcsRef.current[peer!];
          if (pc) {
            pc.addIceCandidate(candidate).catch(() => {});
          } else {
            pendingRemoteCandidatesRef.current[peer!] =
              pendingRemoteCandidatesRef.current[peer!] || [];
            pendingRemoteCandidatesRef.current[peer!].push(candidate);
          }
        } else if (type === 'call-declined') {
          setIncomingCalls((prev) => prev.filter((p) => p !== from));
        }
      } catch (err) {
        console.error('useCall: error processing signal', err);
      }
    },
    [wsRef, userId]
  );

  useEffect(() => {
    const ws = wsRef.current;
    if (!ws) return;

    let cleanup: (() => void) | null = null;
    if (typeof (ws as any).addMessageHandler === 'function') {
      cleanup = (ws as any).addMessageHandler((m: any) => handleSignal(m));
    } else if (typeof (ws as any).addEventListener === 'function') {
      const nativeWs = ws as any;
      const handler = (ev: any) => {
        const parsed =
          ev?.data && typeof ev.data === 'string'
            ? (() => {
                try {
                  return JSON.parse(ev.data);
                } catch {
                  return ev.data;
                }
              })()
            : (ev?.data ?? ev);
        handleSignal(parsed);
      };
      nativeWs.addEventListener('message', handler);
      cleanup = () => nativeWs.removeEventListener('message', handler);
    } else if (typeof (ws as any).onmessage !== 'undefined') {
      const nativeWs = ws as any;
      const prev = nativeWs.onmessage;
      nativeWs.onmessage = (ev: any) => {
        const parsed =
          ev?.data && typeof ev.data === 'string'
            ? (() => {
                try {
                  return JSON.parse(ev.data);
                } catch {
                  return ev.data;
                }
              })()
            : (ev?.data ?? ev);
        handleSignal(parsed);
        if (typeof prev === 'function') prev(ev);
      };
      cleanup = () => {
        try {
          nativeWs.onmessage = prev;
        } catch (err) {
          console.error('useCall: cleanup failed', err);
        }
      };
    }

    // keep a tiny test helper — remove if not needed
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__useCall_testIncoming = (payload: any) =>
        handleSignal(payload);
    } catch (err) {
      console.error('useCall: testIncoming event dispatch failed', err);
    }

    return () => {
      try {
        cleanup && cleanup();
      } catch (err) {
        console.error('useCall: cleanup failed', err);
      }
      try {
        delete (window as any).__useCall_testIncoming;
      } catch (err) {
        console.error('useCall: testIncoming event dispatch failed', err);
      }
    };
  }, [wsRef.current, handleSignal]);

  useEffect(() => {
    return () => {
      hangup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    inCallWith,
    incomingCalls,
    isCalling,
    getLocalStream: () => localStreamRef.current,
    startCall,
    acceptCall,
    declineCall,
    hangup,
    handleSignal,
  };
}
