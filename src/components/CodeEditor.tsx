'use client';

import * as React from 'react';
const { useState, useRef, useEffect, useCallback } = React;
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

type ExecutionResult = {
  output: string;
  error?: string;
  stack?: string;
  executionTime?: number;
};

export default function CodeEditor() {
  const [code, setCode] = useState<string>(
    '// Write your JavaScript code here\nconsole.log("Hello, World!");\n\n// Example function\nfunction add(a, b) {\n  return a + b;\n}\n\n// Call the function and output result\nconsole.log("2 + 3 =", add(2, 3));'
  );
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const executeCode = (code: string): ExecutionResult => {
    const originalConsole = { log: console.log, error: console.error };
    let output = '';

    console.log = (...args) => {
      output +=
        args
          .map((arg) =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          )
          .join(' ') + '\n';
    };

    console.error = console.log;

    const startTime = performance.now();
    let error: string | undefined;
    let stack: string | undefined;

    try {
      const result = new Function(code)();
      if (result !== undefined) {
        output +=
          '\n' +
          (typeof result === 'object'
            ? JSON.stringify(result, null, 2)
            : String(result));
      }
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
      stack = e instanceof Error ? e.stack : undefined;
    } finally {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
    }

    const executionTime = performance.now() - startTime;
    return { output, error, stack, executionTime };
  };

  const handleRunCode = useCallback((): void => {
    if (isRunning) return;

    setIsRunning(true);
    setResult(null);

    // Use setTimeout to allow the UI to update before running the code
    setTimeout(() => {
      try {
        const result = executeCode(code);
        setResult(result);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack : undefined;
        setResult({
          output: '',
          error: errorMessage,
          stack: stack,
        });
      } finally {
        setIsRunning(false);
      }
    }, 100);
  }, [code, isRunning]);

  const clearOutput = React.useCallback((): void => {
    setResult(null);
  }, []);

  // Handle keyboard shortcut (Ctrl+Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleRunCode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return (): void => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleRunCode]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    adjustHeight();
    textarea.addEventListener('input', adjustHeight);
    return () => {
      textarea.removeEventListener('input', adjustHeight);
    };
  }, []);

  // Scroll to bottom of output when new content is added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [result]);

  const [algorithm, setAlgorithm] = useState<string>(
    '// Write your algorithm here\n'
  );

  return (
    <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden border">
      <PanelGroup direction="horizontal" className="flex-1">
        {/* Algorithm Editor Panel */}
        <Panel
          defaultSize={30}
          minSize={20}
          className="flex flex-col border-r border-border"
        >
          <div className="flex items-center justify-between p-2 border-b bg-muted/10">
            <div className="text-sm font-medium px-2">Algorithm</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>Markdown Supported</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <textarea
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm bg-background text-foreground outline-none resize-none"
              spellCheck={false}
              placeholder="// Write your algorithm or notes here..."
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
                <div className="text-sm font-medium px-2">
                  JavaScript Editor
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 text-xs"
                  >
                    {isRunning ? 'Running...' : 'Run (Ctrl+Enter)'}
                  </button>
                  <button
                    onClick={clearOutput}
                    disabled={!result}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 text-xs"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full p-4 font-mono text-sm bg-background text-foreground outline-none resize-none"
                  spellCheck={false}
                  placeholder="// Enter your JavaScript code here..."
                  style={{
                    tabSize: 2,
                    lineHeight: '1.5',
                    fontFeatureSettings: '"rlig" 1, "calt" 1',
                  }}
                />
              </div>
            </Panel>

            {/* Output Panel */}
            <PanelResizeHandle className="h-2 w-full bg-border/50 dark:bg-gray-600 hover:bg-primary/50 dark:hover:bg-primary/70 transition-colors relative group">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-0.5 bg-gray-400 dark:bg-gray-400 rounded-full group-hover:bg-primary dark:group-hover:bg-primary" />
            </PanelResizeHandle>
            <Panel defaultSize={30} minSize={20} className="flex flex-col">
              <div className="flex items-center justify-between p-2 border-b bg-muted/10">
                <div className="text-sm font-medium px-2">Console Output</div>
                <div className="flex space-x-2">
                  <button
                    onClick={clearOutput}
                    disabled={!result}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 text-xs"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div
                ref={outputRef}
                className="flex-1 overflow-auto p-4 text-sm font-mono bg-background text-foreground whitespace-pre-wrap"
              >
                {isRunning ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2" />
                    Running...
                  </div>
                ) : result ? (
                  result.error ? (
                    <div className="text-red-500">
                      <div className="font-semibold">Error:</div>
                      <div>{result.error}</div>
                      {result.stack && (
                        <pre className="mt-2 text-xs text-red-400">
                          {result.stack}
                        </pre>
                      )}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{result.output}</div>
                  )
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
