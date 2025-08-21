export interface AnswerSection {
  type: 'text' | 'code' | 'list' | 'note';
  content: string | string[] | CodeSnippet;
}

export interface CodeSnippet {
  language: string;
  code: string;
  explanation?: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  answer: AnswerSection[];
  createdAt?: string;
  updatedAt?: string;
}

export interface InterviewQuestionsByTopic {
  [topic: string]: InterviewQuestion[];
}
