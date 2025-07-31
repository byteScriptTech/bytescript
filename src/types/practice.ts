export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type Category = 'problems' | 'dsa' | 'javascript' | 'python';

export interface PracticeTopic {
  id: string;
  name: string;
  description?: string;
  difficulty?: Difficulty;
  category?: Category;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
  Category?: Category;
}
