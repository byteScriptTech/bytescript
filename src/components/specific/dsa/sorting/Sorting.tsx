'use client';

import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { BubbleSort } from './BubbleSort';
import { InsertionSort } from './InsertionSort';
import { MergeSort } from './MergeSort';
import { SelectionSort } from './SelectionSort';

export function Sorting() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Sorting Algorithms</h3>

      <Tabs defaultValue="bubble" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="bubble">Bubble Sort</TabsTrigger>
          <TabsTrigger value="selection">Selection Sort</TabsTrigger>
          <TabsTrigger value="insertion">Insertion Sort</TabsTrigger>
          <TabsTrigger value="merge">Merge Sort</TabsTrigger>
        </TabsList>

        <TabsContent value="bubble" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Compares adjacent elements and swaps them if they&apos;re in wrong
            order. Simple but inefficient for large datasets.
          </div>
          <BubbleSort />
        </TabsContent>

        <TabsContent value="selection" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Finds the minimum element and places it at the beginning. Consistent
            performance but still O(n²).
          </div>
          <SelectionSort />
        </TabsContent>

        <TabsContent value="insertion" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Builds sorted array one element at a time. Efficient for small
            datasets and nearly sorted arrays.
          </div>
          <InsertionSort />
        </TabsContent>

        <TabsContent value="merge" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Divides array into halves and merges them back in sorted order. Much
            more efficient with O(n log n) complexity.
          </div>
          <MergeSort />
        </TabsContent>
      </Tabs>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p className="font-medium mb-2">Algorithm Comparison:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Bubble Sort:</strong> O(n²) time, O(1) space, stable, simple
            implementation
          </li>
          <li>
            <strong>Selection Sort:</strong> O(n²) time, O(1) space, unstable,
            consistent performance
          </li>
          <li>
            <strong>Insertion Sort:</strong> O(n²) worst case, O(n) best case,
            O(1) space, stable, efficient for small/nearly sorted data
          </li>
          <li>
            <strong>Merge Sort:</strong> O(n log n) time, O(n) space, stable,
            divide-and-conquer approach
          </li>
        </ul>
      </div>
    </div>
  );
}
