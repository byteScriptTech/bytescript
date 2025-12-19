'use client';

import React from 'react';

import { GraphVisualizer } from './graph/GraphVisualizer';
import { DoublyLinkedList } from './linked-list/DoublyLinkedList';
import { SinglyLinkedList } from './linked-list/SinglyLinkedList';
import { QueueVisualizer } from './queue/QueueVisualizer';
import { RecursionTree } from './recursion/RecursionTree';
import { BinarySearch } from './searching/BinarySearch';
import { LinearSearch } from './searching/LinearSearch';
import { BubbleSort } from './sorting/BubbleSort';
import { StackVisualizer } from './stack/StackVisualizer';
import { BinaryTree } from './trees/BinaryTree';
import type { DSATopic } from './types';

interface Props {
  topic: DSATopic;
}

export function DataStructureVisualizer({ topic }: Props) {
  const renderTopic = () => {
    switch (topic) {
      case 'linked-lists':
        return <SinglyLinkedList />;

      case 'doubly-linked-list':
        return <DoublyLinkedList />;

      case 'stack':
        return <StackVisualizer />;

      case 'queue':
        return <QueueVisualizer />;

      case 'searching':
        return <LinearSearch />;

      case 'binary-search':
        return <BinarySearch />;

      case 'sorting':
        return <BubbleSort />;

      case 'recursion':
        return <RecursionTree />;

      case 'trees':
        return <BinaryTree />;

      case 'graph':
        return <GraphVisualizer />;

      default:
        return (
          <div className="text-center text-gray-500">
            Visualization not available
          </div>
        );
    }
  };

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-900 p-6">
      {renderTopic()}
    </div>
  );
}
