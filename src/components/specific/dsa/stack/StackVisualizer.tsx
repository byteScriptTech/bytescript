'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function StackVisualizer() {
  const [stack, setStack] = useState<number[]>([1, 2, 3]);
  const [value, setValue] = useState('4');

  const push = () => {
    const val = Number(value);
    if (Number.isNaN(val)) return;

    setStack((prev) => [...prev, val]);
    setValue(String(val + 1));
  };

  const pop = () => {
    setStack((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Stack (LIFO)</h3>

      <div className="flex justify-center">
        <div className="relative">
          {stack.length === 0 && (
            <div className="text-gray-500 text-center">Stack is empty</div>
          )}

          {stack.map((item, index) => (
            <div
              key={index}
              className="w-24 h-12 flex items-center justify-center
                         bg-orange-100 dark:bg-orange-900
                         border border-orange-300 dark:border-orange-700
                         rounded
                         transition"
              style={{
                marginBottom: index === stack.length - 1 ? 0 : '-6px',
              }}
            >
              {item}
            </div>
          ))}

          {stack.length > 0 && (
            <div className="absolute -right-16 top-0 text-sm text-gray-600 dark:text-gray-400">
              TOP →
            </div>
          )}
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

        <Button onClick={push} size="sm">
          Push
        </Button>

        <Button
          onClick={pop}
          disabled={stack.length === 0}
          variant="destructive"
          size="sm"
        >
          Pop
        </Button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Stack follows <strong>Last In, First Out</strong>. Elements are always
        added and removed from the top.
      </p>
    </div>
  );
}
