'use client';

import dynamic from 'next/dynamic';
import React, { useState } from 'react';

import Navbar from '@/components/common/Navbar';
import { DSATopic } from '@/types/dsa';

const DraggableCircle = dynamic(
  () =>
    import('@/components/ui/DraggableCircle').then(
      (mod) => mod.DraggableCircle
    ),
  { ssr: false }
);

const DraggableEditor = dynamic(
  () =>
    import('@/components/editor/DraggableEditor').then(
      (mod) => mod.DraggableEditor
    ),
  { ssr: false, loading: () => <div className="w-full h-full bg-background" /> }
);

// Create a serialized version of DSATopic where timestamps are strings
type SerializedDSATopic = Omit<
  DSATopic,
  'createdAt' | 'updatedAt' | 'lastUpdated' | 'deletedAt'
> & {
  createdAt: string | null;
  updatedAt: string | null;
  lastUpdated: string | null;
  deletedAt?: string | null;
};

interface DSATopicClientProps {
  topic: SerializedDSATopic;
  children: React.ReactNode;
}

export function DSATopicClient({
  topic: _topic,
  children,
}: DSATopicClientProps) {
  const [showEditor, setShowEditor] = useState(false);
  const circleSize = 50;

  return (
    <div className="relative w-full min-h-screen">
      <Navbar />
      <DraggableCircle size={circleSize} onClick={() => setShowEditor(true)} />
      {showEditor && (
        <DraggableEditor
          defaultPosition={{ x: 0, y: 0 }}
          defaultSize={{ width: 800, height: 500 }}
          onClose={() => setShowEditor(false)}
          defaultPythonCode="# Start coding here..."
          showAlgorithm={true}
          hideTabs={false}
        />
      )}
      {children}
    </div>
  );
}
