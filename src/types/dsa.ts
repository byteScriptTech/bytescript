import { Timestamp } from 'firebase/firestore';

export interface DSATopic {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'data-structures' | 'algorithms';
  subcategory?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  content?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  tags?: string[];
  prerequisites?: string[];
  operations?: Array<{
    name: string;
    description: string;
    timeComplexity: string;
    spaceComplexity: string;
  }>;
  examples?: Array<{
    // Original format
    title?: string;
    description?: string;
    code?: string;
    language?: string;

    // Alternative format
    input?: string;
    output?: string;
    explanation?: string;
  }>;
  problems?: Array<{
    id?: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    description: string;
    tags?: string[];
    initialCode?: string;
    hint?: string;
    solution?: string;
  }>;
  relatedTopics?: string[];
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}
