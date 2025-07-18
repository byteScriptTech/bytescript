import { NextResponse, type NextRequest } from 'next/server';

import { executeCode } from '@/services/server/codeExecutionService';
import { serverTestCasesService } from '@/services/server/testCasesService';

interface ExecuteCodeRequest {
  code: string;
  problemId: string;
  functionName?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Log request info
    console.log(
      'Request headers:',
      Object.fromEntries(request.headers.entries())
    );

    // Get request body
    let parsedBody;
    try {
      // First try to parse as JSON
      parsedBody = await request.json();
      console.log('Parsed request body:', parsedBody);
    } catch (error) {
      // If JSON parsing fails, try to get raw body for debugging
      const rawBody = await request.text();
      console.error('Failed to parse request body as JSON:', error);
      console.error('Raw request body:', rawBody);

      // Try to handle malformed JSON
      try {
        // Attempt to fix common JSON issues
        const fixedJson = rawBody.trim();
        if (fixedJson) {
          parsedBody = JSON.parse(fixedJson);
          console.log('Successfully parsed after fixing JSON');
        } else {
          throw new Error('Empty request body');
        }
      } catch (fixError) {
        console.error('Could not parse request body:', fixError);
        return NextResponse.json(
          {
            success: false,
            output: '',
            error: `Invalid request body: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`,
            testResults: [],
          },
          { status: 400 }
        );
      }
    }

    const { code, problemId } = parsedBody as ExecuteCodeRequest;
    console.log('Extracted code:', code);
    console.log('Extracted code length:', code?.length);
    console.log('Extracted problemId:', problemId);

    if (!code || !problemId) {
      return NextResponse.json(
        {
          success: false,
          output: '',
          error: 'Code and problemId are required',
          testResults: [],
        },
        { status: 400 }
      );
    }

    // Get test cases for the problem using server-side service
    const serverTestCases =
      await serverTestCasesService.getTestCasesByProblemId(problemId);

    if (!serverTestCases || serverTestCases.length === 0) {
      return NextResponse.json(
        { error: 'No test cases found for this problem' },
        { status: 404 }
      );
    }

    console.log('Found test cases:', serverTestCases.length);

    // Convert server test cases to the format expected by executeCode
    const testCases = serverTestCases.map((testCase, index) => {
      console.log(`Test case ${index + 1}:`, {
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        isPublic: testCase.isPublic,
      });
      return {
        id: testCase.id,
        problemId: testCase.problemId,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        isPublic: testCase.isPublic,
        // Keep as Firestore Timestamp for now, will be converted in the service
        createdAt: testCase.createdAt,
        updatedAt: testCase.updatedAt,
      };
    });

    console.log('Executing code...');
    try {
      // Execute the code with the test cases
      console.log('Calling executeCode with test cases...');
      const result = await executeCode(
        code,
        testCases,
        parsedBody.functionName
      );
      console.log('Execution result:', {
        success: result.success,
        output: result.output,
        error: result.error,
        testResults: result.testResults?.map((t) => ({
          passed: t.passed,
          error: t.error,
          executionTime: t.executionTime,
        })),
      });

      return NextResponse.json(result);
    } catch (error) {
      console.error('Error in code execution:', error);
      return NextResponse.json(
        {
          success: false,
          output: '',
          error:
            error instanceof Error
              ? error.message
              : 'Unknown error during code execution',
          testResults: [],
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in execute API route:', error);
    return NextResponse.json(
      {
        success: false,
        output: '',
        error:
          error instanceof Error ? error.message : 'Failed to execute code',
        testResults: [],
      },
      { status: 500 }
    );
  }
}
