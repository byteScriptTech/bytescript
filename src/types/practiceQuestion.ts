export type QuestionType = 'mcq' | 'coding';

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface TestCase {
  input: string;
  output: string;
  isHidden: boolean;
}

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
  points: number;
  timeLimit?: number; // in seconds
  explanation?: string;
}

export interface MCQQuestion extends BaseQuestion {
  type: 'mcq';
  options: Option[];
  selectedOption?: string;
}

export interface CodingQuestion extends BaseQuestion {
  type: 'coding';
  language: string;
  initialCode?: string;
  testCases: TestCase[];
  solution?: string;
  userCode?: string;
}

export type PracticeQuestion = MCQQuestion | CodingQuestion;

export interface PracticeSession {
  id: string;
  topicId: string;
  questions: PracticeQuestion[];
  currentQuestionIndex: number;
  timeRemaining: number;
  isCompleted: boolean;
  score: number;
  startedAt: Date;
  completedAt?: Date;
}
