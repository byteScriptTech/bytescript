'use client';

import React, { useState } from 'react';

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

export function GraphVisualizer() {
  const [traversal, setTraversal] = useState<string[]>([]);
  const [step, setStep] = useState<number>(-1);
  const [mode, setMode] = useState<'bfs' | 'dfs' | null>(null);

  const startBFS = () => {
    setTraversal(bfs(graphData, 'A'));
    setStep(0);
    setMode('bfs');
  };

  const startDFS = () => {
    setTraversal(dfs(graphData, 'A'));
    setStep(0);
    setMode('dfs');
  };

  const nextStep = () => {
    setStep((prev) => (prev < traversal.length - 1 ? prev + 1 : prev));
  };

  const reset = () => {
    setTraversal([]);
    setStep(-1);
    setMode(null);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        Graph Traversal ({mode?.toUpperCase() ?? '—'})
      </h3>

      <div className="flex flex-wrap justify-center gap-6">
        {Object.keys(graphData).map((node) => {
          const visited = traversal.slice(0, step + 1).includes(node);

          return (
            <div
              key={node}
              className={`w-14 h-14 flex items-center justify-center rounded-full border text-lg font-semibold
                ${
                  visited
                    ? 'bg-green-500 text-white border-green-600'
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
        <button
          onClick={startBFS}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Start BFS
        </button>

        <button
          onClick={startDFS}
          className="px-4 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Start DFS
        </button>

        <button
          onClick={nextStep}
          disabled={step === -1 || step >= traversal.length - 1}
          className="px-4 py-1 bg-gray-500 text-white rounded disabled:bg-gray-400"
        >
          Next
        </button>

        <button
          onClick={reset}
          className="px-4 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Reset
        </button>
      </div>

      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        BFS explores level by level using a queue. DFS explores depth first
        using recursion or a stack. Both have time complexity O(V + E).
      </p>
    </div>
  );
}
