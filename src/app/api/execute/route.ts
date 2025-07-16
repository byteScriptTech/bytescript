import { NextRequest, NextResponse } from 'next/server';

import { executeCode } from '@/services/codeExecutionService';
import { testCasesService } from '@/services/firebase/testCasesService';

export async function POST(request: NextRequest) {
  try {
    const { code, problemId } = await request.json();

    if (!code || !problemId) {
      return NextResponse.json(
        { error: 'Code and problemId are required' },
        { status: 400 }
      );
    }

    // Get test cases for the problem
    const testCases = await testCasesService.getTestCasesByProblemId(problemId);
    if (!testCases || testCases.length === 0) {
      return NextResponse.json(
        { error: 'No test cases found for this problem' },
        { status: 404 }
      );
    }

    // Execute the code
    const result = await executeCode(code, testCases);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error executing code:', error);
    return NextResponse.json(
      { error: 'Failed to execute code' },
      { status: 500 }
    );
  }
}
