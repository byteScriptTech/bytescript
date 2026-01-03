import {
  useGetAllProblemsQuery,
  useUpdateProblemMutation,
} from '../store/slices/problemsSlice';
import type { Problem } from '../types/problem';

export interface ProblemWithUserProgress extends Problem {
  solved?: boolean;
  lastAttempted?: string | null;
}

export const useProblems = () => {
  const { data: problems = [], error, isLoading } = useGetAllProblemsQuery();

  const [updateProblem] = useUpdateProblemMutation();

  const updateProblemSolvedStatus = async (id: string, solved: boolean) => {
    try {
      await updateProblem({ id, updates: { solved } });
    } catch (err) {
      console.error('Failed to update problem status:', err);
    }
  };

  const updateLastAttempted = async (id: string) => {
    try {
      await updateProblem({
        id,
        updates: { lastAttempted: new Date().toISOString() },
      });
    } catch (err) {
      console.error('Failed to update last attempted time:', err);
    }
  };

  return {
    problems,
    loading: isLoading,
    error: error ? 'Failed to load problems' : null,
    updateProblemSolvedStatus,
    updateLastAttempted,
  };
};
