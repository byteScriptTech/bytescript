import { NextResponse } from 'next/server';

import { competitiveRuntime } from '@/services/client/competitiveRuntime';
import type { TestCase } from '@/services/firebase/testCasesService';

// Simple health check endpoint for the competitive runtime
export async function POST() {
  try {
    // Basic test case for the competitive runtime
    const now = new Date();
    const testCase: TestCase = {
      id: 'health-check',
      problemId: 'health-check',
      input: JSON.stringify([2, 3]),
      expectedOutput: '5',
      createdAt: now,
      updatedAt: now,
    };

    const result = await competitiveRuntime.executeCode(
      'function add(a, b) { return a + b; }',
      [testCase],
      'add'
    );

    return NextResponse.json({
      success: result.testResults.every((test) => test.passed),
      status: 'operational',
      timestamp: new Date().toISOString(),
      testResults: result.testResults,
    });
  } catch (error) {
    console.error('Error in competitive runtime health check:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to run competitive runtime health check',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
