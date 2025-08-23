'use client';

import { Play, RotateCw, Eraser } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { cn } from '@/lib/utils';

// Type declarations for Pyodide
declare global {
  interface Window {
    loadPyodide: (options: { indexURL: string }) => Promise<{
      runPythonAsync: (code: string) => Promise<any>;
      runPython: (code: string) => any;
      loadPackagesFromImports: (code: string) => Promise<void>;
    }>;
  }
}

interface PythonCodeEditorProps {
  initialCode?: string;
  className?: string;
  onCodeChange?: (code: string) => void;
  readOnly?: boolean;
  _height?: string | number;
  _showLineNumbers?: boolean;
  _theme?: 'light' | 'dark';
}

export function PythonCodeEditor({
  initialCode = '# Write your Python code here\nprint("Hello, World!")\n\n# Example function\ndef add(a, b):\n    return a + b\n\n# Call the function and output result\nprint("2 + 3 =", add(2, 3))',
  className = '',
  onCodeChange,
  readOnly = false,
}: PythonCodeEditorProps) {
  const [algorithm, setAlgorithm] = useState<string>(
    ['# Write your algorithm here'].join('\n')
  );
  const [code, setCode] = useState(initialCode);
  const [_error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<{
    output: string;
    error?: string;
    stack?: string;
    executionTime?: number;
  } | null>(null);
  const pyodideRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Load Pyodide from CDN
  const loadPyodide = useCallback(async () => {
    if (!window.loadPyodide) {
      // Load the Pyodide script
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
      script.async = true;
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    try {
      const pyodide = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/',
      });
      pyodideRef.current = pyodide;
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load Pyodide:', err);
      setError('Failed to load Python runtime. Please try again later.');
      setIsLoading(false);
    }
  }, []);

  // Initialize Pyodide
  useEffect(() => {
    loadPyodide();
  }, [loadPyodide]);

  const runCode = useCallback(async () => {
    if (!pyodideRef.current || isRunning) return;

    setIsRunning(true);
    setResult(null);
    setError(null);

    try {
      // Initialize stdout capture
      await pyodideRef.current.runPythonAsync('import sys');

      // Override stdout to capture output
      await pyodideRef.current.runPythonAsync(`
import io
class StdoutCatcher(io.StringIO):
    def write(self, text):
        super().write(text)
        return len(text)
sys.stdout = StdoutCatcher()
      `);

      // Run the actual code
      const startTime = performance.now();
      await pyodideRef.current.runPythonAsync(code);
      const executionTime = performance.now() - startTime;

      // Get the captured output
      const output = await pyodideRef.current.runPythonAsync(
        'sys.stdout.getvalue()'
      );

      setResult({
        output: output || '',
        executionTime,
      });
    } catch (err) {
      setResult({
        output: '',
        error: err instanceof Error ? err.message : String(err),
        executionTime: 0,
      });
    } finally {
      setIsRunning(false);
    }
  }, [code, isRunning]);

  const _handleCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newCode = e.target.value;
      setCode(newCode);
      if (onCodeChange) {
        onCodeChange(newCode);
      }
    },
    [onCodeChange]
  );

  // Reset function (commented out as it's not currently used)
  // const _resetCode = useCallback(() => {
  //   setCode(initialCode);
  //   setResult(null);
  //   if (onCodeChange) {
  //     onCodeChange(initialCode);
  //   }
  // }, [initialCode, onCodeChange]);

  // Handle keyboard shortcut for running code
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [runCode]);

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-background rounded-lg overflow-hidden border',
        className
      )}
    >
      <PanelGroup direction="horizontal" className="flex-1">
        {/* Editor Panel */}
        <Panel defaultSize={30} minSize={20} className="flex flex-col">
          <div className="flex items-center justify-between p-2 border-b bg-muted/10">
            <div className="text-sm font-medium px-2">Python Editor</div>
            <div className="flex space-x-2"></div>
          </div>
          <div className="flex-1 overflow-auto">
            <textarea
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm bg-background text-foreground outline-none resize-none"
              spellCheck={false}
              placeholder="# Write your algorithm or notes here..."
              style={{
                tabSize: 2,
                lineHeight: '1.5',
                fontFeatureSettings: '"rlig" 1, "calt" 1',
              }}
            />
          </div>
        </Panel>

        <PanelResizeHandle className="w-2 bg-border/50 hover:bg-primary/50 transition-colors" />

        {/* Main Content */}
        <Panel defaultSize={70} minSize={30} className="flex flex-col">
          <PanelGroup direction="vertical" className="flex-1">
            {/* Editor Panel */}
            <Panel defaultSize={70} minSize={30} className="flex flex-col">
              <div className="flex items-center justify-between p-2 border-b bg-muted/10">
                <div className="text-sm font-medium px-2">Python Editor</div>
                <div className="flex space-x-2">
                  <button
                    onClick={runCode}
                    disabled={isLoading || isRunning}
                    className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                  >
                    {isLoading ? (
                      <RotateCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    ) : isRunning ? (
                      <RotateCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    ) : (
                      <Play className="h-3.5 w-3.5 mr-1.5" />
                    )}
                    {isRunning ? 'Running...' : 'Run (Ctrl+Enter)'}
                  </button>
                  <button
                    onClick={() => {
                      setResult(null);
                      setError(null);
                    }}
                    disabled={!result}
                    className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                  >
                    <Eraser className="h-3.5 w-3.5 mr-1.5" />
                    Clear
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    onCodeChange?.(e.target.value);
                  }}
                  className="w-full h-full p-4 font-mono text-sm bg-background text-foreground outline-none resize-none"
                  spellCheck={false}
                  readOnly={readOnly || isRunning}
                  style={{
                    tabSize: 4,
                    lineHeight: '1.5',
                    fontFeatureSettings: '"rlig" 1, "calt" 1',
                  }}
                />
              </div>
            </Panel>

            <PanelResizeHandle className="h-2 bg-border/50 hover:bg-primary/50 transition-colors" />

            {/* Output Panel */}
            <Panel defaultSize={30} minSize={10} className="flex flex-col">
              <div className="flex items-center justify-between p-2 border-b bg-muted/10">
                <div className="text-sm font-medium px-2">Output</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {result?.executionTime && (
                    <span className="mr-2">
                      {result.executionTime.toFixed(2)} ms
                    </span>
                  )}
                  {result?.error && (
                    <span className="text-destructive">Execution Error</span>
                  )}
                </div>
              </div>
              <div
                ref={outputRef}
                className="flex-1 overflow-auto p-4 font-mono text-sm bg-background text-foreground whitespace-pre-wrap"
              >
                {isLoading ? (
                  <div className="text-muted-foreground">
                    Loading Python runtime...
                  </div>
                ) : result?.error ? (
                  <div className="text-destructive">
                    <div className="font-semibold">Error:</div>
                    <div className="whitespace-pre-wrap">{result.error}</div>
                    {result?.error && (
                      <div className="text-red-500 text-sm">
                        {result.error}
                        <div className="font-semibold">Stack trace:</div>
                        <div className="whitespace-pre-wrap">
                          {result.stack}
                        </div>
                      </div>
                    )}
                  </div>
                ) : result?.output ? (
                  <div className="whitespace-pre-wrap">{result.output}</div>
                ) : (
                  <div className="text-muted-foreground">
                    Run the code to see the output here
                  </div>
                )}
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
}
