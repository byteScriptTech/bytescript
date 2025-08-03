import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/ui/CodeEditor';
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
  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl overflow-hidden">
      {/* Editor Header */}
      <div className="px-4 sm:px-6 py-3 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Code Editor
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={onRun}
              disabled={loading}
              className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm"
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
              variant="outline"
              className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm"
            >
              Submit Solution
            </Button>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 min-h-[300px] overflow-hidden">
        <CodeEditor
          code={code}
          onCodeChange={onCodeChange}
          language="javascript"
          height="100%"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 sm:px-6 py-3 bg-red-50 text-red-600 text-sm border-t border-red-100">
          {error}
        </div>
      )}

      {/* Test Results and Console Output */}
      {executionResult && (
        <div className="border-t border-gray-200 bg-gray-50 overflow-auto flex-1 max-h-[40vh]">
          <div className="p-4 sm:p-5">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-4">
              <nav className="-mb-px flex space-x-8">
                <button
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'testResults'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    Test Results
                  </h2>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-600">
                      Passed:{' '}
                      <span className="font-medium">
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
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
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
                          ? 'bg-green-50 border-green-100'
                          : 'bg-red-50 border-red-100'
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
                              <span className="font-medium text-gray-700 w-20 sm:w-24 flex-shrink-0 mt-1">
                                Input:
                              </span>
                              <pre className="whitespace-pre-wrap break-words bg-white/50 p-2 rounded border border-gray-100 overflow-x-auto flex-1 font-mono text-sm">
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
                              <span className="font-medium text-gray-700 w-20 sm:w-24 flex-shrink-0 mt-1">
                                Expected:
                              </span>
                              <pre className="whitespace-pre-wrap break-words bg-white/50 p-2 rounded border border-gray-100 overflow-x-auto flex-1 font-mono text-sm">
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
                              <span className="font-medium text-gray-700 w-20 sm:w-24 flex-shrink-0 mt-1">
                                Output:
                              </span>
                              <pre
                                className={`whitespace-pre-wrap break-words bg-white/50 p-2 rounded border ${
                                  result.passed
                                    ? 'border-green-100'
                                    : 'border-red-100'
                                } overflow-x-auto flex-1 font-mono text-sm`}
                              >
                                {result.output || '(no output)'}
                              </pre>
                            </div>
                            {result.error && (
                              <div className="mt-1 text-red-600 text-xs sm:text-sm bg-red-50 p-2 rounded border border-red-100">
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
              <div className="bg-black text-green-400 font-mono text-sm p-4 rounded-md h-[calc(40vh-8rem)] overflow-auto">
                {executionResult.testResults.map((result, index) => (
                  <div key={index} className="mb-4">
                    <div className="text-blue-300 mb-1">
                      Test Case {index + 1}:
                    </div>
                    {result.consoleOutput ? (
                      <pre className="whitespace-pre-wrap break-words">
                        {result.consoleOutput}
                      </pre>
                    ) : (
                      <div className="text-gray-500">No console output</div>
                    )}
                    {result.error && (
                      <div className="text-red-400 mt-1">
                        Error: {result.error}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
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
