import { Play, Loader2 } from 'lucide-react';
import { useState, useCallback, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/ui/CodeEditor';
import { useTheme } from '@/context/theme-provider';
import { TestCase } from '@/types/practiceQuestion';

interface CodingQuestionProps {
  initialCode: string;
  testCases: TestCase[];
  userCode: string;
  onCodeChange: (code: string) => void;
  language?: string;
}

export function CodingQuestion({
  initialCode,
  testCases,
  userCode,
  onCodeChange,
  language = 'javascript',
}: CodingQuestionProps) {
  const { theme } = useTheme();
  const editorTheme = theme === 'dark' ? 'vs-dark' : 'light';
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string>('');
  const editorRef = useRef<any>(null);

  const executeCode = useCallback(async (code: string) => {
    setIsRunning(true);
    setOutput('Running...');

    try {
      // Create a console that captures output
      const logs: string[] = [];
      const safeConsole = {
        ...console,
        log: (...args: unknown[]) => {
          const message = args
            .map((arg) =>
              typeof arg === 'object' && arg !== null
                ? JSON.stringify(arg, null, 2)
                : String(arg)
            )
            .join(' ');
          logs.push(message);
        },
      };

      // Execute the code in a function with the safe console
      const execute = new Function(
        'console',
        `
        try {
          ${code}
        } catch (error) {
          console.log('Error:', error);
        }
      `
      );

      // Execute the code
      execute(safeConsole);

      // Show the output
      if (logs.length > 0) {
        setOutput(logs.join('\n'));
      } else {
        setOutput('Code executed successfully (no output)');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setOutput(`Error: ${errorMessage}`);
    } finally {
      setIsRunning(false);
    }
  }, []);

  const handleRun = useCallback(() => {
    // Try to get the editor instance if we don't have it yet
    if (!editorRef.current) {
      // @ts-ignore - Monaco editor instance is available here
      const editor = window.monaco.editor.getEditors()[0];
      if (editor) {
        editorRef.current = editor;
      } else {
        console.error('Editor not ready yet');
        return;
      }
    }

    // Get the current code from the editor
    const code = editorRef.current.getValue();
    if (code) {
      executeCode(code);
    }
  }, [executeCode]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button
            onClick={handleRun}
            disabled={isRunning}
            className="gap-2"
            size="sm"
          >
            {isRunning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Run Code
          </Button>
        </div>
        <div className="h-80 rounded overflow-hidden border">
          <CodeEditor
            code={userCode || initialCode || ''}
            onCodeChange={(code) => {
              onCodeChange(code);
            }}
            language={language}
            height="100%"
            theme={editorTheme}
          />
        </div>
        {(output || isRunning) && (
          <div className="border rounded-md overflow-hidden">
            <div className="px-4 py-2 bg-muted/50 border-b text-sm font-medium">
              Output
            </div>
            <pre className="p-4 bg-background text-sm font-mono whitespace-pre-wrap overflow-auto max-h-40">
              {isRunning ? 'Running...' : output}
            </pre>
          </div>
        )}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <h3 className="font-medium mb-2">Test Cases:</h3>
        <div className="space-y-2">
          {testCases.map((testCase, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {testCase.input} → {testCase.isHidden ? '???' : testCase.output}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
