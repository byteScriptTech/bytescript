'use client';

import { X } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useState, useRef, useEffect, useCallback } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const JsEditor = dynamic(
  () =>
    import('@/components/CodeEditor').then((mod) => {
      const JsEditorComponent = (props: { initialCode?: string }) => {
        const [code, setCode] = React.useState(
          props.initialCode || '// Write your JavaScript code here'
        );
        return <mod.default code={code} onCodeChange={setCode} />;
      };
      return JsEditorComponent;
    }),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    ),
  }
);

const PythonEditor = dynamic<{
  initialCode?: string;
  className?: string;
  onCodeChange?: (code: string) => void;
  readOnly?: boolean;
  showAlgorithm?: boolean;
}>(
  () =>
    import('@/components/common/PythonCodeEditor').then(
      (mod) =>
        mod.PythonCodeEditor as React.ComponentType<{
          initialCode?: string;
          className?: string;
          onCodeChange?: (code: string) => void;
          readOnly?: boolean;
          showAlgorithm?: boolean;
        }>
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    ),
  }
);

type EditorType = 'javascript' | 'python';

interface DraggableEditorProps {
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  defaultEditorType?: EditorType;
  defaultPythonCode?: string;
  onClose?: () => void;
  onPythonCodeChange?: (code: string) => void;
}

export function DraggableEditor({
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 800, height: 600 },
  defaultEditorType = 'javascript',
  defaultPythonCode = '# Write your Python code here and click Run to execute it',
  onClose,
  onPythonCodeChange,
}: DraggableEditorProps) {
  const [editorType, setEditorType] = useState<EditorType>(defaultEditorType);
  const [pythonCode, setPythonCode] = useState(defaultPythonCode);
  const [dimensions, setDimensions] = useState(defaultSize);
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [startDimensions, setStartDimensions] = useState({
    width: 0,
    height: 0,
  });
  const editorRef = useRef<HTMLDivElement>(null);

  const handlePythonCodeChange = useCallback(
    (code: string) => {
      setPythonCode(code);
      onPythonCodeChange?.(code);
    },
    [onPythonCodeChange]
  );

  // Mouse down handler is now handled by individual interactive elements
  const centerEditor = useCallback(() => {
    if (typeof window !== 'undefined' && editorRef.current) {
      const { innerWidth, innerHeight } = window;
      setPosition({
        x: (innerWidth - dimensions.width) / 2,
        y: (innerHeight - dimensions.height) / 2,
      });
    }
  }, [dimensions]);

  useEffect(() => {
    centerEditor();
  }, [centerEditor]);

  // Handle mouse move for both dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      } else if (isResizing) {
        const newWidth = Math.max(
          400,
          startDimensions.width + (e.clientX - resizeStart.x)
        );
        const newHeight = Math.max(
          300,
          startDimensions.height + (e.clientY - resizeStart.y)
        );
        setDimensions({
          width: newWidth,
          height: newHeight,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, startDimensions, resizeStart]);

  return (
    <div
      ref={editorRef}
      className="fixed bg-background rounded-lg shadow-2xl border border-border overflow-hidden flex flex-col z-50"
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        left: `${position.x}px`,
        top: `${position.y}px`,
        minWidth: '400px',
        minHeight: '300px',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Code editor"
      tabIndex={-1}
    >
      {/* Header with drag handle and close button */}
      <div className="flex items-center justify-between h-10 bg-muted/50 border-b border-border">
        <div
          className="flex-1 h-full flex items-center px-4 cursor-move"
          onMouseDown={(e) => {
            // Only start dragging if clicking on the header itself, not on buttons
            if (
              e.target === e.currentTarget ||
              (e.target as HTMLElement).closest('button') === null
            ) {
              setIsDragging(true);
              setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
              });
            }
          }}
          onKeyDown={(e) => {
            if (
              (e.key === 'Enter' || e.key === ' ') &&
              e.target === e.currentTarget
            ) {
              e.preventDefault();
              onClose?.();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Drag to move editor"
        >
          <Tabs
            value={editorType}
            onValueChange={(value) => {
              setEditorType(value as EditorType);
            }}
            className="h-full"
            aria-label="Editor language tabs"
          >
            <TabsList className="h-8">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-2"
          aria-label="Close editor"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Editor content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {editorType === 'javascript' ? (
          <div className="flex-1 overflow-auto">
            <JsEditor initialCode="// Write your JavaScript code here" />
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <PythonEditor
              initialCode={pythonCode}
              onCodeChange={handlePythonCodeChange}
              showAlgorithm={true}
            />
          </div>
        )}
      </div>

      {/* Resize handle */}
      <div
        className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsResizing(true);
          setResizeStart({ x: e.clientX, y: e.clientY });
          setStartDimensions(dimensions);
        }}
        role="button"
        tabIndex={-1}
        aria-label="Resize editor"
      >
        <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-muted-foreground" />
      </div>
    </div>
  );
}
