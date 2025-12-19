'use client';

import React, { useState } from 'react';

type Node = {
  value: number;
};

export function DoublyLinkedList() {
  const [nodes, setNodes] = useState<Node[]>([
    { value: 1 },
    { value: 2 },
    { value: 3 },
  ]);

  const [value, setValue] = useState('4');
  const [index, setIndex] = useState('0');

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const insertAtHead = () => {
    const val = Number(value);
    if (Number.isNaN(val)) return;

    setNodes((prev) => [{ value: val }, ...prev]);
    resetTraversal();
  };

  const insertAtTail = () => {
    const val = Number(value);
    if (Number.isNaN(val)) return;

    setNodes((prev) => [...prev, { value: val }]);
    resetTraversal();
  };

  const insertAtIndex = () => {
    const val = Number(value);
    const idx = Number(index);

    if (Number.isNaN(val) || Number.isNaN(idx)) return;
    if (idx < 0 || idx > nodes.length) return;

    setNodes((prev) => {
      const copy = [...prev];
      copy.splice(idx, 0, { value: val });
      return copy;
    });

    resetTraversal();
  };

  const startForwardTraversal = () => {
    if (nodes.length === 0) return;
    setCurrentIndex(0);
  };

  const startBackwardTraversal = () => {
    if (nodes.length === 0) return;
    setCurrentIndex(nodes.length - 1);
  };

  const nextForward = () => {
    setCurrentIndex((prev) => {
      if (prev === null) return null;
      if (prev >= nodes.length - 1) return prev;
      return prev + 1;
    });
  };

  const nextBackward = () => {
    setCurrentIndex((prev) => {
      if (prev === null) return null;
      if (prev <= 0) return prev;
      return prev - 1;
    });
  };

  const resetTraversal = () => {
    setCurrentIndex(null);
  };

  const removeNode = (idx: number) => {
    setNodes((prev) => prev.filter((_, i) => i !== idx));
    resetTraversal();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Doubly Linked List</h3>
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>Head ➜ {nodes[0]?.value ?? 'null'}</span>
        <span>Tail ➜ {nodes[nodes.length - 1]?.value ?? 'null'}</span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto py-4">
        {nodes.length === 0 && (
          <span className="text-gray-500">List is empty</span>
        )}

        {nodes.map((node, i) => (
          <React.Fragment key={i}>
            <button
              onClick={() => removeNode(i)}
              className={`min-w-[72px] h-14 px-4 flex flex-col items-center justify-center
                rounded border transition
                ${
                  currentIndex === i
                    ? 'bg-blue-500 text-white border-blue-600 scale-110'
                    : 'bg-indigo-100 dark:bg-indigo-900 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-200 dark:hover:bg-indigo-800'
                }`}
            >
              <span className="text-xs text-gray-600 dark:text-gray-300">
                prev
              </span>
              <span className="font-semibold">{node.value}</span>
              <span className="text-xs text-gray-600 dark:text-gray-300">
                next
              </span>
            </button>

            {i < nodes.length - 1 && (
              <div className="flex flex-col items-center text-lg">
                <span>⇄</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="px-2 py-1 border rounded"
          placeholder="Value"
        />

        <input
          type="number"
          value={index}
          onChange={(e) => setIndex(e.target.value)}
          className="px-2 py-1 border rounded"
          placeholder="Index"
        />
      </div>

      {/* Insert Controls */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={insertAtHead}
          className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Insert at Head
        </button>

        <button
          onClick={insertAtTail}
          className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Insert at Tail
        </button>

        <button
          onClick={insertAtIndex}
          className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Insert at Index
        </button>
      </div>

      {/* Traversal Controls */}
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          onClick={startForwardTraversal}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Traverse Forward
        </button>

        <button
          onClick={nextForward}
          disabled={currentIndex === null}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Next →
        </button>

        <button
          onClick={startBackwardTraversal}
          className="px-4 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Traverse Backward
        </button>

        <button
          onClick={nextBackward}
          disabled={currentIndex === null}
          className="px-4 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
        >
          ← Prev
        </button>

        <button
          onClick={resetTraversal}
          className="px-4 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Each node stores references to both the previous and next nodes,
        allowing traversal in both directions.
      </p>
    </div>
  );
}
