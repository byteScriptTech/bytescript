'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import ProblemDetail from '@/components/specific/ProblemDetail';
import ProblemEditor from '@/components/specific/ProblemEditor';
import { useAuth } from '@/context/AuthContext';
import { problemsService } from '@/services/firebase/problemsService';
import { testCasesService } from '@/services/firebase/testCasesService';
import type { Problem, TestCase } from '@/types/problem';

import styles from './ProblemPageContent.module.css';

interface TestResult {
  testCase: TestCase;
  passed: boolean;
  output: string;
  consoleOutput: string;
  error?: string;
  executionTime: number;
  memoryUsage: number;
}

interface CodeExecutionResult {
  output: string;
  testResults: TestResult[];
  success: boolean;
}

// Create a type that makes starterCode optional and adds lastAttempted
interface ProblemWithOptionalStarterCode extends Omit<Problem, 'starterCode'> {
  starterCode: string;
  lastAttempted?: Date | null;
}

const ProblemPageContent = () => {
  const { problemId } = useParams() as { problemId: string };
  const [problem, setProblem] = useState<ProblemWithOptionalStarterCode | null>(
    null
  );
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [executionResult, setExecutionResult] =
    useState<CodeExecutionResult | null>(null);

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchProblemAndTestCases = async () => {
      if (!problemId) return;
      setLoading(true);
      try {
        const fetchedProblem = await problemsService.getProblemById(problemId);
        if (!fetchedProblem) {
          toast.error('Problem not found');
          return;
        }

        let fetchedTestCases: TestCase[] = [];
        if (currentUser) {
          try {
            fetchedTestCases =
              await testCasesService.getTestCasesByProblemId(problemId);
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
  }, [problemId, currentUser]);

  useEffect(() => {
    if (!problem || !problem.examples?.[0]) {
      setCode(`// Write your solution here`);
      return;
    }

    const example = problem.examples[0];
    const inputStr =
      typeof example.input === 'string' ? example.input : String(example.input);

    // New regex: if a value starts with '[', grab until the closing ']',
    // otherwise grab up to the next comma or end.
    const paramPattern = /(\w+)\s*=\s*(\[[^\]]*\]|[^,]+)(?:,\s*|$)/g;
    const matches = [...inputStr.matchAll(paramPattern)];

    if (matches.length === 0) {
      setCode(`// Write your solution here`);
      return;
    }

    const paramNames = matches.map((m) => m[1].trim()); // ["nums", "target"]

    const template = `function solve(${paramNames.join(', ')}) {
  // Your code here
  // Return the result instead of using console.log
}`;

    setCode(template);
  }, [problem]);

  const executeCode = (
    code: string,
    input: unknown
  ): { output: string; consoleOutput: string; error?: string } => {
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
    } as const;
    let output = '';
    let consoleOutput = '';
    let error: string | undefined;

    // Override console methods to capture output
    console.log = (...args) => {
      const message = args
        .map((arg) =>
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        )
        .join(' ');
      consoleOutput += message + '\n';
      originalConsole.log.apply(console, args);
    };

    console.error = (...args) => {
      const message = args
        .map((arg) =>
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        )
        .join(' ');
      consoleOutput += '[ERROR] ' + message + '\n';
      originalConsole.error.apply(console, args);
    };

    try {
      // Parse the input as JSON array
      let fnArgs: unknown[] = [];

      if (Array.isArray(input)) {
        // If input is already an array, use it as arguments
        fnArgs = input;
      } else if (typeof input === 'string') {
        try {
          // Parse the entire input string as JSON
          const parsed = JSON.parse(input);
          // If it's an array, use it directly, otherwise wrap it in an array
          fnArgs = Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
          console.error('Error parsing input:', e);
          // If parsing fails, use the input as is
          fnArgs = [input];
        }
      } else {
        // For any other type of input, wrap it in an array
        fnArgs = [input];
      }

      // Create the function with the correct number of parameters
      const paramNames = fnArgs.map((_, i) => `arg${i}`);

      // Create a wrapper function that will execute the user's code
      const wrapperFn = `
        // First, define the solve function from the user's code
        ${code}
        
        try {
          // Debug: Log the input parameters
          console.log('=== DEBUG: Input to solve() ===');
          const params = [${paramNames.join(', ')}];
          console.log('Number of parameters:', params.length);
          
          // Log the parameters
          params.forEach((param, i) => {
            const type = Array.isArray(param) ? 'array' : typeof param;
            console.log(\`Param \${i + 1} (\${type}):\`, JSON.stringify(param));
          });
          
          // Execute the solve function with provided arguments
          const result = solve(${paramNames.join(', ')});
          
          // Debug: Log the result
          console.log('=== DEBUG: Output from solve() ===');
          console.log('Type:', typeof result);
          console.log('Value:', result);
          
          // Convert the result to a string representation
          if (result === undefined) return '';
          if (result === null) return 'null';
          if (Array.isArray(result) || typeof result === 'object') {
            return JSON.stringify(result);
          }
          return String(result);
        } catch (e) {
          console.error('=== DEBUG: Error in solve() ===', e);
          return 'Error: ' + (e instanceof Error ? e.message : String(e));
        }
      `;

      // Create and execute the function
      const fn = new Function(...paramNames, wrapperFn);
      const result = fn(...fnArgs);

      // If we have a result, use it as output
      if (result !== undefined) {
        output = String(result);
      }
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    } finally {
      // Restore original console methods
      console.log = originalConsole.log;
      console.error = originalConsole.error;
    }

    return {
      output: output.trim(),
      consoleOutput: consoleOutput.trim(),
      error,
    };
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
          const { output, consoleOutput, error } = executeCode(
            code,
            testCase.input
          );

          const executionTime = performance.now() - startTime;

          // Parse the expected and actual outputs for comparison
          let parsedExpected;
          try {
            parsedExpected =
              typeof testCase.expectedOutput === 'string'
                ? JSON.parse(testCase.expectedOutput)
                : testCase.expectedOutput;
          } catch (e) {
            parsedExpected = testCase.expectedOutput;
          }

          // Convert both to strings for comparison
          const expectedStr =
            typeof parsedExpected === 'object'
              ? JSON.stringify(parsedExpected)
              : String(parsedExpected);

          const outputStr = output ? output.trim() : '';

          // Check if the output matches the expected result
          const isEqual = expectedStr === outputStr;

          // Format the actual output for display
          const displayOutput = outputStr || 'No output';

          return {
            testCase,
            passed: isEqual,
            output: displayOutput,
            consoleOutput: consoleOutput || 'No console output',
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
    } catch (err) {
      console.error('Error executing code:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to execute code';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [code, currentUser, problem, testCases]);

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
      toast.success('Your solution has been submitted!');
    } catch (err) {
      console.error('Error submitting solution:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to submit solution';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentUser, executionResult, problem, setLoading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground" data-testid="loading">
          Loading problem...
        </div>
      </div>
    );
  }

  // Error state is now handled by toasts
  // No need for a separate error state UI

  if (!problem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Problem not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12">
      <div className="max-w-[2400px] mx-auto h-full">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 xl:gap-8 h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)] lg:h-[calc(100vh-6rem)] xl:h-[calc(100vh-8rem)] 2xl:h-[calc(100vh-10rem)]">
          {/* Left Column - Problem Description */}
          <div className="w-full lg:w-[48%] xl:w-[45%] 2xl:w-[42%] h-full flex flex-col bg-card rounded-xl overflow-hidden border border-border shadow-sm">
            <div
              className={`flex-1 overflow-y-auto p-5 sm:p-6 md:p-7 lg:p-8 ${styles.scrollContainer} scrollbar-thin scrollbar-thumb-border/20 hover:scrollbar-thumb-border/30 dark:scrollbar-thumb-border/10 dark:hover:scrollbar-thumb-border/20 scrollbar-track-transparent transition-colors duration-200`}
            >
              <ProblemDetail problem={problem} />
            </div>

            {/* Subtle gradient at bottom to indicate scrollability */}
            <div className="h-8 bg-gradient-to-t from-card to-transparent sticky bottom-0 z-10 pointer-events-none" />
          </div>

          {/* Right Column - Code Editor */}
          <div className="w-full lg:w-[52%] xl:w-[55%] 2xl:w-[58%] h-full flex flex-col bg-card rounded-xl overflow-hidden border border-border shadow-sm">
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPageContent;
