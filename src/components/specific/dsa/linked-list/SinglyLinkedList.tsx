'use client';

import React, { useState } from 'react';

type Node = {
  value: number;
};

export function SinglyLinkedList() {
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

  const startTraversal = () => {
    if (nodes.length === 0) return;
    setCurrentIndex(0);
  };

  const nextStep = () => {
    setCurrentIndex((prev) => {
      if (prev === null) return null;
      if (prev >= nodes.length - 1) return prev;
      return prev + 1;
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
      <h3 className="text-lg font-semibold">Singly Linked List</h3>

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
              className={`min-w-[64px] h-12 px-4 flex items-center justify-center
                rounded border transition
                ${
                  currentIndex === i
                    ? 'bg-blue-500 text-white border-blue-600 scale-110'
                    : 'bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-800'
                }`}
              aria-label={`Node with value ${node.value}`}
            >
              {node.value}
            </button>

            {i < nodes.length - 1 && (
              <span className="text-xl select-none">→</span>
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

      <div className="flex flex-wrap gap-3">
        <button
          onClick={insertAtHead}
          className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Insert at Head
        </button>

        <button
          onClick={insertAtIndex}
          className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Insert at Index
        </button>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          onClick={startTraversal}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Start Traversal
        </button>

        <button
          onClick={nextStep}
          disabled={currentIndex === null}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Next
        </button>

        <button
          onClick={resetTraversal}
          className="px-4 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Traversal starts from the head and moves one node at a time. The
        highlighted node represents the current pointer position.
      </p>
    </div>
  );
}
