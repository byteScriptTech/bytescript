export interface CustomTest {
  id: string;
  title: string;
  description: string;
  createdBy: string; // User ID
  createdAt: string;
  updatedAt: string;
  duration: number; // Duration in minutes
  questions: TestQuestion[];
  isPublic: boolean;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface TestQuestion {
  id: string;
  type: 'multiple-choice' | 'coding' | 'true-false' | 'fill-blank';
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  codeTemplate?: string; // For coding questions
  language?: string; // For coding questions
  testCases?: TestCase[]; // For coding questions
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface TestAttempt {
  id: string;
  testId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  answers: TestAnswer[];
  score: number;
  totalPoints: number;
  timeSpent: number; // in seconds
  status: 'in-progress' | 'completed' | 'expired';
}

export interface TestAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number; // in seconds
}

export interface TestResult {
  attempt: TestAttempt;
  test: CustomTest;
  percentageScore: number;
  passed: boolean;
  feedback?: string;
}
