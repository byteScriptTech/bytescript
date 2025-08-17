'use client';

import { useState, useRef, useEffect } from 'react';
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

  const handleRunCode = () => {
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
  };

  const clearOutput = () => {
    setResult(null);
  };

  // Handle keyboard shortcut (Ctrl+Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleRunCode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [code]);

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

  const renderEditor = (isMobile = false) => (
    <div className={`flex-1 flex flex-col ${!isMobile ? 'h-full' : 'h-64'}`}>
      <div className="flex items-center justify-between p-2 border-b bg-muted/30">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <svg
            className="w-4 h-4 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM15 7h2v2h-2V7zm-4 0h2v2h-2V7zM7 7h2v2H7V7zm8 4h2v2h-2v-2zm-4 0h2v2h-2v-2zm-4 0h2v2H7v-2zm8 4h2v2h-2v-2zm-4 0h2v2h-2v-2zm-4 0h2v2H7v-2z" />
          </svg>
          script.js
        </div>
        {!isMobile && (
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            title="Run (Ctrl+Enter)"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full p-4 font-mono text-sm bg-background text-foreground focus:outline-none resize-none"
          spellCheck="false"
          placeholder="// Enter your JavaScript code here..."
          style={{
            lineHeight: '1.5',
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );

  const renderOutput = (isMobile = false) => (
    <div className={`flex-1 flex flex-col ${!isMobile ? 'h-full' : 'h-48'}`}>
      <div className="flex items-center justify-between p-2 border-b bg-muted/50">
        <div className="flex items-center gap-2 text-xs font-medium text-foreground">
          <svg
            className="w-4 h-4 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-mono font-semibold">Console</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearOutput}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Clear console"
            aria-label="Clear console"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        ref={outputRef}
        className={`overflow-auto p-4 text-sm bg-background ${!isMobile ? 'h-full' : 'h-48'}`}
      >
        {result ? (
          <div className="space-y-4">
            {result.output && (
              <div className="mb-4 last:mb-0">
                <div className="text-xs font-mono font-semibold text-muted-foreground mb-1.5 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Output:
                </div>
                <div className="font-mono text-sm text-foreground bg-muted/20 p-3 rounded-md whitespace-pre-wrap border border-muted/30">
                  {result.output}
                </div>
              </div>
            )}
            {result.error && (
              <div className="mb-4 last:mb-0">
                <div className="text-xs font-mono font-semibold text-destructive mb-1.5 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-destructive mr-2"></span>
                  Error:
                </div>
                <div className="font-mono text-sm text-destructive bg-destructive/5 p-3 rounded-md whitespace-pre-wrap border border-destructive/20">
                  {result.error}
                </div>
              </div>
            )}
            {result.stack && (
              <div className="mb-4 last:mb-0">
                <div className="text-xs font-mono font-semibold text-destructive/80 mb-1.5 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-destructive/80 mr-2"></span>
                  Stack Trace:
                </div>
                <div className="font-mono text-xs text-destructive/80 bg-destructive/5 p-3 rounded-md overflow-x-auto border border-destructive/10">
                  <pre className="whitespace-pre-wrap break-all">
                    {result.stack}
                  </pre>
                </div>
              </div>
            )}
            {result.executionTime !== undefined && (
              <div className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border/50">
                <span className="inline-flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5 text-muted-foreground/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-mono">
                    Executed in {result.executionTime.toFixed(2)}ms
                  </span>
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 mb-4 text-muted-foreground/30">
              <svg
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground/80">
              Click &quot;Run Code&quot; to execute your code
            </p>
            <p className="text-xs text-muted-foreground/50 mt-2">
              Output will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full p-4 bg-background">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            JavaScript Playground
          </h2>
        </div>
        <button
          onClick={handleRunCode}
          disabled={isRunning}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed
                    bg-[#00BFA6] hover:bg-[#00c7ae] focus:outline-none focus:ring-2 focus:ring-[#00BFA6] transition-colors flex items-center justify-center gap-1.5"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      </div>

      {/* Desktop View - Side by Side Panels */}
      <div className="hidden md:block flex-1 rounded-lg overflow-hidden border border-border bg-background shadow-sm">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={50} minSize={30} className="flex flex-col">
            {renderEditor()}
          </Panel>
          <PanelResizeHandle className="w-1 bg-muted hover:bg-primary/20 transition-colors" />
          <Panel defaultSize={50} minSize={30} className="flex flex-col">
            {renderOutput()}
          </Panel>
        </PanelGroup>
      </div>

      {/* Mobile View - Vertical Resizable Panels */}
      <div className="md:hidden flex-1 flex flex-col rounded-lg overflow-hidden border border-border bg-background shadow-sm">
        <PanelGroup direction="vertical">
          <Panel defaultSize={60} minSize={30} className="flex flex-col">
            {renderEditor(true)}
          </Panel>
          <PanelResizeHandle className="h-2 bg-muted hover:bg-primary/20 transition-colors flex items-center justify-center">
            <div className="w-16 h-1 bg-muted-foreground/30 rounded-full" />
          </PanelResizeHandle>
          <Panel defaultSize={40} minSize={30} className="flex flex-col">
            {renderOutput(true)}
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
