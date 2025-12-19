'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type TreeNode = {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
};

function insertBST(root: TreeNode | null, value: number): TreeNode {
  if (!root) {
    return { value, left: null, right: null };
  }

  if (value < root.value) {
    root.left = insertBST(root.left, value);
  } else {
    root.right = insertBST(root.right, value);
  }

  return root;
}

function inorder(root: TreeNode | null, result: number[]) {
  if (!root) return;
  inorder(root.left, result);
  result.push(root.value);
  inorder(root.right, result);
}

function preorder(root: TreeNode | null, result: number[]) {
  if (!root) return;
  result.push(root.value);
  preorder(root.left, result);
  preorder(root.right, result);
}

function postorder(root: TreeNode | null, result: number[]) {
  if (!root) return;
  postorder(root.left, result);
  postorder(root.right, result);
  result.push(root.value);
}

export function BinaryTree() {
  const [root, setRoot] = useState<TreeNode | null>({
    value: 8,
    left: {
      value: 3,
      left: { value: 1, left: null, right: null },
      right: { value: 6, left: null, right: null },
    },
    right: {
      value: 10,
      left: null,
      right: { value: 14, left: null, right: null },
    },
  });

  const [value, setValue] = useState('5');
  const [traversal, setTraversal] = useState<number[]>([]);
  const [step, setStep] = useState<number>(-1);

  const insertNode = () => {
    const val = Number(value);
    if (Number.isNaN(val)) return;

    setRoot((prev) => insertBST(structuredClone(prev), val));
    resetTraversal();
  };

  const startTraversal = (type: 'inorder' | 'preorder' | 'postorder') => {
    const result: number[] = [];

    if (type === 'inorder') inorder(root, result);
    if (type === 'preorder') preorder(root, result);
    if (type === 'postorder') postorder(root, result);

    setTraversal(result);
    setStep(0);
  };

  const nextStep = () => {
    setStep((prev) => (prev < traversal.length - 1 ? prev + 1 : prev));
  };

  const resetTraversal = () => {
    setTraversal([]);
    setStep(-1);
  };

  const renderNode = (node: TreeNode | null) => {
    if (!node) return null;

    const isActive = traversal[step] === node.value;

    return (
      <div className="flex flex-col items-center">
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full border
            ${
              isActive
                ? 'bg-blue-500 text-white border-blue-600 scale-110'
                : 'bg-gray-100 dark:bg-gray-800'
            }`}
        >
          {node.value}
        </div>

        <div className="flex gap-6 mt-4">
          {renderNode(node.left)}
          {renderNode(node.right)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Binary Tree (BST)</h3>

      <div className="flex justify-center overflow-x-auto py-4">
        {renderNode(root)}
      </div>

      <div className="flex justify-center gap-3">
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-24"
          placeholder="Value"
        />
        <Button onClick={insertNode} size="sm">
          Insert
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={() => startTraversal('inorder')} size="sm">
          Inorder
        </Button>

        <Button
          onClick={() => startTraversal('preorder')}
          variant="secondary"
          size="sm"
        >
          Preorder
        </Button>

        <Button
          onClick={() => startTraversal('postorder')}
          variant="outline"
          size="sm"
        >
          Postorder
        </Button>

        <Button
          onClick={nextStep}
          disabled={step === -1 || step >= traversal.length - 1}
          variant="secondary"
          size="sm"
        >
          Next
        </Button>
      </div>

      {step !== -1 && (
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Traversal order: {traversal.slice(0, step + 1).join(' → ')}
        </p>
      )}

      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        A Binary Search Tree keeps smaller values on the left and larger values
        on the right. Tree traversals are implemented using recursion.
      </p>
    </div>
  );
}
