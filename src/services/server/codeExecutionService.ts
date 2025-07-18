import { Timestamp as AdminTimestamp } from 'firebase-admin/firestore';

import type { TestCase as ClientTestCase } from '@/services/firebase/testCasesService';

// Support both client and server-side Timestamp types
type AnyTimestamp = Date | AdminTimestamp | { toDate: () => Date };

interface ServerTestCase
  extends Omit<ClientTestCase, 'createdAt' | 'updatedAt'> {
  createdAt: AnyTimestamp;
  updatedAt: AnyTimestamp;
}

export interface CodeExecutionTestResult {
  input: unknown;
  expectedOutput: unknown;
  actualOutput: string;
  passed: boolean;
  error: string;
  executionTime: number;
  memoryUsage: number;
}

export interface CodeExecutionResult {
  success: boolean;
  output: string;
  error: string;
  executionTime: number;
  testResults: CodeExecutionTestResult[];
}

// Helper function to convert Firestore timestamps to Date objects
const _convertTimestamp = (timestamp: AnyTimestamp): Date => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  if (typeof timestamp === 'object' && timestamp !== null) {
    if ('toDate' in timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    if ('seconds' in timestamp && typeof timestamp.seconds === 'number') {
      return new Date(timestamp.seconds * 1000);
    }
  }
  if (typeof timestamp === 'number') return new Date(timestamp);
  return new Date(String(timestamp));
};

export { _convertTimestamp }; // Export for testing

/**
 * Strips TypeScript types from function parameters and variable declarations
 */
/**
 * Strips TypeScript type annotations from code
 */
function stripTypeScriptTypes(tsCode: string): string {
  try {
    // Remove type annotations from function parameters
    let result = tsCode.replace(
      /\(([^)]*)\)/g,
      (_match: string, params: string) => {
        const cleanedParams = params
          .split(',')
          .map((param) => param.split(':')[0].trim())
          .join(',');
        return `(${cleanedParams})`;
      }
    );

    // Remove return type annotations
    result = result.replace(
      /(function\s+\w+\s*)\([^)]*\)\s*:\s*[^{\s{]*/g,
      '$1()'
    );

    // Remove variable type annotations
    result = result.replace(
      /(const|let|var)\s+(\w+)\s*:\s*[^=;]+(?=[=;])/g,
      '$1 $2'
    );

    return result;
  } catch (error) {
    console.error('Error stripping TypeScript types:', error);
    return tsCode; // Return original code if stripping fails
  }
}

/**
 * Creates an executable function from user code
 */
/**
 * Creates an executable function from user code
 */
function createUserFunction(
  code: string,
  functionName: string
): (input: unknown) => unknown {
  try {
    // Strip TypeScript types from the code
    const jsCode = stripTypeScriptTypes(code);
    console.log('JavaScript code after stripping types:', jsCode);

    // Check if the code already defines the function
    const functionRegex = new RegExp(
      `(async\\s+)?function\\s+${functionName}\\s*\\(`,
      'i'
    );

    const functionCode = functionRegex.test(jsCode)
      ? jsCode
      : `${jsCode}\n// The user's code should define a function called '${functionName}' or be wrapped in one\n`;

    // Create the function with proper error handling
    return new Function(
      'input',
      `
      ${functionCode}
      
      try {
        console.log('Inside function - input:', input);
        const result = ${functionName}(input);
        console.log('Inside function - result:', result);
        return result;
      } catch (err) {
        console.error('Error inside function:', err);
        if (err instanceof ReferenceError && err.message.includes('${functionName} is not defined')) {
          throw new Error(
            'Your code must define a function called "${functionName}" that takes an input parameter and returns a result.'
          );
        }
        throw err;
      }
    `
    ) as (input: unknown) => unknown;
  } catch (error) {
    console.error('Error creating function:', error);
    throw new Error(`Failed to create function: ${error}`);
  }
}

