'use client';

import { Copy, Loader2, Play } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Dynamically import the Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
});

interface JavaScriptCodeEditorProps {
  initialCode: string;
  readOnly?: boolean;
  className?: string;
  onRun?: (code: string) => Promise<void>;
}

export const JavaScriptCodeEditor = ({
  initialCode,
  readOnly = true,
  className,
  onRun,
}: JavaScriptCodeEditorProps) => {
  const editorRef = useRef<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  // Handle editor mount
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Configure theme
    monaco.editor.defineTheme('vs-dark-custom', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
      },
    });

    monaco.editor.setTheme('vs-dark-custom');
    setIsMounted(true);
  };

  const handleRun = async () => {
    if (!editorRef.current || !onRun) return;

    setIsRunning(true);
    setOutput('Running...');

    try {
      await onRun(editorRef.current.getValue());
    } catch (error) {
      setOutput(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsRunning(false);
    }
  };

  const copyToClipboard = async () => {
    if (editorRef.current) {
      try {
        await navigator.clipboard.writeText(editorRef.current.getValue());
        // You might want to add a toast notification here
      } catch (error) {
        console.error('Failed to copy text: ', error);
      }
    }
  };

  return (
    <div className={cn('border rounded-lg overflow-hidden', className)}>
      <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b">
        <span className="text-xs font-mono text-muted-foreground">
          JavaScript
        </span>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={copyToClipboard}
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </Button>
          {onRun && (
            <Button
              variant="default"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={handleRun}
              disabled={isRunning || !isMounted}
            >
              {isRunning ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Play className="h-3 w-3 mr-1" />
              )}
              Run
            </Button>
          )}
        </div>
      </div>
      <div className="relative h-64">
        <MonacoEditor
          height="100%"
          language="javascript"
          theme="vs-dark"
          value={initialCode}
          options={{
            minimap: { enabled: false },
            readOnly,
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            wordWrap: 'on',
            scrollbar: {
              vertical: 'hidden',
              horizontal: 'hidden',
              handleMouseWheel: true,
            },
          }}
          onMount={handleEditorDidMount}
          onChange={() => {
            // Handle code changes if needed
          }}
        />
        {isRunning && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      {output && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              Output
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setOutput('')}
            >
              Clear
            </Button>
          </div>
          <pre className="text-xs font-mono whitespace-pre-wrap break-words">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
};
