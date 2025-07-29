'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

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
  const [executionResult, setExecutionResult] =
    useState<CodeExecutionResult | null>(null);

  const { currentUser } = useAuth();

  const loadSubmissions = useCallback(
    async (userId: string) => {
      if (!id) return;
      try {
        const allSubmissions =
          await submissionsService.getUserSubmissions(userId);
        const problemSubmissions = allSubmissions.filter(
          (submission: Submission) => submission.problemId === id
        );
        setSubmissions(problemSubmissions);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        toast.error('Failed to load problem. Please try again.');
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
        if (!fetchedProblem) {
          toast.error('Problem not found');
          return;
        }

        let fetchedTestCases: TestCase[] = [];
        if (currentUser) {
          try {
            fetchedTestCases =
              await testCasesService.getTestCasesByProblemId(id);
          } catch (err) {
            console.error('Error fetching test cases:', err);
            toast.warning('Failed to load test cases');
          }
        }

        const problemWithDefaultStarterCode = {
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
        } as unknown as ProblemWithOptionalStarterCode;

        setProblem(problemWithDefaultStarterCode);
        setTestCases(fetchedTestCases);

        if (currentUser?.uid) {
          await loadSubmissions(currentUser.uid);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch data';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProblemAndTestCases();
  }, [id, loadSubmissions, currentUser]);

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

  // Simple function to run code and capture output
  const executeCode = (
    code: string,
    input: unknown
  ): { output: string; error?: string } => {
    const originalConsole = { log: console.log, error: console.error };
    let output = '';
    let error: string | undefined;

    // Override console methods to capture output
    console.log = (...args) => {
      output +=
        args
          .map((arg) =>
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          )
          .join(' ') + '\n';
    };
    console.error = console.log;

    try {
      // Wrap the code in a function and call it with the input
      const fn = new Function('input', `${code}\nreturn solve(input);`);
      const result = fn(input);

      // If the function returns a value, include it in the output
      if (result !== undefined) {
        output +=
          '\n' +
          (typeof result === 'object'
            ? JSON.stringify(result)
            : String(result));
      }
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    } finally {
      // Restore original console methods
      console.log = originalConsole.log;
      console.error = originalConsole.error;
    }

    return { output: output.trim(), error };
  };

  const handleRun = useCallback(async () => {
    try {
      if (!currentUser) {
        toast.error('Authentication Required. Please sign in to run code');
        return;
      }
      if (!code || !testCases.length) {
        toast.error('Please write some code first');
        return;
      }
      if (!problem) {
        toast.error('Problem not loaded');
        return;
      }

      setLoading(true);
      setExecutionResult(null);

      // Execute code against each test case
      const testResults = await Promise.all(
        testCases.map((testCase) => {
          const startTime = performance.now();
          const { output, error } = executeCode(code, testCase.input);
          const executionTime = performance.now() - startTime;

          // Simple comparison of stringified outputs
          const expectedOutput =
            typeof testCase.expectedOutput === 'string'
              ? testCase.expectedOutput
              : JSON.stringify(testCase.expectedOutput);

          const actualOutput = output.split('\n').pop() || ''; // Get last line of output
          const passed = actualOutput.trim() === expectedOutput.trim();

          return {
            testCase,
            passed,
            output: actualOutput,
            error,
            executionTime,
            memoryUsage: 0, // Not measuring memory in this simplified version
          };
        })
      );

      const result: CodeExecutionResult = {
        output: testResults.map((r) => r.output).join('\n'),
        testResults,
        success: testResults.every((r) => r.passed),
      };

      setExecutionResult(result);

      // Save the submission
      const submissionData = {
        userId: currentUser.uid,
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
        submittedAt: new Date(),
      };

      await submissionsService.addSubmission(submissionData);
      if (currentUser?.uid) {
        await loadSubmissions(currentUser.uid);
      }
    } catch (err) {
      console.error('Error executing code:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to execute code';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [code, currentUser, loadSubmissions, problem, testCases]);

  const handleSubmit = useCallback(async () => {
    if (!currentUser) {
      toast.error(
        'Authentication Required. Please sign in to submit your solution'
      );
      return;
    }
    if (!problem || !executionResult) {
      toast.error('Problem or execution result not available');
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
        userId: currentUser.uid,
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
      if (currentUser?.uid) {
        await loadSubmissions(currentUser.uid);
      }

      toast.success('Your solution has been submitted!');
    } catch (err) {
      console.error('Error submitting solution:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to submit solution';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentUser, code, executionResult, loadSubmissions, problem]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading problem...</div>
      </div>
    );
  }

  // Error state is now handled by toasts
  // No need for a separate error state UI

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
                error={null}
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
