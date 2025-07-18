import { TestCase } from './firebase/testCasesService';

export interface CodeExecutionResult {
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

export async function executeCode(
  code: string,
  testCases: TestCase[]
): Promise<CodeExecutionResult> {
  try {
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        problemId: testCases[0].problemId,
        functionName: 'solve',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to execute code');
    }

    return await response.json();
  } catch (error) {
    console.error('Error executing code:', error);
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error',
      testResults: [],
    };
  }
}
