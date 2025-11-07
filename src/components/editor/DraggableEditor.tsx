'use client';

import { X } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useState, useRef, useEffect, useCallback } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const JsEditor = dynamic(
  () =>
    import('@/components/CodeEditor').then((mod) => {
      const JsEditorComponent = (props: {
        initialCode?: string;
        showAlgorithm?: boolean;
      }) => {
        const [code, setCode] = React.useState(
          props.initialCode || '// Write your JavaScript code here'
        );
        return (
          <mod.default
            code={code}
            onCodeChange={setCode}
            showAlgorithm={props.showAlgorithm}
          />
        );
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
  hideTabs?: boolean;
  showAlgorithm?: boolean;
}

export function DraggableEditor({
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 800, height: 600 },
  defaultEditorType = 'javascript',
  defaultPythonCode = '# Write your Python code here and click Run to execute it',
  onClose,
  onPythonCodeChange,
  hideTabs = false,
  showAlgorithm = false,
}: DraggableEditorProps) {
  const [editorType, setEditorType] = useState<EditorType>(defaultEditorType);
  const [pythonCode, setPythonCode] = useState(defaultPythonCode);
  const [dimensions, setDimensions] = useState(defaultSize);
  const [position, setPosition] = useState(defaultPosition);

  useEffect(() => {
    setPosition(defaultPosition);
  }, [defaultPosition]);

  useEffect(() => {
    setDimensions(defaultSize);
  }, [defaultSize]);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, _setIsResizing] = useState(false);
  const [dragStart, _setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, _setResizeStart] = useState({ x: 0, y: 0 });
  const [startDimensions, _setStartDimensions] = useState({
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

  const renderEditor = () => {
    const editorContent = (type: EditorType) => {
      if (type === 'javascript') {
        return (
          <JsEditor
            initialCode="// Write your JavaScript code here"
            showAlgorithm={showAlgorithm}
          />
        );
      } else {
        return (
          <PythonEditor
            initialCode={pythonCode}
            onCodeChange={handlePythonCodeChange}
            showAlgorithm={showAlgorithm}
          />
        );
      }
    };

    if (hideTabs) {
      return (
        <div className="flex-1 overflow-hidden">
          {editorContent(defaultEditorType)}
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-hidden">{editorContent(editorType)}</div>
    );
  };

  useEffect(() => {
    setPosition(defaultPosition);
  }, [defaultPosition]);

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
      _setIsResizing(false);
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
      <div className="flex flex-col h-full bg-background border rounded-lg overflow-hidden">
        <div
          role="button"
          tabIndex={0}
          aria-label="Move editor"
          className="flex items-center justify-between px-4 py-2 bg-muted border-b cursor-move focus:outline-none focus:ring-2 focus:ring-primary"
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsDragging(true);
            _setDragStart({
              x: e.clientX - position.x,
              y: e.clientY - position.y,
            });
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsDragging(true);
            }
          }}
          onBlur={() => {
            setIsDragging(false);
          }}
        >
          {!hideTabs ? (
            <Tabs
              value={editorType}
              onValueChange={(value) => setEditorType(value as EditorType)}
              className="w-full"
            >
              <TabsList className="grid w-[200px] grid-cols-2">
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
            </Tabs>
          ) : (
            <div className="text-sm font-medium">Code Editor</div>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-muted-foreground/10"
            aria-label="Close editor"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {renderEditor()}
        <div
          className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-muted-foreground"
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            _setIsResizing(true);
            _setResizeStart({ x: e.clientX, y: e.clientY });
            _setStartDimensions(dimensions);
          }}
          role="button"
          tabIndex={-1}
          aria-label="Resize editor"
        />
      </div>
    </div>
  );
}
