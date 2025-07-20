import { useState, useCallback } from 'react';

import { competitiveRuntime } from '@/services/client/competitiveRuntime';
import { TestCase } from '@/services/firebase/testCasesService';

export interface ExecutionState {
  isRunning: boolean;
  result: {
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
  } | null;
  error: string | null;
}

export function useCompetitiveExecution() {
  const [state, setState] = useState<ExecutionState>({
    isRunning: false,
    result: null,
    error: null,
  });

  const executeCode = useCallback(
    async (
      code: string,
      testCases: TestCase[],
      functionName: string = 'solve'
    ) => {
      if (!code.trim()) {
        setState((prev) => ({
          ...prev,
          error: 'Please write some code first',
        }));
        return null;
      }

      setState({
        isRunning: true,
        result: null,
        error: null,
      });

      try {
        const result = await competitiveRuntime.executeCode(
          code,
          testCases,
          functionName
        );

        setState({
          isRunning: false,
          result,
          error: result.error || null,
        });

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to execute code';

        setState({
          isRunning: false,
          result: null,
          error: errorMessage,
        });

        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({
      isRunning: false,
      result: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    executeCode,
    reset,
  };
}
