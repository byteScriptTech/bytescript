'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function QueueVisualizer() {
  const [queue, setQueue] = useState<number[]>([1, 2, 3]);
  const [value, setValue] = useState('4');

  const enqueue = () => {
    const val = Number(value);
    if (Number.isNaN(val)) return;

    setQueue((prev) => [...prev, val]);
    setValue(String(val + 1));
  };

  const dequeue = () => {
    setQueue((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(1);
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Queue (FIFO)</h3>

      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          {queue.length === 0 && (
            <span className="text-gray-500">Queue is empty</span>
          )}

          {queue.map((item, index) => (
            <div key={index} className="relative">
              <div
                className="w-16 h-12 flex items-center justify-center
                           bg-green-100 dark:bg-green-900
                           border border-green-300 dark:border-green-700
                           rounded transition"
              >
                {item}
              </div>

              {index === 0 && (
                <span className="absolute -top-6 left-0 text-xs text-gray-600 dark:text-gray-400">
                  FRONT
                </span>
              )}

              {index === queue.length - 1 && (
                <span className="absolute -top-6 right-0 text-xs text-gray-600 dark:text-gray-400">
                  REAR
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-24"
          placeholder="Value"
        />

        <Button onClick={enqueue} size="sm">
          Enqueue
        </Button>

        <Button
          onClick={dequeue}
          disabled={queue.length === 0}
          variant="destructive"
          size="sm"
        >
          Dequeue
        </Button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Queue follows <strong>First In, First Out</strong>. Elements are added
        at the rear and removed from the front.
      </p>
    </div>
  );
}
