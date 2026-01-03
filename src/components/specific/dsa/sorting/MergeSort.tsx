'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

type MergeStep = {
  left: number[];
  right: number[];
  merged: number[];
};

function generateMergeSteps(arr: number[]): MergeStep[] {
  const steps: MergeStep[] = [];

  function merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
  }

  function divide(array: number[]): number[] {
    if (array.length <= 1) return array;

    const mid = Math.floor(array.length / 2);
    const left = divide(array.slice(0, mid));
    const right = divide(array.slice(mid));

    const merged = merge(left, right);
    steps.push({ left, right, merged });

    return merged;
  }

  divide(arr);
  return steps;
}

export function MergeSort() {
  const initialArray = [38, 27, 43, 3, 9, 82, 10];

  const [steps] = useState<MergeStep[]>(generateMergeSteps(initialArray));
  const [stepIndex, setStepIndex] = useState(0);

  const currentStep = steps[stepIndex];

  const nextStep = () => {
    setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const reset = () => {
    setStepIndex(0);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Merge Sort</h3>

      <div className="space-y-2 text-center">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Merging
        </p>

        <div className="flex justify-center gap-2">
          {currentStep.left.map((v, i) => (
            <div
              key={`l-${i}`}
              className="w-12 h-12 flex items-center justify-center
                         border rounded bg-blue-100 dark:bg-blue-900"
            >
              {v}
            </div>
          ))}

          <span className="flex items-center px-2">+</span>

          {currentStep.right.map((v, i) => (
            <div
              key={`r-${i}`}
              className="w-12 h-12 flex items-center justify-center
                         border rounded bg-purple-100 dark:bg-purple-900"
            >
              {v}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 text-center">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Result
        </p>

        <div className="flex justify-center gap-2">
          {currentStep.merged.map((v, i) => (
            <div
              key={`m-${i}`}
              className="w-12 h-12 flex items-center justify-center
                         border rounded bg-green-500 text-white"
            >
              {v}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <Button
          onClick={nextStep}
          disabled={stepIndex >= steps.length - 1}
          size="sm"
        >
          Next Step
        </Button>

        <Button onClick={reset} variant="secondary" size="sm">
          Reset
        </Button>
      </div>

      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        Merge sort divides the array into halves until single elements remain,
        then merges them back in sorted order. Time complexity is O(n log n) and
        space complexity is O(n).
      </p>
    </div>
  );
}
