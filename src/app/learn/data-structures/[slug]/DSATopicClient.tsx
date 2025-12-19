'use client';

import dynamic from 'next/dynamic';
import React, { useState } from 'react';

import Navbar from '@/components/common/Navbar';
import { DataStructureVisualizer } from '@/components/specific/dsa/DataStructureVisualizer';
import { Tabs } from '@/components/specific/dsa/Tabs';
import type { DSATopic as DSATopicType } from '@/components/specific/dsa/types';
import { AuthProvider } from '@/context/AuthContext';
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

  // Map slug to DSATopic type for visualization
  const getDSATopicFromSlug = (slug: string): DSATopicType => {
    const normalizedSlug = slug.toLowerCase();

    // Exact matches first
    if (normalizedSlug === 'linked-lists') return 'linked-lists';
    if (normalizedSlug === 'doubly-linked-list') return 'doubly-linked-list';
    if (normalizedSlug === 'stack') return 'stack';
    if (normalizedSlug === 'queue') return 'queue';
    if (normalizedSlug === 'searching') return 'searching';
    if (normalizedSlug === 'binary-search') return 'binary-search';
    if (normalizedSlug === 'sorting') return 'sorting';
    if (normalizedSlug === 'recursion') return 'recursion';
    if (normalizedSlug === 'trees') return 'trees';
    if (normalizedSlug === 'graph') return 'graph';

    // Fuzzy matching for common variations
    if (normalizedSlug.includes('linked-list')) return 'linked-lists';
    if (normalizedSlug.includes('stack')) return 'stack';
    if (normalizedSlug.includes('queue')) return 'queue';
    if (normalizedSlug.includes('tree') || normalizedSlug.includes('binary'))
      return 'trees';
    if (normalizedSlug.includes('graph')) return 'graph';
    if (normalizedSlug.includes('search')) return 'searching';
    if (normalizedSlug.includes('sort')) return 'sorting';
    if (normalizedSlug.includes('recursion')) return 'recursion';

    // Default fallback
    return 'sorting';
  };

  const tabs = [
    {
      id: 'content',
      label: 'Content',
      content: <div className="mt-4">{children}</div>,
    },
    {
      id: 'visualization',
      label: 'Visualization',
      content: (
        <div className="mt-6">
          <DataStructureVisualizer topic={getDSATopicFromSlug(_topic.slug)} />
        </div>
      ),
    },
  ];

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <DraggableCircle
          size={circleSize}
          onClick={() => setShowEditor(true)}
        />
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
        <main>
          <div className="relative">
            <div className="absolute right-4 top-4 z-10"></div>
            <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 lg:px-16">
              <Tabs tabs={tabs} defaultActiveTab="content" />
            </div>
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
