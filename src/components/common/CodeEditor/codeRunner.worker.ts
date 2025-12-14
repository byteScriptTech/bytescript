/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

// ---------- Preserve native APIs ----------
const nativeSetTimeout = setTimeout;
const nativeSetInterval = setInterval;
const nativeClearTimeout = clearTimeout;
const nativeClearInterval = clearInterval;
const nativeFetch = fetch;

// ---------- State ----------
const timers = new Set<NodeJS.Timeout>();
const intervals = new Set<NodeJS.Timeout>();
const timeMarks = new Map<string, number>();

let lastActivity = Date.now();
let forceKeepAlive = false;
let stopped = false;

const IDLE_TIMEOUT_MS = 2000;
const WATCHDOG_INTERVAL_MS = 500;

let watchdog: NodeJS.Timeout | null = null;

// ---------- Helpers ----------
const post = (type: string, payload?: any) => {
  (self as any).postMessage({ type, payload });
};

const markAlive = () => {
  lastActivity = Date.now();
};

// ---------- Lazy watchdog ----------
const startWatchdog = () => {
  if (watchdog !== null) return;

  watchdog = nativeSetInterval(() => {
    if (stopped) return;

    if (!forceKeepAlive && Date.now() - lastActivity > IDLE_TIMEOUT_MS) {
      cleanupAndExit('idle-timeout');
    }
  }, WATCHDOG_INTERVAL_MS);
};

// ---------- Explicit keepAlive ----------
(self as any).keepAlive = () => {
  forceKeepAlive = true;
  startWatchdog();
  post('status', 'keep-alive-enabled');
};

// ---------- Console ----------
const sandboxConsole = {
  log: (...args: any[]) => {
    markAlive();
    post('log', args);
  },
  error: (...args: any[]) => {
    markAlive();
    post('error', args);
  },
  warn: (...args: any[]) => {
    markAlive();
    post('warn', args);
  },
  table: (data: any) => {
    markAlive();
    post('table', data);
  },
  time: (label = 'default') => {
    timeMarks.set(label, performance.now());
  },
  timeEnd: (label = 'default') => {
    const start = timeMarks.get(label);
    if (start != null) {
      markAlive();
      post('log', [`${label}: ${(performance.now() - start).toFixed(2)}ms`]);
      timeMarks.delete(label);
    }
  },
};

// ---------- Timers ----------
(self as any).setTimeout = (fn: any, delay?: number, ...args: any[]) => {
  startWatchdog();
  const id = nativeSetTimeout(() => {
    if (!stopped) {
      markAlive();
      fn(...args);
    }
  }, delay);
  timers.add(id as any);
  return id;
};

(self as any).setInterval = (fn: any, delay?: number, ...args: any[]) => {
  startWatchdog();
  const id = nativeSetInterval(() => {
    if (!stopped) {
      markAlive();
      fn(...args);
    }
  }, delay);
  intervals.add(id as any);
  return id;
};

(self as any).clearTimeout = (id: NodeJS.Timeout) => {
  timers.delete(id);
  return nativeClearTimeout(id);
};

(self as any).clearInterval = (id: NodeJS.Timeout) => {
  intervals.delete(id);
  return nativeClearInterval(id);
};

// ---------- FETCH  ----------
(self as any).fetch = async (...args: any[]) => {
  startWatchdog();
  markAlive();

  try {
    const response = await nativeFetch(
      ...(args as [RequestInfo | URL, RequestInit?])
    );
    markAlive();
    return response;
  } catch (err) {
    markAlive();
    throw err;
  }
};

// ---------- Cleanup ----------
const cleanupAndExit = (reason: string) => {
  stopped = true;
  timers.forEach(nativeClearTimeout);
  intervals.forEach(nativeClearInterval);
  if (watchdog) nativeClearInterval(watchdog);
  post('status', reason);
  self.close();
};

// ---------- Message handling ----------
self.onmessage = async (e) => {
  if (e.data?.type === 'STOP') {
    cleanupAndExit('stopped-by-user');
    return;
  }

  const { code } = e.data;
  post('status', 'running');
  markAlive();

  try {
    const fn = new Function(
      'console',
      'keepAlive',
      'fetch',
      `
        return (async () => {
          ${code}
        })();
      `
    );

    await fn(sandboxConsole, (self as any).keepAlive, (self as any).fetch);

    // Fast path: pure sync code
    if (!watchdog && !forceKeepAlive) {
      cleanupAndExit('done');
    }
  } catch (err: any) {
    post('error', [err.message]);
    cleanupAndExit('error');
  }
};
