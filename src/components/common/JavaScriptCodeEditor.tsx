'use client';

import { Copy, Loader2, Play } from 'lucide-react';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Dynamically import Monaco
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
});

type Theme = 'light' | 'dark' | 'system';

interface JavaScriptCodeEditorProps {
  initialCode: string;
  readOnly?: boolean;
  className?: string;
  showRunButton?: boolean;
  showOutput?: boolean;
  theme?: Theme;
  onRun?: (code: string) => void | Promise<void>;
  onCodeChange?: (code: string) => void; // <-- NEW
}

export const JavaScriptCodeEditor = ({
  initialCode,
  readOnly = false,
  className,
  showRunButton = true,
  showOutput = true,
  theme = 'dark',
  onRun,
  onCodeChange, // <-- NEW
}: JavaScriptCodeEditorProps) => {
  const editorRef = React.useRef<any>(null);
  const [output, setOutput] = React.useState('');
  const [isRunning, setIsRunning] = React.useState(false);
  const [code, setCode] = React.useState(initialCode);

  // EXECUTE EDITOR CODE
  const runCode = useCallback(async () => {
    if (!editorRef.current) return;

    const currentCode = editorRef.current.getValue();
    setOutput('');
    setIsRunning(true);

    // Call parent run handler if provided
    await onRun?.(currentCode);

    setIsRunning(false);
  }, [onRun]);

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
  };

  const copyToClipboard = async () => {
    if (!editorRef.current) return;
    await navigator.clipboard.writeText(editorRef.current.getValue());
  };

  return (
    <div className={cn('border rounded-lg overflow-hidden', className)}>
      {/* Header */}
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

      {/* Code Editor */}
      <div className="relative h-full">
        <MonacoEditor
          height="100%"
          language="javascript"
          theme={theme === 'light' ? 'vs-light' : 'vs-dark'}
          value={code}
          onMount={handleEditorMount}
          onChange={(value) => {
            const v = value || '';
            setCode(v);
            onCodeChange?.(v); // <-- SEND CODE TO PARENT
          }}
          options={{
            minimap: { enabled: false },
            readOnly,
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: 'on',
          }}
        />
      </div>

      {showOutput && (
        <div className="border-t p-3 text-sm font-mono whitespace-pre-wrap">
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
