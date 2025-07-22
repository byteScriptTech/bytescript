'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import ProblemDetail from '@/components/specific/ProblemDetail';
import ProblemEditor from '@/components/specific/ProblemEditor';
import { useAuth } from '@/context/AuthContext';
import { problemsService } from '@/services/firebase/problemsService';
import { submissionsService } from '@/services/firebase/submissionsService';
import { testCasesService } from '@/services/firebase/testCasesService';
import type { Problem, TestCase, Submission } from '@/types/problem';

interface CodeExecutionResult {
  output: string;
  testResults: Array<{
    testCase: TestCase;
    passed: boolean;
    output: string;
    error?: string;
    executionTime: number;
    memoryUsage: number;
  }>;
  success: boolean;
}

// Create a type that makes starterCode optional and adds lastAttempted
interface ProblemWithOptionalStarterCode extends Omit<Problem, 'starterCode'> {
  starterCode: string;
  lastAttempted?: Date | null;
}

const ProblemPageContent = () => {
  const { id } = useParams() as { id: string };
  const [problem, setProblem] = useState<ProblemWithOptionalStarterCode | null>(
    null
  );
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [code, setCode] = useState<string>('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [executionResult, setExecutionResult] =
    useState<CodeExecutionResult | null>(null);
  const { currentUser } = useAuth();

  const loadSubmissions = useCallback(
    async (userId: string) => {
      if (!id) return;
      try {
        const userSubmissions =
          await submissionsService.getUserSubmissions(userId);
        setSubmissions(userSubmissions);
      } catch (err) {
        console.error('Error loading submissions:', err);
      }
    },
    [id]
  );

  useEffect(() => {
    const fetchProblemAndTestCases = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const fetchedProblem = await problemsService.getProblemById(id);
        if (!fetchedProblem) throw new Error('Problem not found');

        const fetchedTestCases =
          (currentUser &&
            (await testCasesService.getTestCasesByProblemId(id))) ??
          [];

        const problemWithDefaultStarterCode = fetchedProblem
          ? ({
              ...fetchedProblem,
              starterCode:
                'starterCode' in fetchedProblem &&
                typeof (fetchedProblem as any).starterCode === 'string'
                  ? (fetchedProblem as any).starterCode
                  : '// Write your solution here',
              lastAttempted:
                'lastAttempted' in fetchedProblem
                  ? (fetchedProblem as any).lastAttempted
                  : null,
            } as unknown as ProblemWithOptionalStarterCode)
          : null;

        setProblem(problemWithDefaultStarterCode);
        setTestCases(fetchedTestCases);
        // TODO: Get actual user ID from auth context
        await loadSubmissions('current-user-id');
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
    try {
      if (!code || !testCases.length) {
        throw new Error('Please write some code first');
      }

      if (!problem) {
        throw new Error('Problem not loaded');
      }

      setLoading(true);
      setError('');
      setExecutionResult(null);

      // Mock implementation of code execution
      const mockResults = testCases.map((testCase) => ({
        testCase,
        passed: false,
        output: 'Not implemented',
        error: 'Code execution not implemented',
        executionTime: 0,
        memoryUsage: 0,
      }));

      const result: CodeExecutionResult = {
        output: mockResults.map((r) => r.output).join('\n'),
        testResults: mockResults,
        success: mockResults.every((r) => r.passed),
      };

      setExecutionResult(result);

      // Save the submission
      const submissionData = {
        userId: 'current-user-id', // TODO: Get from auth context
        problemId: problem.id,
        code,
        result: {
          output: result.output,
          testResults: result.testResults.map((r) => ({
            testCase: {
              id: r.testCase.id,
              problemId: r.testCase.problemId,
              input: r.testCase.input,
              expectedOutput: r.testCase.expectedOutput,
            },
            passed: r.passed,
            output: r.output,
            error: r.error,
            executionTime: r.executionTime,
            memoryUsage: r.memoryUsage,
          })),
          success: result.success,
        },
        status: result.success ? ('passed' as const) : ('failed' as const),
        executionTime: result.testResults.reduce(
          (sum, r) => sum + r.executionTime,
          0
        ),
        memoryUsage: result.testResults.reduce(
          (sum, r) => sum + r.memoryUsage,
          0
        ),
      };

      await submissionsService.addSubmission(submissionData);
      await loadSubmissions('current-user-id');
    } catch (err) {
      console.error('Error executing code:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to execute code';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!problem || !executionResult) {
      setError('Problem or execution result not available');
      return;
    }

    setLoading(true);
    try {
      const status: 'passed' | 'failed' = executionResult.testResults.every(
        (result) => result.passed
      )
        ? 'passed'
        : 'failed';

      const submissionData = {
        userId: 'current-user-id', // Replace with actual user ID from auth
        problemId: problem.id,
        code,
        result: {
          output: executionResult.output,
          testResults: executionResult.testResults.map((result) => ({
            testCase: {
              id: result.testCase.id,
              problemId: result.testCase.problemId,
              input: result.testCase.input,
              expectedOutput: result.testCase.expectedOutput,
            },
            passed: result.passed,
            output: result.output,
            error: result.error,
            executionTime: result.executionTime,
            memoryUsage: result.memoryUsage,
          })),
          success: Boolean(executionResult.success),
        } as const,
        status,
        executionTime: executionResult.testResults.reduce(
          (sum, result) => sum + result.executionTime,
          0
        ),
        memoryUsage: executionResult.testResults.reduce(
          (sum, result) => sum + result.memoryUsage,
          0
        ),
        submittedAt: new Date(),
      };

      await submissionsService.addSubmission(submissionData);
      await loadSubmissions('current-user-id');
      setError('');
    } catch (err) {
      console.error('Error submitting solution:', err);
      setError('Failed to submit solution');
    } finally {
      setLoading(false);
    }
  }, [code, executionResult, loadSubmissions, problem]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading problem...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Problem not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12">
      <div className="max-w-[2400px] mx-auto h-full">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 xl:gap-8 h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)] lg:h-[calc(100vh-6rem)] xl:h-[calc(100vh-8rem)] 2xl:h-[calc(100vh-10rem)]">
          {/* Left Column - Problem Description */}
          <div className="w-full lg:w-[48%] xl:w-[45%] 2xl:w-[42%] h-full flex flex-col bg-white rounded-xl overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 md:p-7 lg:p-8">
              <ProblemDetail problem={problem} submissions={submissions} />
            </div>

            {/* Subtle gradient at bottom to indicate scrollability */}
            <div className="h-8 bg-gradient-to-t from-white to-transparent sticky bottom-0 z-10 pointer-events-none" />
          </div>

          {/* Right Column - Code Editor */}
          <div className="w-full lg:w-[52%] xl:w-[55%] 2xl:w-[58%] h-full flex flex-col bg-white rounded-xl overflow-hidden">
            <div className="flex-1 flex flex-col min-h-0">
              <ProblemEditor
                code={code}
                onCodeChange={setCode}
                onRun={handleRun}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                executionResult={executionResult}
                testCases={testCases}
                submissions={submissions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPageContent;
