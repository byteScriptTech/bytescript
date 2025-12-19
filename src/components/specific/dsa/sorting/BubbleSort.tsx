'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

export function BubbleSort() {
  const initialArray = [5, 1, 4, 2, 8];

  const [array, setArray] = useState<number[]>(initialArray);
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [isSorted, setIsSorted] = useState(false);

  const nextStep = () => {
    if (isSorted) return;

    setArray((prev) => {
      const arr = [...prev];

      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }

      return arr;
    });

    if (j >= array.length - i - 2) {
      setJ(0);
      setI((prev) => prev + 1);

      if (i >= array.length - 2) {
        setIsSorted(true);
      }
    } else {
      setJ((prev) => prev + 1);
    }
  };

  const reset = () => {
    setArray(initialArray);
    setI(0);
    setJ(0);
    setIsSorted(false);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Bubble Sort</h3>

      <div className="flex justify-center gap-2">
        {array.map((value, index) => {
          let bg = 'bg-gray-100 dark:bg-gray-800';

          if (index === j || index === j + 1) {
            bg = 'bg-blue-500 text-white';
          }

          if (isSorted || index >= array.length - i) {
            bg = 'bg-green-500 text-white';
          }

          return (
            <div
              key={index}
              className={`w-14 h-14 flex items-center justify-center
                border rounded transition ${bg}`}
            >
              {value}
            </div>
          );
        })}
      </div>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        {isSorted
          ? 'Array is fully sorted'
          : `Pass ${i + 1}, comparing index ${j} and ${j + 1}`}
      </div>

      <div className="flex justify-center gap-3">
        <Button onClick={nextStep} disabled={isSorted} size="sm">
          Next Step
        </Button>

        <Button onClick={reset} variant="secondary" size="sm">
          Reset
        </Button>
      </div>

      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        Bubble sort repeatedly compares adjacent elements and swaps them if they
        are in the wrong order. After each pass, the largest element moves to
        its correct position. Time complexity is O(n²).
      </p>
    </div>
  );
}
