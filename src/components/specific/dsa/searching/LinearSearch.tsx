'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LinearSearch() {
  const [array] = useState<number[]>([5, 2, 9, 1, 7, 3]);
  const [target, setTarget] = useState('7');

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const startSearch = () => {
    setCurrentIndex(0);
    setFoundIndex(null);
    setIsFinished(false);
  };

  const nextStep = () => {
    if (currentIndex === null) return;

    if (array[currentIndex] === Number(target)) {
      setFoundIndex(currentIndex);
      setIsFinished(true);
      return;
    }

    if (currentIndex === array.length - 1) {
      setIsFinished(true);
      return;
    }

    setCurrentIndex((prev) => (prev === null ? null : prev + 1));
  };

  const reset = () => {
    setCurrentIndex(null);
    setFoundIndex(null);
    setIsFinished(false);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Linear Search</h3>

      <div className="flex justify-center gap-2">
        {array.map((item, index) => (
          <div
            key={index}
            className={`w-14 h-14 flex items-center justify-center border rounded
              ${
                foundIndex === index
                  ? 'bg-green-500 text-white border-green-600'
                  : currentIndex === index
                    ? 'bg-blue-500 text-white border-blue-600'
                    : 'bg-gray-100 dark:bg-gray-800'
              }`}
          >
            {item}
          </div>
        ))}
      </div>

      <div className="text-center text-sm">
        {currentIndex !== null && !isFinished && (
          <span>
            Checking index <strong>{currentIndex}</strong>
          </span>
        )}

        {foundIndex !== null && (
          <span className="text-green-600">
            Target found at index {foundIndex}
          </span>
        )}

        {isFinished && foundIndex === null && (
          <span className="text-red-600">Target not found</span>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-24"
          placeholder="Target"
        />

        <Button onClick={startSearch} size="sm">
          Start
        </Button>

        <Button
          onClick={nextStep}
          disabled={currentIndex === null || isFinished}
          size="sm"
        >
          Next
        </Button>

        <Button onClick={reset} variant="secondary" size="sm">
          Reset
        </Button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Linear search checks each element one by one until the target is found
        or the array ends. Time complexity is O(n).
      </p>
    </div>
  );
}
