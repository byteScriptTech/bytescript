'use client';

import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { BinarySearch } from './BinarySearch';
import { LinearSearch } from './LinearSearch';

export function Searching() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Searching Algorithms</h3>

      <Tabs defaultValue="linear" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="linear">Linear Search</TabsTrigger>
          <TabsTrigger value="binary">Binary Search</TabsTrigger>
        </TabsList>

        <TabsContent value="linear" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Checks each element one by one until the target is found. Works on
            any array but is slower for large datasets.
          </div>
          <LinearSearch />
        </TabsContent>

        <TabsContent value="binary" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Divides the search space in half repeatedly. Much faster but
            requires the array to be sorted.
          </div>
          <BinarySearch />
        </TabsContent>
      </Tabs>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p className="font-medium mb-2">Key Differences:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Linear Search:</strong> O(n) time complexity, works on
            unsorted arrays, simpler implementation
          </li>
          <li>
            <strong>Binary Search:</strong> O(log n) time complexity, requires
            sorted array, more complex implementation
          </li>
        </ul>
      </div>
    </div>
  );
}
