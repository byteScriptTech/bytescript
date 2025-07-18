import { executeCode } from '../src/services/server/codeExecutionService';

// Sample test cases for the two-sum problem
const testCases = [
  {
    id: 'test1',
    problemId: 'two-sum',
    input: '[2,7,11,15], 9',
    expectedOutput: '[0,1]',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'test2',
    problemId: 'two-sum',
    input: '[3,2,4], 6',
    expectedOutput: '[1,2]',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'test3',
    problemId: 'two-sum',
    input: '[3,3], 6',
    expectedOutput: '[0,1]',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// User's solution function
const userCode = `
function twoSum(nums: number[], target: number): number[] {
  const numMap = new Map<number, number>();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (numMap.has(complement)) {
      return [numMap.get(complement)!, i];
    }
    
    numMap.set(nums[i], i);
  }
  
  return [];
}

// The solution function that will be called by the test runner
function solution(input: { nums: number[]; target: number }): number[] {
  return twoSum(input.nums, input.target);
}
`;

async function testCodeExecution() {
  console.log('=== Starting Code Execution Test ===\n');

  try {
    const result = await executeCode(userCode, testCases);

    console.log('=== Test Results ===');
    console.log(`Success: ${result.success}`);
    console.log(`Output: ${result.output}`);

    if (result.error) {
      console.error(`Error: ${result.error}`);
    }

    console.log('\n=== Detailed Results ===');
    result.testResults.forEach((testResult, index) => {
      const testCase = testCases[index];
      console.log(`\nTest Case ${index + 1}:`);
      console.log(`- Input: ${testCase.input}`);
      console.log(`- Expected: ${testCase.expectedOutput}`);
      console.log(`- Actual: ${testResult.actualOutput}`);
      console.log(`- Passed: ${testResult.passed ? '✅' : '❌'}`);
      if (testResult.error) {
        console.log(`- Error: ${testResult.error}`);
      }
      console.log(`- Execution Time: ${testResult.executionTime}ms`);
      console.log(`- Memory Usage: ${testResult.memoryUsage} bytes`);
    });

    console.log('\n=== Test Completed ===');
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error('Error during code execution test:');
    console.error(error);
    process.exit(1);
  }
}

testCodeExecution();
