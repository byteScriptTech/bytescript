import { Info } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/ui/CodeEditor';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTheme } from '@/context/theme-provider';
import type { TestCase, TestResult, Submission } from '@/types/problem';

interface ProblemEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  loading: boolean;
  error?: string | null;
  executionResult: {
    testResults: TestResult[];
    output?: string;
  } | null;
  testCases: TestCase[];
  submissions?: Submission[];
}

export default function ProblemEditor({
  code,
  onCodeChange,
  onRun,
  onSubmit,
  loading,
  error,
  executionResult,
  testCases,
}: ProblemEditorProps) {
  const [activeTab, setActiveTab] = useState<'testResults' | 'consoleOutput'>(
    'testResults'
  );
  const { theme } = useTheme();
  const editorTheme = theme === 'dark' ? 'vs-dark' : 'light';

  return (
    <div className="w-full h-full flex flex-col bg-card rounded-lg overflow-hidden border border-border">
      {/* Editor Header */}
      <div className="px-4 sm:px-6 py-3 border-b border-border bg-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              Code Editor
            </h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    <span className="sr-only">Code Format Information</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-4">
                  <p className="text-sm">
                    If a solve function is not already defined with parameters
                    in the editor, create a solve function and write all your
                    code inside it:
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                      {`function solve(parameterOne, paramTwo) {
  // Your logic to solve the question
  // and return the value
  return result;
}`}
                    </pre>
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={onRun}
              disabled={loading}
              variant="outline"
              className="px-4 py-2 text-sm h-9"
            >
              {loading ? 'Running...' : 'Run Code'}
            </Button>
            <Button
              onClick={onSubmit}
              disabled={
                !executionResult?.testResults.some(
                  (r: TestResult) => r.passed
                ) || loading
              }
              className="px-4 py-2 text-sm h-9"
            >
              Submit Solution
            </Button>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 min-h-[300px] overflow-hidden bg-background">
        <CodeEditor
          code={code}
          onCodeChange={onCodeChange}
          language="javascript"
          height="100%"
          theme={editorTheme}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 sm:px-6 py-3 bg-destructive/10 text-destructive text-sm border-t border-destructive/20">
          {error}
        </div>
      )}

      {/* Test Results and Console Output */}
      {executionResult && (
        <div className="border-t border-border bg-card overflow-auto flex-1 max-h-[40vh]">
          <div className="p-4 sm:p-5">
            {/* Tabs */}
            <div className="border-b border-border mb-4">
              <nav className="-mb-px flex space-x-8">
                <button
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'testResults'
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                  }`}
                  onClick={() => setActiveTab('testResults')}
                >
                  Test Results
                </button>
                <button
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'consoleOutput'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('consoleOutput')}
                >
                  Console Output
                </button>
              </nav>
            </div>

            {activeTab === 'testResults' ? (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <h2 className="text-base sm:text-lg font-semibold text-foreground">
                    Test Results
                  </h2>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground">
                      Passed:{' '}
                      <span className="font-medium text-foreground">
                        {
                          executionResult.testResults.filter((r) => r.passed)
                            .length
                        }
                      </span>{' '}
                      / {testCases.length}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        executionResult.testResults.every((r) => r.passed)
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                          : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                      }`}
                    >
                      {executionResult.testResults.every((r) => r.passed)
                        ? 'All Tests Passed'
                        : 'Some Tests Failed'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {executionResult.testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 sm:p-4 rounded-lg border ${
                        result.passed
                          ? 'bg-green-500/5 border-green-500/20 dark:bg-green-500/10 dark:border-green-500/20'
                          : 'bg-red-500/5 border-red-500/20 dark:bg-red-500/10 dark:border-red-500/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full flex-shrink-0 ${
                            result.passed ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm sm:text-base">
                            Test Case {index + 1}
                            <span
                              className={`ml-2 text-xs font-normal ${
                                result.passed
                                  ? 'text-green-700'
                                  : 'text-red-700'
                              }`}
                            >
                              {result.passed ? 'Passed' : 'Failed'}
                            </span>
                          </div>

                          <div className="mt-2 space-y-2 text-xs sm:text-sm">
                            <div className="flex flex-col sm:flex-row gap-1 sm:items-start">
                              <span className="font-medium text-foreground w-20 sm:w-24 flex-shrink-0 mt-1">
                                Input:
                              </span>
                              <pre className="whitespace-pre-wrap break-words bg-background/50 p-2 rounded border border-border overflow-x-auto flex-1 font-mono text-sm">
                                {typeof testCases[index].input === 'string'
                                  ? testCases[index].input
                                  : JSON.stringify(
                                      testCases[index].input,
                                      null,
                                      2
                                    )}
                              </pre>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-1 sm:items-start">
                              <span className="font-medium text-foreground w-20 sm:w-24 flex-shrink-0 mt-1">
                                Expected:
                              </span>
                              <pre className="whitespace-pre-wrap break-words bg-background/50 p-2 rounded border border-border overflow-x-auto flex-1 font-mono text-sm">
                                {typeof testCases[index].expectedOutput ===
                                'string'
                                  ? testCases[index].expectedOutput
                                  : JSON.stringify(
                                      testCases[index].expectedOutput,
                                      null,
                                      2
                                    )}
                              </pre>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-1 sm:items-start">
                              <span className="font-medium text-foreground w-20 sm:w-24 flex-shrink-0 mt-1">
                                Output:
                              </span>
                              <pre
                                className={`whitespace-pre-wrap break-words bg-background/50 p-2 rounded border ${
                                  result.passed
                                    ? 'border-green-500/20'
                                    : 'border-red-500/20'
                                } overflow-x-auto flex-1 font-mono text-sm`}
                              >
                                {result.output || '(no output)'}
                              </pre>
                            </div>
                            {result.error && (
                              <div className="mt-1 text-red-600 dark:text-red-400 text-xs sm:text-sm bg-red-500/10 p-2 rounded border border-red-500/20">
                                Error: {result.error}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-background border border-border text-foreground font-mono text-sm p-4 rounded-md h-[calc(40vh-8rem)] overflow-auto">
                {executionResult.testResults.map((result, index) => (
                  <div key={index} className="mb-4">
                    <div className="text-blue-500 dark:text-blue-400 mb-1">
                      Test Case {index + 1}:
                    </div>
                    {result.consoleOutput ? (
                      <pre className="whitespace-pre-wrap break-words">
                        {result.consoleOutput}
                      </pre>
                    ) : (
                      <div className="text-muted-foreground">
                        No console output
                      </div>
                    )}
                    {result.error && (
                      <div className="text-red-500 dark:text-red-400 mt-1">
                        Error: {result.error}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      Execution time: {result.executionTime.toFixed(2)}ms
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submissions */}
    </div>
  );
}
