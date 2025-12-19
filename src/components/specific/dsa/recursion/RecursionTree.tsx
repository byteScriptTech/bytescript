'use client';

import React, { useState } from 'react';

type CallNode = {
  n: number;
  depth: number;
};

export function RecursionTree() {
  const [input, setInput] = useState('4');

  const [calls, setCalls] = useState<CallNode[]>([]);
  const [step, setStep] = useState<number>(-1);
  const [mode, setMode] = useState<'call' | 'return' | null>(null);

  const buildRecursion = (n: number, depth: number, result: CallNode[]) => {
    result.push({ n, depth });

    if (n === 0 || n === 1) return;

    buildRecursion(n - 1, depth + 1, result);
  };

  const startRecursion = () => {
    const n = Number(input);
    if (Number.isNaN(n) || n < 0) return;

    const result: CallNode[] = [];
    buildRecursion(n, 0, result);

    setCalls(result);
    setStep(0);
    setMode('call');
  };

  const nextStep = () => {
    if (step === -1) return;

    if (mode === 'call' && step === calls.length - 1) {
      setMode('return');
      return;
    }

    setStep((prev) => (prev < calls.length - 1 ? prev + 1 : prev));
  };

  const reset = () => {
    setCalls([]);
    setStep(-1);
    setMode(null);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Recursion Tree (Factorial)</h3>

      <div className="flex flex-col items-center gap-3 py-4">
        {calls.map((call, index) => {
          const isActive = index === step && mode === 'call';
          const isReturned = mode === 'return' && index <= step;

          return (
            <div
              key={index}
              className={`flex items-center gap-3 transition
                ${
                  isActive
                    ? 'text-blue-600 font-semibold scale-105'
                    : isReturned
                      ? 'text-green-600'
                      : 'text-gray-600'
                }`}
              style={{ marginLeft: call.depth * 24 }}
            >
              <span>factorial({call.n})</span>
            </div>
          );
        })}
      </div>

      {step !== -1 && (
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          {mode === 'call'
            ? 'Calling deeper recursive functions'
            : 'Returning from recursive calls'}
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-24 px-2 py-1 border rounded"
          placeholder="n"
        />

        <button
          onClick={startRecursion}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Start
        </button>

        <button
          onClick={nextStep}
          disabled={step === -1}
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

      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        Recursion works by breaking a problem into smaller subproblems until a
        base case is reached. Each call is pushed onto the call stack, and
        values are returned in reverse order.
      </p>
    </div>
  );
}
