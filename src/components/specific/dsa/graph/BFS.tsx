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

function bfs(graph: Graph, start: string): string[] {
  const visited = new Set<string>();
  const queue: string[] = [start];
  const order: string[] = [];

  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return order;
}

export function BFS() {
  const [traversal, setTraversal] = useState<string[]>([]);
  const [step, setStep] = useState<number>(-1);

  const startBFS = () => {
    setTraversal(bfs(graphData, 'A'));
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
      <h4 className="text-lg font-semibold">Breadth-First Search (BFS)</h4>

      {/* Graph Nodes */}
      <div className="flex flex-wrap justify-center gap-6">
        {Object.keys(graphData).map((node) => {
          const visited = traversal.slice(0, step + 1).includes(node);

          return (
            <div
              key={node}
              className={`w-14 h-14 flex items-center justify-center rounded-full border text-lg font-semibold
                ${
                  visited
                    ? 'bg-blue-500 text-white border-blue-600'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
            >
              {node}
            </div>
          );
        })}
      </div>

      {/* Traversal Order */}
      {step !== -1 && (
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Traversal order: {traversal.slice(0, step + 1).join(' → ')}
        </p>
      )}

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={startBFS} size="sm">
          Start BFS
        </Button>

        <Button
          onClick={nextStep}
          disabled={step === -1 || step >= traversal.length - 1}
          size="sm"
        >
          Next
        </Button>

        <Button onClick={reset} variant="outline" size="sm">
          Reset
        </Button>
      </div>

      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        BFS explores the graph level by level using a queue. It visits all
        neighbors at the current depth before moving to the next level.
      </p>
    </div>
  );
}
