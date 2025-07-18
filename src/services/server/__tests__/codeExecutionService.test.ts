import { describe, it, expect } from '@jest/globals';

import { executeCode } from '../codeExecutionService';

// Helper function to create test cases with proper typing
const createTestCase = (
  id: string,
  input: any,
  expectedOutput: any,
  isPublic = true
) => ({
  id,
  problemId: 'problem1',
  input: typeof input === 'string' ? input : JSON.stringify(input),
  expectedOutput:
    typeof expectedOutput === 'string'
      ? expectedOutput
      : JSON.stringify(expectedOutput),
  isPublic,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Mock test cases
const mockTestCases = [
  createTestCase('test1', [1, 2, 3], [1, 2, 3]),
  createTestCase('test2', [4, 5, 6], [4, 5, 6]),
];

describe('codeExecutionService', () => {
  describe('executeCode', () => {
    it('should execute code and return correct results for passing test cases', async () => {
      const code = `
        function solution(input) {
          return input;
        }
      `;

      const result = await executeCode(code, mockTestCases);

      expect(result.success).toBe(true);
      expect(result.testResults.length).toBe(2);
      expect(result.testResults.every((r) => r.passed)).toBe(true);
      expect(result.output).toContain('All test cases passed');
    });

    it('should handle failing test cases correctly', async () => {
      const code = `
        function solution(input) {
          return input.map(x => x * 2);
        }
      `;

      const result = await executeCode(code, mockTestCases);

      expect(result.success).toBe(false);
      expect(result.testResults.every((r) => r.passed)).toBe(false);
      expect(result.output).toContain('Some test cases failed');
    });

    it('should handle runtime errors in user code', async () => {
      const code = `
        function solution(input) {
          throw new Error('Intentional error');
        }
      `;

      const result = await executeCode(code, mockTestCases);

      expect(result.success).toBe(false);
      expect(result.testResults.every((r) => !r.passed)).toBe(true);
      expect(result.testResults[0].error).toContain('Intentional error');
    });

    it('should handle invalid code', async () => {
      const code = 'function solution() { return 42; }'; // No input parameter
      const result = await executeCode(code, mockTestCases);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
