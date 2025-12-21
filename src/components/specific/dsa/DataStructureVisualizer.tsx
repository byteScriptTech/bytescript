'use client';

import React from 'react';

import { Graph } from './graph/Graph';
import { LinkedList } from './linked-list/LinkedList';
import { QueueVisualizer } from './queue/QueueVisualizer';
import { RecursionTree } from './recursion/RecursionTree';
import { Searching } from './searching/Searching';
import { Sorting } from './sorting/Sorting';
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
        return <LinkedList />;

      case 'stack':
        return <StackVisualizer />;

      case 'queue':
        return <QueueVisualizer />;

      case 'searching':
        return <Searching />;

      case 'sorting':
        return <Sorting />;

      case 'recursion':
        return <RecursionTree />;

      case 'trees':
        return <BinaryTree />;

      case 'graph':
        return <Graph />;

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
