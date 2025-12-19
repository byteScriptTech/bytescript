'use client';

import React, { useState } from 'react';

export function SelectionSort() {
  const [array, setArray] = useState<number[]>([64, 25, 12, 22, 11]);

  const [i, setI] = useState(0);
  const [j, setJ] = useState(1);
  const [minIndex, setMinIndex] = useState(0);
  const [isSorted, setIsSorted] = useState(false);

  const nextStep = () => {
    if (isSorted) return;

    if (j < array.length) {
      if (array[j] < array[minIndex]) {
        setMinIndex(j);
      }
      setJ((prev) => prev + 1);
      return;
    }

    setArray((prev) => {
      const arr = [...prev];
      const temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
      return arr;
    });

    const nextI = i + 1;

    if (nextI >= array.length - 1) {
      setIsSorted(true);
      return;
    }

    setI(nextI);
    setMinIndex(nextI);
    setJ(nextI + 1);
  };

  const reset = () => {
    setArray([64, 25, 12, 22, 11]);
    setI(0);
    setJ(1);
    setMinIndex(0);
    setIsSorted(false);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Selection Sort</h3>

      <div className="flex justify-center gap-2">
        {array.map((value, index) => {
          let bg = 'bg-gray-100 dark:bg-gray-800';

          if (index === minIndex) {
            bg = 'bg-yellow-400 text-black';
          }

          if (index === j) {
            bg = 'bg-blue-400 text-white';
          }

          if (index < i || isSorted) {
            bg = 'bg-green-500 text-white';
          }

          return (
            <div
              key={index}
              className={`w-14 h-14 flex items-center justify-center
                border rounded ${bg}`}
            >
              {value}
            </div>
          );
        })}
      </div>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        {isSorted
          ? 'Array is fully sorted'
          : `Selecting minimum for position ${i}`}
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={nextStep}
          disabled={isSorted}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Next Step
        </button>

        <button
          onClick={reset}
          className="px-4 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Selection sort repeatedly selects the minimum element from the unsorted
        part and places it at the beginning. Time complexity is O(n²).
      </p>
    </div>
  );
}
