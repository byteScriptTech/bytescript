'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import ProblemDetail from '@/components/specific/ProblemDetail';
import ProblemEditor from '@/components/specific/ProblemEditor';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();
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
        toast({
          title: 'Error',
          description: 'Failed to load submissions',
          variant: 'destructive',
        });
      }
    },
    [id, toast]
  );

  useEffect(() => {
    const fetchProblemAndTestCases = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const fetchedProblem = await problemsService.getProblemById(id);
        if (!fetchedProblem) {
          toast({
            title: 'Error',
            description: 'Problem not found',
            variant: 'destructive',
          });
          return;
        }

        let fetchedTestCases: TestCase[] = [];
        if (currentUser) {
          try {
            fetchedTestCases =
              await testCasesService.getTestCasesByProblemId(id);
          } catch (err) {
            console.error('Error fetching test cases:', err);
            toast({
              title: 'Warning',
              description: 'Failed to load test cases',
              variant: 'destructive',
            });
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
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProblemAndTestCases();
  }, [id, loadSubmissions, currentUser, toast]);

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

  const handleRun = useCallback(async () => {
    try {
      if (!currentUser) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to run code',
          variant: 'destructive',
        });
        return;
      }
      if (!code || !testCases.length) {
        toast({
          title: 'Error',
          description: 'Please write some code first',
          variant: 'destructive',
        });
        return;
      }
      if (!problem) {
        toast({
          title: 'Error',
          description: 'Problem not loaded',
          variant: 'destructive',
        });
        return;
      }

      setLoading(true);
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
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [code, currentUser, loadSubmissions, problem, testCases, toast]);

  const handleSubmit = useCallback(async () => {
    if (!currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to submit your solution',
        variant: 'destructive',
      });
      return;
    }
    if (!problem || !executionResult) {
      toast({
        title: 'Error',
        description: 'Problem or execution result not available',
        variant: 'destructive',
      });
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

      toast({
        title: 'Success',
        description: 'Your solution has been submitted!',
        variant: 'default',
      });
    } catch (err) {
      console.error('Error submitting solution:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to submit solution';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [currentUser, code, executionResult, loadSubmissions, problem, toast]);

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
