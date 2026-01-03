'use client';

import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { DoublyLinkedList } from './DoublyLinkedList';
import { SinglyLinkedList } from './SinglyLinkedList';

export function LinkedList() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Linked Lists</h3>

      <Tabs defaultValue="singly" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="singly">Singly Linked List</TabsTrigger>
          <TabsTrigger value="doubly">Doubly Linked List</TabsTrigger>
        </TabsList>

        <TabsContent value="singly" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Each node points to the next node only. Traversal can only go
            forward.
          </div>
          <SinglyLinkedList />
        </TabsContent>

        <TabsContent value="doubly" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Each node points to both the next and previous nodes. Traversal can
            go both forward and backward.
          </div>
          <DoublyLinkedList />
        </TabsContent>
      </Tabs>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p className="font-medium mb-2">Key Differences:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Singly Linked List:</strong> Uses less memory, simpler
            implementation, only forward traversal
          </li>
          <li>
            <strong>Doubly Linked List:</strong> Uses more memory, allows
            backward traversal, easier deletion operations
          </li>
        </ul>
      </div>
    </div>
  );
}