export async function executeCode(
  code: string,
  testCases: ServerTestCase[],
  functionName: string = 'solution'
): Promise<CodeExecutionResult> {
  // Track execution metrics
  const executionStartTime = Date.now();
  const testResults: CodeExecutionTestResult[] = [];

  try {
    console.log('=== Starting code execution ===');
    console.log('Original code:', code);

    // Process test cases
    for (const testCase of testCases) {
      console.log('\n--- Test case ---');
      console.log('Test case input (raw):', testCase.input);
      console.log('Test case expected output (raw):', testCase.expectedOutput);

      const testStartTime = Date.now();
      let output: unknown;
      let errorMsg = '';
      let testPassed = false;
      const memoryUsage = 0; // Placeholder for memory usage tracking

      // Parse the input if it's a string, otherwise use as-is
      let parsedInput: unknown;
      try {
        parsedInput =
          typeof testCase.input === 'string'
            ? JSON.parse(testCase.input)
            : testCase.input;
      } catch (e) {
        // If parsing fails, use the raw input
        parsedInput = testCase.input;
      }
      console.log('Parsed input:', parsedInput);

      // Execute the user's function with the input
      output = undefined;
      errorMsg = '';

      try {
        // Create and execute the user's function
        console.log(
          'Creating user function with code:',
          code.substring(0, 200) + '...'
        );
        const userFunction = createUserFunction(code, functionName);
        console.log(
          'Executing function with input:',
          JSON.stringify(parsedInput, null, 2)
        );
        output = await Promise.resolve(userFunction(parsedInput));
        console.log('Function output:', JSON.stringify(output, null, 2));

        // Output is passed through as-is without any modification
        // The user's function is responsible for returning the correct format

        // Parse expected output
        let expectedOutput: unknown;
        try {
          expectedOutput =
            typeof testCase.expectedOutput === 'string'
              ? JSON.parse(testCase.expectedOutput)
              : testCase.expectedOutput;

          // Special handling for array outputs (like in two-sum)
          if (Array.isArray(output) && Array.isArray(expectedOutput)) {
            // Sort arrays for comparison if they contain numbers
            const sortedOutput = [...output].sort(
              (a: number, b: number) => Number(a) - Number(b)
            );
            const sortedExpected = [...expectedOutput].sort(
              (a: number, b: number) => Number(a) - Number(b)
            );
            testPassed =
              JSON.stringify(sortedOutput) === JSON.stringify(sortedExpected);
          } else {
            testPassed =
              JSON.stringify(output) === JSON.stringify(expectedOutput);
          }
        } catch (parseError) {
          console.error('Error parsing expected output:', parseError);
          testPassed = false;
          errorMsg = `Error parsing expected output: ${
            parseError instanceof Error
              ? parseError.message
              : String(parseError)
          }`;
        }

        if (!testPassed) {
          const outputStr = JSON.stringify(output);
          const expectedStr = JSON.stringify(testCase.expectedOutput);
          console.error(
            `Test case failed. Expected: ${expectedStr}, Got: ${outputStr}`
          );
        }
      } catch (funcError) {
        console.error('Error executing user function:', funcError);
        errorMsg =
          funcError instanceof Error ? funcError.message : String(funcError);
        testPassed = false;
      }
      console.log('Test case passed:', testPassed);
      console.log('Test case output:', output);
      // Record the test result
      const testEndTime = Date.now();
      testResults.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput:
          output !== undefined ? JSON.stringify(output) : 'undefined',
        passed: testPassed,
        error: errorMsg,
        executionTime: testEndTime - testStartTime,
        memoryUsage,
      });
    }

    const executionEndTime = Date.now();
    const allPassed = testResults.every((r) => r.passed);
    const outputMessage = allPassed
      ? 'All test cases passed'
      : 'Some test cases failed';

    return {
      success: allPassed,
      output: outputMessage,
      error: allPassed ? '' : 'Some test cases failed',
      executionTime: executionEndTime - executionStartTime,
      testResults,
    };
  } catch (error) {
    console.error('Error executing code:', error);
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      executionTime: 0,
      testResults: [],
    };
  }
}
