import { Timestamp } from 'firebase/firestore';

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
  submissions: Submission[];
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
  submissions,
}: ProblemEditorProps) {
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

      {/* Test Results */}
      {executionResult && (
        <div className="border-t border-gray-200 bg-gray-50 overflow-auto flex-1 max-h-[40vh]">
          <div className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Test Results
              </h2>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-600">
                  Passed:{' '}
                  <span className="font-medium">
                    {executionResult.testResults.filter((r) => r.passed).length}
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
                            result.passed ? 'text-green-700' : 'text-red-700'
                          }`}
                        >
                          {result.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>

                      <div className="mt-2 space-y-2 text-xs sm:text-sm">
                        <div className="flex flex-col sm:flex-row gap-1 sm:items-center">
                          <span className="font-medium text-gray-700 w-20 sm:w-24 flex-shrink-0">
                            Input:
                          </span>
                          <pre className="whitespace-pre-wrap break-all bg-white/50 p-2 rounded border border-gray-100 overflow-x-auto">
                            {JSON.stringify(testCases[index].input)}
                          </pre>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-1 sm:items-center">
                          <span className="font-medium text-gray-700 w-20 sm:w-24 flex-shrink-0">
                            Expected:
                          </span>
                          <pre className="whitespace-pre-wrap break-all bg-white/50 p-2 rounded border border-gray-100 overflow-x-auto">
                            {JSON.stringify(testCases[index].expectedOutput)}
                          </pre>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-1 sm:items-center">
                          <span className="font-medium text-gray-700 w-20 sm:w-24 flex-shrink-0">
                            Output:
                          </span>
                          <pre className="whitespace-pre-wrap break-all bg-white/50 p-2 rounded border border-gray-100 overflow-x-auto">
                            {result.output}
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
        </div>
      )}

      {/* Submissions */}
      {submissions.length > 0 && (
        <div className="border-t border-gray-200 bg-white">
          <div className="p-4 sm:p-5">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
              Your Submissions
            </h2>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                          {s.submittedAt instanceof Timestamp
                            ? s.submittedAt.toDate().toLocaleString()
                            : new Date(s.submittedAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              s.status === 'passed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
