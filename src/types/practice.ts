import { ReactNode } from 'react';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type Category = 'problems' | 'dsa' | 'javascript' | 'python';

export interface SidebarItem {
  id: string;
  name: string;
  icon?: ReactNode;
  children?: SidebarItem[];
  onClick?: () => void;
  isActive?: boolean;
  showChildren?: boolean;
}

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
