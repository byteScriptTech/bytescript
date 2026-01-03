import { Timestamp } from 'firebase/firestore';

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  tags: string[];
  constraints: string[];
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  starterCode: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  solved?: boolean;
  lastAttempted?: Timestamp | Date | null;
}

export interface TestCase {
  id: string;
  problemId: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  order?: number;
}

export interface TestResult {
  testCase: {
    id: string;
    problemId: string;
    input: string;
    expectedOutput: string;
  };
  passed: boolean;
  output: string;
  consoleOutput?: string;
  error?: string;
  executionTime: number;
  memoryUsage: number;
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  result: {
    output: string;
    testResults: TestResult[];
    success?: boolean;
    error?: string;
  };
  status: 'passed' | 'failed';
  executionTime: number;
  memoryUsage: number;
  submittedAt: Timestamp | Date;
}
