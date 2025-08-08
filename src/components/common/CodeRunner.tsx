'use client';

import { Play, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { Card } from '../ui/card';

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

type CodeRunnerProps = {
  code: string;
  language: string;
  className?: string;
};

export function CodeRunner({
  code: initialCode,
  language,
  className,
}: CodeRunnerProps) {
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pyodideRef = useRef<any>(null);
  const [code, setCode] = useState(initialCode);

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
    if (!pyodideRef.current) {
      setError('Python runtime not ready yet. Please wait...');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutput('');

    try {
      // Override Python's print function to capture output
      await pyodideRef.current.runPythonAsync(`
        import sys
        import io
        
        class CaptureOutput:
            def __init__(self):
                self.buffer = io.StringIO()
            
            def write(self, text):
                self.buffer.write(str(text))
            
            def flush(self):
                pass
            
            def getvalue(self):
                return self.buffer.getvalue()
        
        capture = CaptureOutput()
        sys.stdout = capture
        sys.stderr = capture
      `);

      // Run the user's code
      await pyodideRef.current.loadPackagesFromImports(code);
      await pyodideRef.current.runPythonAsync(code);

      // Get the captured output
      const capturedOutput = pyodideRef.current.runPython('capture.getvalue()');
      if (capturedOutput) {
        setOutput(capturedOutput);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput('');
    setError(null);
  };

  return (
    <Card className={cn('w-full', className)}>
      <div className="flex justify-between items-center p-2 border-b">
        <div className="text-sm font-mono px-2 py-1 bg-muted rounded">
          {language}
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
            disabled={isLoading}
            className="h-8"
          >
            <Play className="h-3.5 w-3.5 mr-1.5" />
            {isLoading ? 'Running...' : 'Run Code'}
          </Button>
        </div>
      </div>
      <div
        className="relative
        [&>div]:!border-0 [&>div]:!bg-transparent [&>div]:!shadow-none [&>div]:!rounded-none
      "
      >
        <pre className="p-4 overflow-x-auto text-sm">
          <code>{code}</code>
        </pre>
      </div>

      {(output || error) && (
        <div className="border-t">
          <div className="p-3 bg-muted/50 text-sm font-mono">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Output
            </div>
            <pre
              className={cn(
                'whitespace-pre-wrap break-words',
                error ? 'text-red-500' : 'text-foreground'
              )}
            >
              {error || output || 'No output'}
            </pre>
          </div>
        </div>
      )}
    </Card>
  );
}
