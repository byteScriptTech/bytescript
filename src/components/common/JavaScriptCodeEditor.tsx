'use client';

import { Copy, Loader2, Play } from 'lucide-react';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/theme-provider';
import { cn } from '@/lib/utils';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
});

interface JavaScriptCodeEditorProps {
  initialCode: string;
  onCodeChange?: (code: string) => void;
  readOnly?: boolean;
  className?: string;
  showRunButton?: boolean;
  showOutput?: boolean;
  height?: string | number;
  onOutput?: (output: string) => void;
}

const formatValue = (value: any, depth = 0, seen = new WeakSet()): string => {
  const indent = '  '.repeat(depth);

  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value);
  if (typeof value === 'bigint') return value.toString() + 'n';
  if (typeof value === 'symbol') return value.toString();

  if (typeof value === 'function') {
    return `[Function${value.name ? ': ' + value.name : ''}]`;
  }

  if (value instanceof Date) return `Date(${value.toISOString()})`;
  if (value instanceof RegExp) return value.toString();
  if (value instanceof Error) return `${value.name}: ${value.message}`;

  if (Array.isArray(value)) {
    if (seen.has(value)) return '[Circular]';
    seen.add(value);
    const items = value.map((v) => formatValue(v, depth + 1, seen));
    return `[\n${indent}  ${items.join(`,\n${indent}  `)}\n${indent}]`;
  }

  if (value instanceof Map) {
    if (seen.has(value)) return 'Map { [Circular] }';
    seen.add(value);
    const entries = [...value.entries()].map(
      ([k, v]) => `${formatValue(k)} => ${formatValue(v, depth + 1, seen)}`
    );
    return `Map {\n${indent}  ${entries.join(`,\n${indent}  `)}\n${indent}}`;
  }

  if (value instanceof Set) {
    if (seen.has(value)) return 'Set { [Circular] }';
    seen.add(value);
    const items = [...value.values()].map((v) =>
      formatValue(v, depth + 1, seen)
    );
    return `Set {\n${indent}  ${items.join(`,\n${indent}  `)}\n${indent}}`;
  }

  if (typeof value === 'object') {
    if (seen.has(value)) return '{ [Circular] }';
    seen.add(value);

    const entries = Object.entries(value).map(
      ([key, val]) => `${key}: ${formatValue(val, depth + 1, seen)}`
    );
    return `{\n${indent}  ${entries.join(`,\n${indent}  `)}\n${indent}}`;
  }

  return String(value);
};

export const JavaScriptCodeEditor: React.FC<JavaScriptCodeEditorProps> = ({
  initialCode,
  readOnly = false,
  className,
  showRunButton = true,
  showOutput = true,
  height,
  onOutput,
}) => {
  const { theme } = useTheme();
  const editorRef = React.useRef<any>(null);
  const [output, setOutput] = React.useState('');
  const [isRunning, setIsRunning] = React.useState(false);
  const [code, setCode] = React.useState(initialCode);

  const runCode = useCallback(async () => {
    if (!editorRef.current) return;

    const currentCode = editorRef.current.getValue();
    setIsRunning(true);
    setOutput('');

    let logs: string[] = [];

    const originalLog = console.log;
    console.log = (...args) => {
      logs.push(args.map((v) => formatValue(v)).join(' '));
      originalLog(...args);
    };

    try {
      const wrapped = `
        (async () => {
          ${currentCode}
        })();
      `;

      const result = await new Function(wrapped)();

      if (result !== undefined) logs.push(formatValue(result));

      const finalOutput = logs.join('\n');
      setOutput(finalOutput);

      if (onOutput) onOutput(finalOutput);
    } catch (err: any) {
      const errMsg = 'Error: ' + err.message;
      setOutput(errMsg);
      if (onOutput) onOutput(errMsg);
    } finally {
      console.log = originalLog;
      setIsRunning(false);
    }
  }, [onOutput]);

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
  };

  const copyToClipboard = async () => {
    if (!editorRef.current) return;
    await navigator.clipboard.writeText(editorRef.current.getValue());
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
            <Copy className="h-3 w-3 mr-1" /> Copy
          </Button>

          {showRunButton && (
            <Button
              variant="default"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={runCode}
              disabled={isRunning}
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

      <MonacoEditor
        height={height ?? '100%'}
        language="javascript"
        theme={theme === 'light' ? 'vs-light' : 'vs-dark'}
        value={code}
        onMount={handleEditorMount}
        onChange={(value) => setCode(value || '')}
        options={{
          minimap: { enabled: false },
          readOnly,
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: 'on',
        }}
      />

      {showOutput && (
        <div className="border-t p-3 text-sm font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
          {output || (
            <span className="text-muted-foreground italic">
              Run the code to see output here...
            </span>
          )}
        </div>
      )}
    </div>
  );
};
