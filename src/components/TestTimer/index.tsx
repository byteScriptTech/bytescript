'use client';

import { useEffect, useState, useRef } from 'react';

export default function Timer({
  testId,
  initialSeconds,
  onExpire,
}: {
  testId: string; // unique test identifier
  initialSeconds: number;
  onExpire: () => void;
}) {
  // Unique localStorage key per test
  const STORAGE_KEY = `test_timer_${testId}`;

  // Load saved time or default initialSeconds
  const loadInitialTime = () => {
    if (typeof window === 'undefined') return initialSeconds;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = Number(stored);
      // Prevent invalid values
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }

    // Save initial time to storage on first load
    localStorage.setItem(STORAGE_KEY, String(initialSeconds));
    return initialSeconds;
  };

  const [remaining, setRemaining] = useState(loadInitialTime);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (remaining <= 0) {
      localStorage.removeItem(STORAGE_KEY);
      onExpire();
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;

        // Save updated time
        localStorage.setItem(STORAGE_KEY, String(next));

        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [remaining]);

  const m = Math.floor(remaining / 60);
  const s = String(remaining % 60).padStart(2, '0');

  return (
    <div className="text-right">
      <div
        className={`text-2xl font-bold ${remaining < 60 ? 'text-red-600' : ''}`}
      >
        {m}:{s}
      </div>
      <div className="text-sm text-gray-600">Time Remaining</div>
    </div>
  );
}
