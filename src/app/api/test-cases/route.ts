import { NextRequest, NextResponse } from 'next/server';

import { testCasesService } from '@/services/firebase/testCasesService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get('problemId');

    if (!problemId) {
      return NextResponse.json(
        { error: 'problemId is required' },
        { status: 400 }
      );
    }

    const testCases = await testCasesService.getTestCasesByProblemId(problemId);
    return NextResponse.json(testCases);
  } catch (error) {
    console.error('Error fetching test cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test cases' },
      { status: 500 }
    );
  }
}
