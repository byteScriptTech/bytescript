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
          showAlgorithm?: boolean;
          hideTabs?: boolean;
          onPythonCodeChange?: (code: string) => void;
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
      <DraggableCircle
        size={circleSize}
        onClick={() => setShowEditor(!showEditor)}
      />

      <div>{children}</div>
      {showEditor && (
        <DraggableEditor
          defaultPosition={{ x: 200, y: 70 }}
          defaultEditorType="javascript"
          defaultPythonCode={editorCode}
          defaultSize={{ width: 800, height: 500 }}
          onClose={() => setShowEditor(false)}
          showAlgorithm={true}
          hideTabs={false}
        />
      )}
    </div>
  );
}
