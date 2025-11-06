'use client';

import { Copy, Loader2, Play } from 'lucide-react';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { useCallback } from 'react';

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
  showRunButton?: boolean;
  showOutput?: boolean;
}

export const JavaScriptCodeEditor = ({
  initialCode,
  readOnly = true,
  className,
  onRun,
  showRunButton = true,
  showOutput = true,
}: JavaScriptCodeEditorProps) => {
  const editorRef = React.useRef<any>(null);
  const [isRunning, setIsRunning] = React.useState(false);
  const [output, setOutput] = React.useState<string>('');
  const [isMounted, setIsMounted] = React.useState(false);
  console.log(output, 'output');
  // Handle editor mount
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
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

  const executeCode = useCallback(
    async (code: string) => {
      setIsRunning(true);
      setOutput('Running...');

      try {
        if (onRun) {
          await onRun(code);
          return;
        }

        // Simple execution without any wrapping
        const execute = new Function('console', code);

        // Create a console that captures output
        const logs: string[] = [];
        const safeConsole = {
          ...console,
          log: (...args: unknown[]) => {
            const message = args
              .map((arg) =>
                typeof arg === 'object' && arg !== null
                  ? JSON.stringify(arg, null, 2)
                  : String(arg)
              )
              .join(' ');
            logs.push(message);
            console.log(...args);
          },
        };

        // Execute the code
        const result = execute(safeConsole);

        // Handle both sync and async results
        if (result && typeof result.then === 'function') {
          // For async code
          try {
            const asyncResult = await result;
            const output = [
              ...logs,
              asyncResult !== undefined ? String(asyncResult) : '',
            ]
              .filter(Boolean)
              .join('\n');
            setOutput(output || 'Async code executed successfully');
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            setOutput(
              [...logs, `Error: ${errorMessage}`].filter(Boolean).join('\n')
            );
          }
        } else {
          // For sync code
          const output = [...logs, result !== undefined ? String(result) : '']
            .filter(Boolean)
            .join('\n');
          setOutput(output || 'Code executed successfully');
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        setOutput(`Error: ${errorMessage}`);
      } finally {
        setIsRunning(false);
      }
    },
    [onRun]
  );

  const handleRun = React.useCallback(async () => {
    if (!editorRef.current) return;
    await executeCode(editorRef.current.getValue());
  }, [executeCode]);

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
          {showRunButton && (
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
      {showOutput && (
        <div className="border-t border-border bg-background/50">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
            <span className="text-xs font-medium text-muted-foreground">
              Output
            </span>
            {output && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setOutput('')}
              >
                Clear
              </Button>
            )}
          </div>
          <div
            className="p-4 overflow-auto"
            style={{ minHeight: '80px', maxHeight: '300px' }}
          >
            {output ? (
              <div className="font-mono text-sm">
                <pre className="whitespace-pre-wrap break-words text-foreground">
                  {output}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-16 text-sm text-muted-foreground italic">
                Run the code to see the output here
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
