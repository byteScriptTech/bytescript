'use client';

import { Play, RotateCcw } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

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
};

export function PythonCodeEditor({
  initialCode,
  className,
  onCodeChange,
}: PythonCodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pyodideRef = useRef<any>(null);

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

      <div className="flex flex-col md:flex-row h-[400px] overflow-hidden">
        <div className="flex-1 border-r overflow-auto">
          <textarea
            value={code}
            onChange={handleCodeChange}
            className="w-full h-full p-4 font-mono text-sm focus:outline-none resize-none"
            spellCheck="false"
            style={{ tabSize: 4 }}
            disabled={isLoading}
          />
        </div>

        <div className="flex-1 overflow-auto bg-muted/50 p-4">
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
