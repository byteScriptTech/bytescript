'use client';

import { useState, useRef, useEffect } from 'react';

type ExecutionResult = {
  output: string;
  error?: string;
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
    } finally {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
    }

    return {
      output: output.trim(),
      error,
      executionTime: performance.now() - startTime,
    };
  };

  const handleRunCode = () => {
    if (!code.trim()) return;
    setIsRunning(true);

    setTimeout(() => {
      try {
        const result = executeCode(code);
        setResult(result);
      } catch (error) {
        setResult({
          output: '',
          error: error instanceof Error ? error.message : 'Unknown error',
          executionTime: 0,
        });
      } finally {
        setIsRunning(false);
      }
    }, 100);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [code]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [result]);

  return (
    <div className="flex flex-col h-full gap-2 sm:gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-1 sm:mb-2">
        <h2 className="text-base sm:text-lg font-semibold">Editor</h2>
        <button
          onClick={handleRunCode}
          disabled={isRunning}
          className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed
                    bg-[#00BFA6] hover:bg-[#00c7ae] focus:bg-[#00c7ae] focus:outline-none focus:ring-2 focus:ring-[#00BFA6] transition-colors"
          onFocus={(e) => e.currentTarget.classList.add('bg-[#00c7ae]')}
          onBlur={(e) => e.currentTarget.classList.remove('bg-[#00c7ae]')}
        >
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      </div>
      <div className="flex flex-col sm:flex-row flex-1 gap-2 sm:gap-4 h-[calc(100%-3.5rem)]">
        {/* Left side - Editor */}
        <div className="flex-1 flex flex-col border rounded-md overflow-hidden min-h-[200px] sm:min-h-0">
          <div className="p-1 sm:p-2 border-b bg-gray-50 text-xs sm:text-sm text-gray-600">
            JavaScript
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full p-2 sm:p-4 font-mono text-xs sm:text-sm focus:outline-none resize-none"
            spellCheck="false"
            style={{ tabSize: 2 }}
          />
        </div>

        {/* Right side - Output */}
        <div className="flex-1 flex flex-col border rounded-md overflow-hidden min-h-[150px] sm:min-h-0">
          <div className="p-1 sm:p-2 border-b bg-gray-50">
            <h2 className="text-sm sm:text-base font-medium">Output</h2>
          </div>
          <div
            ref={outputRef}
            className="flex-1 p-2 sm:p-4 bg-white overflow-auto text-xs sm:text-sm"
          >
            {isRunning ? (
              <div className="text-gray-500">Running code...</div>
            ) : result ? (
              <>
                {result.error ? (
                  <div className="text-red-600">
                    <div className="font-bold">Error:</div>
                    <div className="whitespace-pre-wrap break-words">
                      {result.error}
                    </div>
                  </div>
                ) : (
                  <div>
                    {result.output && (
                      <div className="whitespace-pre-wrap break-words">
                        {result.output}
                      </div>
                    )}
                    {result.executionTime !== undefined && (
                      <div className="mt-1 sm:mt-2 text-xs text-gray-500">
                        Execution time: {result.executionTime.toFixed(2)}ms
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-400">
                Run some code to see the output here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
