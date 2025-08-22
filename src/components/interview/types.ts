export interface AnswerSection {
  type: 'text' | 'code';
  content: string | { language: string; code: string } | string[];
}

export interface Question {
  id: string;
  question: string;
  answer: AnswerSection[];
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  topic?: string;
}
