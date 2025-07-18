'use client';

import { formatDistanceToNow } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

import Markdown from '@/components/common/Markdown';
import Navbar from '@/components/common/Navbar';
import AuthGuard from '@/components/misc/authGuard';
import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/ui/CodeEditor';
import { ContentProvider } from '@/context/ContentContext';
import { LanguagesProvider } from '@/context/LanguagesContext';
import { LocalStorageProvider } from '@/context/LocalhostContext';
import { executeCode } from '@/services/codeExecutionService';
import { problemsService, Problem } from '@/services/firebase/problemsService';
import {
  submissionsService,
  Submission,
} from '@/services/firebase/submissionsService';
import {
  testCasesService,
  TestCase,
} from '@/services/firebase/testCasesService';

interface CodeExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  testResults: Array<{
    testCase: TestCase;
    passed: boolean;
    output: string;
    error?: string;
    executionTime: number;
    memoryUsage: number;
  }>;
}

export default function ProblemPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [executionResult, setExecutionResult] =
    useState<CodeExecutionResult | null>(null);

  const loadSubmissions = useCallback(async () => {
    if (!id) return;
    try {
      const userSubmissions =
        await submissionsService.getUserSubmissions('user-id');
      setSubmissions(userSubmissions);
    } catch (err) {
      console.error('Error loading submissions:', err);
    }
  }, [id]);

  useEffect(() => {
    const fetchProblemAndTestCases = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [fetchedProblem, fetchedTestCases] = await Promise.all([
          problemsService.getProblemById(String(id)),
          testCasesService.getTestCasesByProblemId(String(id)),
        ]);

        if (!fetchedProblem) throw new Error('Problem not found');

        setProblem(fetchedProblem);
        setTestCases(fetchedTestCases);
        await loadSubmissions();
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchProblemAndTestCases();
  }, [id, loadSubmissions]);

  useEffect(() => {
    if (!problem) {
      setCode('// Write your solution here');
      return;
    }

    const example = problem.examples?.[0];
    const input = example ? JSON.stringify(example.input, null, 2) : '';
    const output = example ? JSON.stringify(example.output, null, 2) : '';

    let template = `// Write your solution here`;

    if (problem.category === 'Arrays') {
      template = `function solve(arr) {\n  // Your code here\n  return;\n}\n\n// Test\nconsole.log(solve(${input})); // Expected: ${output}`;
    } else if (problem.category === 'Strings') {
      template = `function solve(str) {\n  // Your code here\n  return;\n}\n\n// Test\nconsole.log(solve(${input})); // Expected: ${output}`;
    }

    setCode(template);
  }, [problem]);

  const handleRun = async () => {
    if (!code || !testCases.length) {
      setError('Please write some code first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await executeCode(code, testCases);
      console.log(result, 'result is here!');
      setExecutionResult(result);
      if (result.error) setError(result.error);

      if (result.testResults.every((r) => r.passed)) {
        await submissionsService.addSubmission({
          userId: 'user-id',
          problemId: problem!.id,
          code,
          result: { ...result, output: 'All tests passed' },
          status: 'passed',
          executionTime: result.testResults.reduce(
            (a, c) => a + c.executionTime,
            0
          ),
          memoryUsage: result.testResults.reduce(
            (a, c) => a + c.memoryUsage,
            0
          ),
        });
        await loadSubmissions();
      }
    } catch (err) {
      console.error('Error executing code:', err);
      setError(err instanceof Error ? err.message : 'Failed to execute code');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!executionResult) {
      setError('Run tests before submitting');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await submissionsService.addSubmission({
        userId: 'user-id',
        problemId: problem!.id,
        code,
        result: { ...executionResult },
        status: executionResult.testResults.every((r) => r.passed)
          ? 'passed'
          : 'failed',
        executionTime: executionResult.testResults.reduce(
          (a, c) => a + c.executionTime,
          0
        ),
        memoryUsage: executionResult.testResults.reduce(
          (a, c) => a + c.memoryUsage,
          0
        ),
      });
      await loadSubmissions();
    } catch (err) {
      console.error('Error submitting solution:', err);
      setError('Failed to submit solution');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!problem)
    return <div className="text-center py-8">Problem not found</div>;

  return (
    <AuthGuard>
      <ContentProvider>
        <LanguagesProvider>
          <LocalStorageProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 container mx-auto p-4">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Problem Details Side */}
                  <div className="md:w-1/2 bg-white rounded-lg p-6">
                    <div className="space-y-4">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {problem.title}
                      </h1>
                      <div className="text-sm text-gray-500">
                        <p>
                          Last attempted:{' '}
                          {problem.lastAttempted
                            ? formatDistanceToNow(
                                problem.lastAttempted instanceof Timestamp
                                  ? problem.lastAttempted.toDate()
                                  : problem.lastAttempted,
                                { addSuffix: true }
                              )
                            : 'Never'}
                        </p>
                      </div>

                      {/* Basic Problem Info */}
                      <div className="space-y-4">
                        {/* Problem Requirements */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h2 className="font-semibold mb-2">Problem Type</h2>
                          <div className="space-y-4">
                            <div className="flex items-center gap-6">
                              <div>
                                <h3 className="text-sm font-medium text-gray-500">
                                  Difficulty
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm">
                                    {problem.difficulty}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-500">
                                  Category
                                </h3>
                                <span className="text-sm">
                                  {problem.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Problem Description */}
                        <div className="space-y-2">
                          <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wider">
                            Problem Description
                          </h2>
                          <div className="text-sm text-gray-800 leading-relaxed">
                            <Markdown content={problem.description} />
                          </div>
                        </div>

                        {/* Examples */}
                        <div className="space-y-3">
                          <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wider">
                            Examples
                          </h2>
                          <div className="space-y-3">
                            {problem.examples?.map((example, index) => (
                              <div key={index} className="p-3 text-sm">
                                <div className="font-medium text-gray-900 mb-2">
                                  Example {index + 1}
                                </div>
                                <div className="space-y-2">
                                  <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-gray-600">
                                      Input:
                                    </span>
                                    <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded text-xs font-mono text-gray-800">
                                      {JSON.stringify(example.input)}
                                    </pre>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-gray-600">
                                      Output:
                                    </span>
                                    <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded text-xs font-mono text-gray-800">
                                      {JSON.stringify(example.output)}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Constraints */}
                        {problem.constraints && (
                          <div className="space-y-2">
                            <h2 className="text-sm font-medium  text-gray-700 uppercase tracking-wider">
                              Constraints
                            </h2>
                            <ul className="text-sm space-y-1.5 text-gray-600 pl-4">
                              {problem.constraints.map((constraint, index) => (
                                <li key={index} className="leading-tight">
                                  <span className="text-gray-900 font-medium">
                                    •
                                  </span>{' '}
                                  {constraint}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Code Editor Side */}
                  <div className="md:w-1/2 bg-white rounded-lg p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Solution</h2>
                        <div className="flex gap-2">
                          <Button onClick={handleRun} disabled={loading}>
                            Run
                          </Button>
                          <Button
                            onClick={handleSubmit}
                            disabled={
                              !executionResult?.testResults.some(
                                (r) => r.passed
                              )
                            }
                          >
                            Submit
                          </Button>
                        </div>
                      </div>
                      <div className="w-full">
                        <CodeEditor
                          code={code}
                          onCodeChange={setCode}
                          language="javascript"
                          height="min(400px, 70vh)"
                        />
                      </div>
                      {error && <div className="text-red-600">{error}</div>}

                      {executionResult && (
                        <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
                          <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                            <h2 className="font-semibold">Test Results</h2>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm text-gray-600">
                                Total Tests: {testCases.length}
                              </span>
                              <span className="text-sm text-gray-600">
                                Passed:{' '}
                                {
                                  executionResult.testResults.filter(
                                    (r) => r.passed
                                  ).length
                                }
                              </span>
                            </div>
                          </div>

                          {executionResult.testResults.map((result, index) => (
                            <div
                              key={index}
                              className="mb-4 p-3 bg-white rounded"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-4 h-4 rounded-full bg-current"></div>
                                <div>
                                  <div className="font-medium">
                                    Test {index + 1}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {result.passed ? '✓ Passed' : '✗ Failed'}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-2 space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Input:</span>
                                  <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-2 rounded">
                                    {JSON.stringify(testCases[index].input)}
                                  </pre>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    Expected Output:
                                  </span>
                                  <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-2 rounded">
                                    {JSON.stringify(
                                      testCases[index].expectedOutput
                                    )}
                                  </pre>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    Your Output:
                                  </span>
                                  <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-2 rounded">
                                    {result.output}
                                  </pre>
                                </div>
                                {result.error && (
                                  <div className="mt-2 text-red-600">
                                    Error: {result.error}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {executionResult && (
                        <div className="mt-4">
                          <h2 className="font-semibold mb-2">Test Results</h2>
                          {executionResult.testResults.map((r, i) => (
                            <div
                              key={i}
                              className={`flex items-center gap-2 ${
                                r.passed ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              <div className="w-4 h-4 rounded-full bg-current"></div>
                              <span>
                                Test {i + 1}: {r.passed ? 'Passed' : 'Failed'}
                              </span>
                              <span className="text-gray-600">
                                - {r.output}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {submissions.length > 0 && (
                        <div className="mt-4">
                          <h2 className="font-semibold mb-2">
                            Your Submissions
                          </h2>
                          {submissions.map((s) => (
                            <div
                              key={s.id}
                              className="flex justify-between items-center py-1 border-b last:border-b-0"
                            >
                              <span className="text-sm">
                                {s.submittedAt instanceof Timestamp
                                  ? s.submittedAt.toDate().toLocaleString()
                                  : new Date(s.submittedAt).toLocaleString()}
                              </span>
                              <span
                                className={`font-medium ${
                                  s.status === 'passed'
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`}
                              >
                                {s.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </LocalStorageProvider>
        </LanguagesProvider>
      </ContentProvider>
    </AuthGuard>
  );
}
