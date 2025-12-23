'use client';

import {
  Copy,
  Loader2,
  Maximize2,
  Minimize2,
  Play,
  Square,
  Trash2,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/theme-provider';
import { cn } from '@/lib/utils';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
});

const OUTPUT_DEBOUNCE_MS = 50;
const STOP_BUTTON_DELAY_MS = 500;

// ---------- Pyodide typing ----------
declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<any>;
  }
}

interface PythonCodeEditorProps {
  initialCode: string;
  className?: string;
  height?: string | number;
  readOnly?: boolean;
  showRunButton?: boolean;
  showOutput?: boolean;
  showAlgorithm?: boolean;
  onCodeChange?: (value: string) => void;
  onOutput?: (output: string) => void;
}

export const PythonCodeEditor = ({
  initialCode,
  className,
  readOnly = false,
  showRunButton = true,
  showOutput = true,
  showAlgorithm = false,
  onCodeChange,
  onOutput,
}: PythonCodeEditorProps) => {
  const { theme } = useTheme();

  // ---------- Refs ----------
  const editorRef = useRef<any>(null);
  const pyodideRef = useRef<any>(null);
  const bufferRef = useRef('');
  const debounceRef = useRef<number | null>(null);
  const stopTimerRef = useRef<number | null>(null);

  // ---------- State ----------
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showStop, setShowStop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [algorithm, setAlgorithm] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // ---------- Output helpers ----------
  const flushOutput = useCallback(() => {
    const text = bufferRef.current;
    setOutput(text);
    onOutput?.(text);
  }, [onOutput]);

  const appendOutput = useCallback(
    (text: string) => {
      bufferRef.current += text + '\n';
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(flushOutput, OUTPUT_DEBOUNCE_MS);
    },
    [flushOutput]
  );

  const clearConsole = useCallback(() => {
    bufferRef.current = '';
    setOutput('');
    onOutput?.('');
  }, [onOutput]);

  // ---------- Load Pyodide once ----------
  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) {
      setIsLoading(false);
      return;
    }

    try {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
      script.async = true;

      await new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error('Failed to load Pyodide script'));
        document.head.appendChild(script);
      });

      if (!window.loadPyodide) {
        throw new Error('loadPyodide not available');
      }

      pyodideRef.current = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
      });

      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load Python runtime');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPyodide();
  }, [loadPyodide]);

  // ---------- Execution ----------
  const runCode = useCallback(async () => {
    if (!editorRef.current || !pyodideRef.current || isRunning) return;

    bufferRef.current = '';
    setOutput('');
    setError(null);
    setIsRunning(true);
    setShowStop(false);

    stopTimerRef.current = window.setTimeout(
      () => setShowStop(true),
      STOP_BUTTON_DELAY_MS
    );

    try {
      const code = editorRef.current.getValue();

      await pyodideRef.current.runPythonAsync(`
import sys, io
sys.stdout = io.StringIO()
      `);

      await pyodideRef.current.runPythonAsync(code);

      const result = await pyodideRef.current.runPythonAsync(
        'sys.stdout.getvalue()'
      );

      if (result) appendOutput(result);
      appendOutput('--- done ---');
    } catch (err: any) {
      appendOutput(`Error: ${err.message || String(err)}`);
    } finally {
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
      setShowStop(false);
      setIsRunning(false);
    }
  }, [appendOutput, isRunning]);

  const stopExecution = useCallback(() => {
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    setShowStop(false);
    setIsRunning(false);
    appendOutput('--- stopped by user ---');
  }, [appendOutput]);

  const copyCode = useCallback(async () => {
    if (!editorRef.current) return;
    await navigator.clipboard.writeText(editorRef.current.getValue());
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      editorContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // ---------- Render ----------
  return (
    <div
      ref={editorContainerRef}
      className={cn('h-full w-full flex flex-col', className)}
    >
      <div
        className={`flex flex-col h-full bg-background rounded-lg overflow-hidden border ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}
      >
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
                  placeholder="# Write your algorithm or notes here..."
                />
              </Panel>

              <PanelResizeHandle className="w-2 bg-border/50 hover:bg-primary/60 transition-colors" />
            </>
          )}

          {/* Editor + Console Panel */}
          <Panel
            defaultSize={showAlgorithm ? 70 : 100}
            minSize={30}
            className="flex flex-col"
          >
            <PanelGroup direction="vertical" className="flex-1">
              {/* Python Editor Panel */}
              <Panel
                defaultSize={showOutput ? 60 : 100}
                minSize={30}
                className="flex flex-col"
              >
                {/* Editor Header */}
                <div className="flex justify-between items-center px-4 py-2 border-b bg-muted">
                  <span className="text-xs font-mono">Python</span>

                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={copyCode}>
                      <Copy className="w-4 h-4 mr-1" /> Copy
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleFullscreen}
                      title={
                        isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'
                      }
                    >
                      {isFullscreen ? (
                        <Minimize2 className="w-4 h-4 mr-1" />
                      ) : (
                        <Maximize2 className="w-4 h-4 mr-1" />
                      )}
                      {isFullscreen ? 'Exit' : 'Fullscreen'}
                    </Button>

                    {showRunButton && (
                      <Button
                        size="sm"
                        onClick={runCode}
                        disabled={isRunning || isLoading}
                      >
                        {isRunning || isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-1" />
                        ) : (
                          <Play className="w-4 h-4 mr-1" />
                        )}
                        Run
                      </Button>
                    )}

                    {showStop && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={stopExecution}
                      >
                        <Square className="w-4 h-4 mr-1" /> Stop
                      </Button>
                    )}
                  </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 overflow-hidden">
                  <MonacoEditor
                    height="100%"
                    language="python"
                    theme={theme === 'light' ? 'vs-light' : 'vs-dark'}
                    defaultValue={initialCode}
                    onMount={(editor) => (editorRef.current = editor)}
                    onChange={(value) => onCodeChange?.(value || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: 'on',
                      readOnly,
                    }}
                  />
                </div>
              </Panel>

              {/* Console Panel */}
              {showOutput && (
                <>
                  <PanelResizeHandle className="h-2 bg-border hover:bg-primary/60 transition-colors" />

                  <Panel
                    defaultSize={40}
                    minSize={20}
                    className="flex flex-col"
                  >
                    <div className="flex justify-between items-center px-3 py-2 bg-muted/50">
                      <span className="text-xs font-mono">Console</span>
                      {output && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={clearConsole}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Clear
                        </Button>
                      )}
                    </div>

                    <div className="flex-1 p-3 font-mono text-sm whitespace-pre-wrap overflow-y-auto">
                      {isLoading && (
                        <div className="italic text-muted-foreground">
                          Loading Python runtime…
                        </div>
                      )}

                      {error && (
                        <div className="text-destructive mb-2">{error}</div>
                      )}

                      {isRunning && !isLoading && (
                        <div className="italic text-muted-foreground">
                          running…
                        </div>
                      )}

                      {output ? (
                        <pre>{output}</pre>
                      ) : (
                        !isRunning &&
                        !isLoading && (
                          <span className="italic text-muted-foreground">
                            Run the code to see output
                          </span>
                        )
                      )}
                    </div>
                  </Panel>
                </>
              )}
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};
