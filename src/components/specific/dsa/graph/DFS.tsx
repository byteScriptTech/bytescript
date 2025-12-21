'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

type Graph = Record<string, string[]>;

const graphData: Graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E'],
};

function dfs(
  graph: Graph,
  start: string,
  visited = new Set<string>(),
  order: string[] = []
): string[] {
  visited.add(start);
  order.push(start);

  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited, order);
    }
  }

  return order;
}

export function DFS() {
  const [traversal, setTraversal] = useState<string[]>([]);
  const [step, setStep] = useState<number>(-1);

  const startDFS = () => {
    setTraversal(dfs(graphData, 'A'));
    setStep(0);
  };

  const nextStep = () => {
    setStep((prev) => (prev < traversal.length - 1 ? prev + 1 : prev));
  };

  const reset = () => {
    setTraversal([]);
    setStep(-1);
  };

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold">Depth-First Search (DFS)</h4>

      <div className="flex flex-wrap justify-center gap-6">
        {Object.keys(graphData).map((node) => {
          const visited = traversal.slice(0, step + 1).includes(node);

          return (
            <div
              key={node}
              className={`w-14 h-14 flex items-center justify-center rounded-full border text-lg font-semibold
                ${
                  visited
                    ? 'bg-purple-500 text-white border-purple-600'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
            >
              {node}
            </div>
          );
        })}
      </div>

      {step !== -1 && (
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Traversal order: {traversal.slice(0, step + 1).join(' → ')}
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={startDFS} variant="secondary" size="sm">
          Start DFS
        </Button>

        <Button
          onClick={nextStep}
          disabled={step === -1 || step >= traversal.length - 1}
          variant="secondary"
          size="sm"
        >
          Next
        </Button>

        <Button onClick={reset} variant="outline" size="sm">
          Reset
        </Button>
      </div>

      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        DFS explores the graph depth first using recursion or a stack. It goes
        as deep as possible along each branch before backtracking.
      </p>
    </div>
  );
}
