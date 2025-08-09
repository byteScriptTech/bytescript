export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  requirements?: string[];
  example?: string;
  solution?: string;
  constraints?: string[];
  testCases?: Array<{
    input: string;
    output: string;
  }>;
  hints?: string[];
  topicId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Example {
  code: string;
  description?: string;
  language?: string;
}

interface RelatedTopic {
  name: string;
  description: string;
  category?: string;
}

export interface Subtopic {
  name: string;
  description?: string;
  content?: string;
  examples?: Array<{
    code: string;
    description?: string;
  }>;
}

export interface Topic {
  challenges: any;
  name: string;
  id: string;
  slug: string;
  description?: string;
  content?: string;
  difficulty?: string;
  timeToComplete?: number;
  learningObjectives?: string[];
  commonMistakes?: string[];
  resources?: Array<{
    title: string;
    url: string;
    type: 'documentation' | 'video' | 'article';
    description?: string;
  }>;
  sections?: Array<{
    type: 'text' | 'code' | 'exercise' | 'quiz';
    title?: string;
    content?: string;
    explanation?: string;
    keyPoints?: string[];
    task?: string;
    hint?: string;
    solution?: string;
    question?: string;
    options?: string[];
    correctAnswer?: number;
  }>;
  examples?: Array<{
    code: string;
    description?: string;
    language?: string;
  }>;
  subtopics?: Subtopic[];
}

interface BestPracticesAndCommonMistakes {
  common_mistakes: {
    text: string;
    code?: string;
    example?: string;
    explanation?: string;
    fix?: string;
  }[];
  best_practices: {
    text: string;
    code?: string;
    example?: string;
  }[];
}

interface Introduction {
  text: string;
  key_concepts: string[];
  objective: string[];
  real_world_use_cases: string[];
  prerequisites: string[];
}

export interface LanguageContent {
  id: string;
  name: string;
  tag: string;
  description?: string;
  applications: string[];
  explanation: string[];
  best_practices_and_common_mistakes: BestPracticesAndCommonMistakes;
  related_topics: RelatedTopic[];
  topics: Topic[];
  challenges: Challenge[];
  resources?: Array<{
    id: string;
    title: string;
    url: string;
    type:
      | 'documentation'
      | 'video'
      | 'article'
      | 'course'
      | 'book'
      | 'cheatsheet';
    description?: string;
    author?: string;
  }>;
  introduction: Introduction;
  examples: Example[];
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}
