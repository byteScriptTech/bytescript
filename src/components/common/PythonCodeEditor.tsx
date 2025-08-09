'use client';

import { Play, RotateCcw } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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

type PythonCodeEditorProps = {
  initialCode: string;
  className?: string;
  onCodeChange?: (code: string) => void;
  readOnly?: boolean;
};

export function PythonCodeEditor({
  initialCode,
  className,
  onCodeChange,
  readOnly = false,
}: PythonCodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [panelHeight, setPanelHeight] = useState('50%');
  const pyodideRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const resize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newHeight =
        ((e.clientY - containerRect.top) / containerRect.height) * 100;

      // Limit the height between 20% and 80% of container
      const clampedHeight = Math.min(Math.max(newHeight, 20), 80);
      setPanelHeight(`${clampedHeight}%`);
    },
    [isResizing]
  );

  const stopResize = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResize);

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResize);
    };
  }, [isResizing, resize]);

  // Load Pyodide from CDN
  const loadPyodide = async () => {
    if (!window.loadPyodide) {
      // Load the Pyodide script
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
      script.async = true;
      document.body.appendChild(script);

      // Wait for Pyodide to be loaded
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }

    return window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
    });
  };

  // Initialize Pyodide
  useEffect(() => {
    let mounted = true;

    const initPyodide = async () => {
      try {
        const pyodide = await loadPyodide();
        if (mounted) {
          pyodideRef.current = pyodide;
        }
      } catch (err) {
        console.error('Failed to load Pyodide:', err);
        if (mounted) {
          setError('Failed to initialize Python runtime. Please try again.');
        }
      }
    };

    initPyodide();

    return () => {
      mounted = false;
    };
  }, []);

  const runCode = async () => {
    if (!pyodideRef.current || !code.trim()) return;

    setIsLoading(true);
    setError(null);
    setOutput('');

    try {
      // Override Python's print function to capture output
      await pyodideRef.current.runPythonAsync(`
        import sys
        import io
        
        class OutputBuffer(io.StringIO):
            def write(self, text):
                super().write(text)
                return len(text)
                
        buffer = OutputBuffer()
        sys.stdout = buffer
        sys.stderr = buffer
      `);

      // Run the user's code
      await pyodideRef.current.runPythonAsync(code);

      // Get the captured output
      const result =
        await pyodideRef.current.runPythonAsync('buffer.getvalue()');
      setOutput(result || '');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while running the code'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput('');
    setError(null);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };

  return (
    <Card className={className}>
      <div className="flex justify-between items-center p-2 border-b">
        <div className="text-sm font-mono px-2 py-1 bg-muted rounded">
          Python
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetCode}
            disabled={isLoading}
            className="h-8"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={runCode}
            disabled={isLoading || !pyodideRef.current}
            className="h-8"
          >
            <Play className="h-3.5 w-3.5 mr-1.5" />
            {isLoading ? 'Running...' : 'Run Code'}
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative flex flex-col h-[400px] overflow-hidden border rounded-md"
      >
        {/* Code Editor */}
        <div
          className="overflow-auto"
          style={{ height: `calc(${panelHeight} - 8px)` }}
        >
          <textarea
            value={code}
            onChange={handleCodeChange}
            className={`w-full h-full p-2 font-mono text-sm bg-transparent border-0 focus:outline-none resize-none ${
              readOnly ? 'cursor-default' : ''
            }`}
            spellCheck="false"
            readOnly={readOnly || isLoading}
          />
        </div>

        {/* Resize Handle */}
        <button
          type="button"
          className="h-2 w-full bg-gray-100 dark:bg-gray-800 cursor-row-resize flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          onMouseDown={startResize}
          aria-label="Resize panels"
        >
          <div className="w-16 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </button>

        {/* Output Panel */}
        <div
          className="flex-1 overflow-auto bg-muted/50 p-4"
          style={{ height: `calc(100% - ${panelHeight} - 8px)` }}
        >
          <div className="text-sm font-mono whitespace-pre-wrap break-words">
            {error ? (
              <div className="text-destructive">{error}</div>
            ) : output ? (
              output
            ) : (
              <div className="text-muted-foreground">
                Click &quot;Run Code&quot; to see the output here
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
