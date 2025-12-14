'use client';

import { Copy, Loader2, Play, Square, Trash2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/theme-provider';
import { cn } from '@/lib/utils';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
});

const OUTPUT_DEBOUNCE_MS = 50;
const STOP_BUTTON_DELAY_MS = 500;

const format = (v: any) =>
  typeof v === 'string' ? `"${v}"` : JSON.stringify(v, null, 2);

export const JavaScriptCodeEditor = ({
  initialCode,
  className,
  height,
  readOnly = false,
  showRunButton = true,
  showOutput = true,
  onCodeChange,
  onOutput,
}: {
  initialCode: string;
  className?: string;
  height?: string | number;
  readOnly?: boolean;
  showRunButton?: boolean;
  showOutput?: boolean;
  onCodeChange?: (value: string) => void;
  onOutput?: (output: string) => void;
}) => {
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);
  const workerRef = useRef<Worker | null>(null);
  const stopTimerRef = useRef<number | null>(null);

  const bufferRef = useRef('');
  const debounceRef = useRef<number | null>(null);

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showStop, setShowStop] = useState(false);

  const flush = () => {
    const newOutput = bufferRef.current;
    setOutput(newOutput);
    onOutput?.(newOutput);
  };

  const append = (line: string) => {
    bufferRef.current += line + '\n';
    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      flush();
    }, OUTPUT_DEBOUNCE_MS);
  };

  const clearConsole = () => {
    bufferRef.current = '';
    const clearedOutput = '';
    setOutput(clearedOutput);
    onOutput?.(clearedOutput);
  };

  // ---------- Execution ----------
  const runCode = useCallback(() => {
    if (!editorRef.current) return;

    bufferRef.current = '';
    setOutput('');
    setIsRunning(true);
    setShowStop(false);

    stopTimerRef.current = window.setTimeout(
      () => setShowStop(true),
      STOP_BUTTON_DELAY_MS
    );

    const worker = new Worker(
      new URL('./codeRunner.worker.ts', import.meta.url)
    );
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const { type, payload } = e.data;

      if (type === 'log' || type === 'warn') {
        append(payload.map(format).join(' '));
      }

      if (type === 'error') {
        append('Error: ' + payload.map(format).join(' '));
      }

      if (type === 'table') {
        append(JSON.stringify(payload, null, 2));
      }

      if (type === 'status') {
        if (payload === 'running') return;

        if (
          payload === 'done' ||
          payload === 'idle-timeout' ||
          payload === 'stopped-by-user' ||
          payload === 'error'
        ) {
          if (stopTimerRef.current !== null) {
            clearTimeout(stopTimerRef.current);
          }
          setShowStop(false);
          setIsRunning(false);
          append(`--- ${payload} ---`);
          worker.terminate();
          workerRef.current = null;
        }
      }
    };

    worker.postMessage({
      code: editorRef.current.getValue(),
    });
  }, []);

  const stopExecution = () => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'STOP' });
      workerRef.current.terminate();
      workerRef.current = null;
    }

    if (stopTimerRef.current !== null) {
      clearTimeout(stopTimerRef.current);
    }
    setShowStop(false);
    setIsRunning(false);
    append('--- stopped by user ---');
  };

  const copyCode = async () => {
    if (!editorRef.current) return;
    await navigator.clipboard.writeText(editorRef.current.getValue());
  };

  return (
    <div className={cn('border rounded-lg overflow-hidden', className)}>
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b bg-muted">
        <span className="text-xs font-mono">JavaScript</span>

        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={copyCode}>
            <Copy className="w-4 h-4 mr-1" /> Copy
          </Button>

          {showRunButton && (
            <Button size="sm" onClick={runCode} disabled={isRunning}>
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <Play className="w-4 h-4 mr-1" />
              )}
              Run
            </Button>
          )}

          {showStop && (
            <Button size="sm" variant="destructive" onClick={stopExecution}>
              <Square className="w-4 h-4 mr-1" /> Stop
            </Button>
          )}
        </div>
      </div>

      {/* Editor */}
      <MonacoEditor
        height={height ?? 300}
        language="javascript"
        theme={theme === 'light' ? 'vs-light' : 'vs-dark'}
        defaultValue={initialCode}
        onMount={(editor) => (editorRef.current = editor)}
        onChange={(value) => onCodeChange?.(value || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          readOnly: readOnly,
        }}
      />

      {/* Console */}
      {showOutput && (
        <div className="border-t">
          <div className="flex justify-between items-center px-3 py-2 bg-muted/50">
            <span className="text-xs font-mono">Console</span>

            {output && (
              <Button size="sm" variant="ghost" onClick={clearConsole}>
                <Trash2 className="w-4 h-4 mr-1" /> Clear
              </Button>
            )}
          </div>

          <div className="p-3 font-mono text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
            {isRunning && (
              <div className="italic text-muted-foreground mb-1">running…</div>
            )}

            {output ? (
              <pre className="whitespace-pre-wrap">{output}</pre>
            ) : !isRunning ? (
              <span className="italic text-muted-foreground">
                Run the code to see output
              </span>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
