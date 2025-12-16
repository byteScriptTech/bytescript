import { TestCase as FirebaseTestCase } from '@/services/firebase/testCasesService';

import { browserRuntime } from './browserRuntime';

// Types
type TestCase = FirebaseTestCase;

type TestCaseExecutionResult = {
  output: string | any;
  error?: string;
  passed: boolean;
  executionTime: number;
  input?: any;
  expected?: any;
};

type TestResult = {
  testCase: TestCase;
  passed: boolean;
  output: string;
  error?: string;
  executionTime: number;
  memoryUsage: number; // Not available in browser
};

type ExecutionResult = {
  success: boolean;
  output: string;
  error?: string;
  testResults: TestResult[];
};

// Helper function to safely stringify objects for error messages
const safeStringify = (obj: unknown): string => {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
};

// Helper to parse the test case input and expected output
const parseTestCaseData = (input: string, expectedOutput: string) => {
  try {
    const parsedInput = JSON.parse(input);
    const parsedExpected = JSON.parse(expectedOutput);
    return { parsedInput, parsedExpected };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Invalid test case data: ${errorMessage}`);
  }
};

// Export the service
const competitiveRuntime = {
  /**
   * Validates that the code contains the required function
   */
  validateCode(
    code: string,
    functionName: string
  ): { isValid: boolean; error?: string } {
    if (
      !code.includes(`function ${functionName}`) &&
      !code.includes(`const ${functionName}`) &&
      !code.includes(`let ${functionName}`)
    ) {
      return {
        isValid: false,
        error: `Code must contain a function named '${functionName}'. Please implement the function and try again.`,
      };
    }
    return { isValid: true };
  },

  /**
   * Executes user code against test cases in the browser
   * @param code - The user's code to execute
   * @param testCases - Array of test cases to run against
   * @param functionName - The name of the function to test (default: 'solve')
   * @returns Promise with execution results
   */
  async executeCode(
    code: string,
    testCases: TestCase[],
    functionName: string = 'solve'
  ): Promise<ExecutionResult> {
    // Input validation
    if (!code?.trim()) {
      return {
        success: false,
        output: '',
        error: 'No code provided. Please write some code to execute.',
        testResults: [],
      };
    }

    if (!testCases?.length) {
      return {
        success: false,
        output: '',
        error: 'No test cases provided. At least one test case is required.',
        testResults: [],
      };
    }

    // Validate code structure
    const { isValid, error: validationError } = this.validateCode(
      code,
      functionName
    );
    if (!isValid) {
      return {
        success: false,
        output: '',
        error: validationError,
        testResults: [],
      };
    }

    const testResults: TestResult[] = [];
    let allPassed = true;
    let firstError: string | undefined;

    // Process each test case
    for (const testCase of testCases) {
      try {
        // Parse test case data
        const { parsedInput, parsedExpected } = parseTestCaseData(
          testCase.input,
          testCase.expectedOutput
        );

        // Create a test harness that runs the user's code with the test case
        const testCaseCode = `
          // User's code
          ${code}
          
          // Test case runner
          (function() {
            try {
              // Measure execution time
              const startTime = performance.now();
              
              // Execute the user's function with the test input
              const result = ${functionName}.apply(null, Array.isArray(${JSON.stringify(parsedInput)}) ? 
                ${JSON.stringify(parsedInput)} : 
                [${JSON.stringify(parsedInput)}]);
              
              // Calculate execution time
              const executionTime = performance.now() - startTime;
              
              // Compare the result with expected output
              const expected = ${JSON.stringify(parsedExpected)};
              const resultStr = JSON.stringify(result);
              const expectedStr = JSON.stringify(expected);
              const passed = resultStr === expectedStr;
              
              // Return the result in a structured way
              return JSON.stringify({
                output: result,
                expected: expected,
                passed: passed,
                executionTime: executionTime,
                input: ${JSON.stringify(parsedInput)}
              });
            } catch (err) {
              // Handle any errors during execution
              return JSON.stringify({
                output: null,
                error: err.message || 'Unknown error occurred',
                passed: false,
                executionTime: 0,
                input: ${JSON.stringify(parsedInput)}
              });
            }
          })();
        `;

        // Execute the test case
        const result = await browserRuntime.executeCode(testCaseCode);

        // Parse the test result
        let testResult: TestCaseExecutionResult;

        if (result.error) {
          // Handle execution error
          testResult = {
            output: '',
            error: result.error,
            passed: false,
            executionTime: 0,
          };
        } else {
          try {
            // Get the raw output from the execution
            const output = result.output || '';

            // Try to parse the output as JSON
            testResult = JSON.parse(output);

            // If we have an error in the parsed result, include it
            if (testResult.error) {
              testResult.passed = false;
            }

            // Format the output for better display
            if (testResult.output !== undefined) {
              testResult.output =
                typeof testResult.output === 'string'
                  ? testResult.output
                  : JSON.stringify(testResult.output, null, 2);
            }

            // Include input and expected output in the result
            if (testResult.input) {
              testResult.output = `Input: ${JSON.stringify(
                testResult.input,
                null,
                2
              )}\n\n${testResult.output || ''}`;
            }

            if (testResult.expected !== undefined) {
              testResult.output += `\n\nExpected: ${JSON.stringify(
                testResult.expected,
                null,
                2
              )}`;
            }
          } catch {
            // Handle parsing errors
            testResult = {
              output: `Raw output: ${safeStringify(result.output || '')}`,
              error:
                'Failed to parse test result. Make sure your function returns a valid value.',
              passed: false,
              executionTime: 0,
            };
          }
        }

        // Format the test result with additional context
        const testResultWithCase: TestResult = {
          testCase,
          passed: !!testResult.passed,
          output: safeStringify(testResult.output || ''),
          error: testResult.error,
          executionTime: testResult.executionTime || 0,
          memoryUsage: 0, // Not available in browser
        };

        testResults.push(testResultWithCase);

        // Update overall pass/fail status
        if (!testResult.passed && !firstError) {
          firstError = testResult.error || 'Test case failed';
          allPassed = false;
        }
      } catch (error) {
        // Handle any unexpected errors during test execution
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        const errorResult: TestResult = {
          testCase,
          passed: false,
          output: '',
          error: `Test execution failed: ${errorMessage}`,
          executionTime: 0,
          memoryUsage: 0,
        };

        testResults.push(errorResult);

        if (!firstError) {
          firstError = errorMessage;
        }
        allPassed = false;
      }
    }

    // Prepare the final result
    const passedCount = testResults.filter((r) => r.passed).length;
    const totalCount = testResults.length;

    return {
      success: allPassed,
      output: allPassed
        ? `✅ All ${totalCount} test cases passed!`
        : `❌ ${passedCount} of ${totalCount} test cases passed.`,
      error: allPassed ? undefined : firstError,
      testResults,
    };
  },
};

export { competitiveRuntime };
