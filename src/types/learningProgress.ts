export interface Topic {
  id: string;
  isCompleted: boolean;
  name: string;
}

export interface LearningProgress {
  topics: Topic[];
  progress: number;
}
