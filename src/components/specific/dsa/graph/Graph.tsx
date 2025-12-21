'use client';

import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { BFS } from './BFS';
import { DFS } from './DFS';

export function Graph() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Graph Traversal Algorithms</h3>

      <Tabs defaultValue="bfs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bfs">Breadth-First Search</TabsTrigger>
          <TabsTrigger value="dfs">Depth-First Search</TabsTrigger>
        </TabsList>

        <TabsContent value="bfs" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Explores the graph level by level using a queue. Ideal for finding
            the shortest path in unweighted graphs.
          </div>
          <BFS />
        </TabsContent>

        <TabsContent value="dfs" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Explores the graph depth first using recursion or a stack. Useful
            for topological sorting and cycle detection.
          </div>
          <DFS />
        </TabsContent>
      </Tabs>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p className="font-medium mb-2">Key Differences:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>BFS:</strong> Uses queue, explores level by level,
            guarantees shortest path in unweighted graphs, O(V + E) time, O(V)
            space
          </li>
          <li>
            <strong>DFS:</strong> Uses recursion/stack, explores depth first,
            better for memory-constrained environments, O(V + E) time, O(V)
            space
          </li>
        </ul>
        <p className="mt-2">
          Both algorithms have the same time complexity O(V + E) where V is
          vertices and E is edges, but they explore the graph in different
          orders making them suitable for different use cases.
        </p>
      </div>
    </div>
  );
}
