import { useEffect, useState } from 'react';

import { problemsService } from '@/services/firebase/problemsService';

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  constraints: string[];
  category: string;
  tags: string[];
  solved?: boolean;
  lastAttempted?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const useProblems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProblems = await problemsService.getAllProblems();
        setProblems(fetchedProblems || []);
      } catch {
        setError('Failed to load problems');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const updateProblemSolvedStatus = async (id: string, solved: boolean) => {
    try {
      await problemsService.updateProblem(id, { solved });
      const updatedProblems = problems.map((p) =>
        p.id === id ? { ...p, solved } : p
      );
      setProblems(updatedProblems);
    } catch (err) {
      console.error('Failed to update problem status:', err);
    }
  };

  const updateLastAttempted = async (id: string) => {
    try {
      await problemsService.updateProblem(id, { lastAttempted: new Date() });
      const updatedProblems = problems.map((p) =>
        p.id === id ? { ...p, lastAttempted: new Date() } : p
      );
      setProblems(updatedProblems);
    } catch (err) {
      console.error('Failed to update last attempted time:', err);
    }
  };

  return {
    problems,
    loading,
    error,
    updateProblemSolvedStatus,
    updateLastAttempted,
  };
};
