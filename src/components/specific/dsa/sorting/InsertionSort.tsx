'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

export function InsertionSort() {
  const initialArray = [5, 2, 9, 1, 5, 6];

  const [array, setArray] = useState<number[]>(initialArray);
  const [i, setI] = useState(1);
  const [j, setJ] = useState(0);
  const [key, setKey] = useState<number | null>(initialArray[1]);
  const [isSorted, setIsSorted] = useState(false);

  const nextStep = () => {
    if (isSorted) return;

    if (key === null) return;

    if (j >= 0 && array[j] > key) {
      setArray((prev) => {
        const arr = [...prev];
        arr[j + 1] = arr[j];
        return arr;
      });
      setJ((prev) => prev - 1);
      return;
    }

    setArray((prev) => {
      const arr = [...prev];
      arr[j + 1] = key;
      return arr;
    });

    const nextI = i + 1;

    if (nextI >= array.length) {
      setIsSorted(true);
      return;
    }

    setI(nextI);
    setJ(nextI - 1);
    setKey(array[nextI]);
  };

  const reset = () => {
    setArray(initialArray);
    setI(1);
    setJ(0);
    setKey(initialArray[1]);
    setIsSorted(false);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Insertion Sort</h3>

      <div className="flex justify-center gap-2">
        {array.map((value, index) => {
          let bg = 'bg-gray-100 dark:bg-gray-800';

          if (index < i) {
            bg = 'bg-green-500 text-white';
          }

          if (index === i) {
            bg = 'bg-yellow-400 text-black';
          }

          if (index === j) {
            bg = 'bg-blue-500 text-white';
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
        {isSorted ? 'Array is fully sorted' : `Inserting element at index ${i}`}
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
        Insertion sort builds the sorted array one element at a time. It is
        efficient for small datasets and nearly sorted arrays. Time complexity
        is O(n²) in the worst case.
      </p>
    </div>
  );
}
