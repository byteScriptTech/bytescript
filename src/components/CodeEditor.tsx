'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { JavaScriptCodeEditor } from './common/JavaScriptCodeEditor';

type ExecutionResult = {
  output: string;
  result?: any;
  error?: string;
  stack?: string;
  executionTime?: number;
};

interface CodeEditorProps {
  code?: string;
  onCodeChange?: (code: string) => void;
  initialCode?: string;
  showAlgorithm?: boolean;
}

export default function CodeEditor({
  code: externalCode,
  onCodeChange,
  initialCode = '// Write your JavaScript code here\nconsole.log("Hello, World!");',
  showAlgorithm = false,
}: CodeEditorProps) {
  const [currentCode, setCurrentCode] = useState(externalCode || initialCode);

  // Update editor when external code changes
  useEffect(() => {
    if (externalCode !== undefined) {
      setCurrentCode(externalCode);
    }
  }, [externalCode]);

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCurrentCode(newCode);
      onCodeChange?.(newCode);
    },
    [onCodeChange]
  );

  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Utility function to normalize all logged values
  const normalizeOutput = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  // Execute code entered in editor
  const executeCode = useCallback((executionCode: string): ExecutionResult => {
    let output = '';

    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      output += args.map(normalizeOutput).join(' ') + '\n';
      originalLog(...args);
    };

    console.error = (...args) => {
      output += 'Error: ' + args.map(normalizeOutput).join(' ') + '\n';
      originalError(...args);
    };

    console.warn = (...args) => {
      output += 'Warning: ' + args.map(normalizeOutput).join(' ') + '\n';
      originalWarn(...args);
    };

    const start = performance.now();

    try {
      const result = new Function(executionCode)();
      const end = performance.now();

      return {
        output,
        result,
        executionTime: end - start,
      };
    } catch (error: any) {
      return {
        output,
        error: error.message,
        stack: error.stack,
      };
    } finally {
      // Restore original console
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    }
  }, []);

  const handleRunCode = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    setResult(null);

    setTimeout(() => {
      const execResult = executeCode(currentCode);
      setResult(execResult);
      setIsRunning(false);
    }, 50);
  }, [currentCode, isRunning, executeCode]);

  const clearOutput = useCallback(() => {
    setResult(null);
  }, []);

  // Scroll output automatically
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [result]);

  const [algorithm, setAlgorithm] = useState('// Write your algorithm here\n');

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden border">
        <PanelGroup direction="horizontal" className="flex-1">
          {/* Algorithm Panel */}
          {showAlgorithm && (
            <>
              <Panel
                defaultSize={30}
                minSize={0}
                className="flex flex-col border-r"
              >
                <div className="flex items-center justify-between p-2 border-b bg-muted/10">
                  <div className="text-sm font-medium px-2">Algorithm</div>
                </div>
                <textarea
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  className="flex-1 p-4 font-mono text-sm bg-background outline-none resize-none"
                  spellCheck={false}
                />
              </Panel>

              <PanelResizeHandle className="w-2 bg-border/50 hover:bg-primary/60 transition-colors" />
            </>
          )}

          {/* Editor + Output Panel */}
          <Panel defaultSize={70} minSize={30} className="flex flex-col">
            <PanelGroup direction="vertical" className="flex-1">
              {/* JavaScript Editor Panel */}
              <Panel defaultSize={70} minSize={30} className="flex flex-col">
                <div className="flex items-center justify-between p-2 border-b bg-muted/10">
                  <div className="text-sm font-medium px-2">
                    JavaScript Editor
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleRunCode}
                      disabled={isRunning}
                      className="border bg-background hover:bg-accent h-8 px-3 text-xs rounded-md"
                    >
                      {isRunning ? 'Running...' : 'Run (Ctrl+Enter)'}
                    </button>
                    <button
                      onClick={clearOutput}
                      disabled={!result}
                      className="border bg-background hover:bg-accent h-8 px-3 text-xs rounded-md"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 overflow-hidden">
                  <JavaScriptCodeEditor
                    initialCode={currentCode}
                    onCodeChange={handleCodeChange}
                    readOnly={false}
                    className="h-full w-full"
                    showRunButton={false}
                    showOutput={false}
                  />
                </div>
              </Panel>

              {/* Resize Handle */}
              <PanelResizeHandle className="h-2 bg-border hover:bg-primary/60 transition-colors" />

              {/* Console Output Panel */}
              <Panel defaultSize={30} minSize={20} className="flex flex-col">
                <div className="flex items-center justify-between p-2 border-b bg-muted/10">
                  <div className="text-sm font-medium px-2">Console Output</div>
                </div>

                <div
                  ref={outputRef}
                  className="flex-1 overflow-auto p-4 text-sm font-mono whitespace-pre-wrap bg-background"
                >
                  {isRunning ? (
                    <div className="text-muted-foreground">Running...</div>
                  ) : result ? (
                    <>
                      {result.output}
                      {result.error && (
                        <div className="text-red-500 mt-2">
                          <strong>Error:</strong> {result.error}
                          {result.stack && (
                            <pre className="mt-1 text-xs text-red-400 whitespace-pre-wrap">
                              {result.stack}
                            </pre>
                          )}
                        </div>
                      )}

                      {result.executionTime && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Execution time: {result.executionTime.toFixed(2)}ms
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
