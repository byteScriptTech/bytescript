'use client';

import dynamic from 'next/dynamic';
import React, { useState } from 'react';

import { DraggableCircle } from '@/components/ui/DraggableCircle';

// Dynamically import the DraggableEditor to avoid SSR issues
const DraggableEditor = dynamic(
  () =>
    import('@/components/editor/DraggableEditor').then(
      (mod) =>
        mod.DraggableEditor as React.ComponentType<{
          defaultPosition?: { x: number; y: number };
          defaultSize?: { width: number; height: string | number };
          defaultEditorType?: string;
          defaultPythonCode?: string;
          onClose?: () => void;
        }>
    ),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-background" />,
  }
);

interface PatternPageClientProps {
  children: React.ReactNode;
}

export function PatternPageClient({ children }: PatternPageClientProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [editorCode] = useState('');
  const circleSize = 50;

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 right-4 z-50">
        <DraggableCircle
          size={circleSize}
          onClick={() => setShowEditor(!showEditor)}
        />
      </div>
      <div>{children}</div>
      {showEditor && (
        <DraggableEditor
          defaultEditorType="javascript"
          defaultPythonCode={editorCode}
        />
      )}
    </div>
  );
}
