'use client';

import React, { useState } from 'react';

export function BinarySearch() {
  const [array] = useState<number[]>([1, 3, 5, 7, 9, 11, 13]);
  const [target, setTarget] = useState('7');

  const [low, setLow] = useState<number | null>(null);
  const [high, setHigh] = useState<number | null>(null);
  const [mid, setMid] = useState<number | null>(null);

  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const startSearch = () => {
    setLow(0);
    setHigh(array.length - 1);
    setMid(null);
    setFoundIndex(null);
    setIsFinished(false);
  };

  const nextStep = () => {
    if (low === null || high === null || isFinished) return;

    if (low > high) {
      setIsFinished(true);
      return;
    }

    const m = Math.floor((low + high) / 2);
    setMid(m);

    const targetValue = Number(target);

    if (array[m] === targetValue) {
      setFoundIndex(m);
      setIsFinished(true);
      return;
    }

    if (array[m] < targetValue) {
      setLow(m + 1);
    } else {
      setHigh(m - 1);
    }
  };

  const reset = () => {
    setLow(null);
    setHigh(null);
    setMid(null);
    setFoundIndex(null);
    setIsFinished(false);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Binary Search</h3>

      <div className="flex justify-center gap-2">
        {array.map((item, index) => {
          let bg = 'bg-gray-100 dark:bg-gray-800';

          if (index === mid) bg = 'bg-yellow-400 text-black';
          if (index === foundIndex) bg = 'bg-green-500 text-white';

          return (
            <div
              key={index}
              className={`w-14 h-14 flex flex-col items-center justify-center
                border rounded ${bg}`}
            >
              <span>{item}</span>
              <span className="text-xs text-gray-500">{index}</span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
        <span>Low: {low ?? '-'}</span>
        <span>Mid: {mid ?? '-'}</span>
        <span>High: {high ?? '-'}</span>
      </div>

      <div className="text-center text-sm">
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
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-24 px-2 py-1 border rounded"
          placeholder="Target"
        />

        <button
          onClick={startSearch}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Start
        </button>

        <button
          onClick={nextStep}
          disabled={low === null || isFinished}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Next
        </button>

        <button
          onClick={reset}
          className="px-4 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Binary search works only on sorted arrays. It repeatedly divides the
        search space in half, giving a time complexity of O(log n).
      </p>
    </div>
  );
}
