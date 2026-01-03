import { useSelector } from 'react-redux';

import {
  useGetAllProblemsQuery,
  useCreateProblemMutation,
  useUpdateProblemMutation,
  useDeleteProblemMutation,
} from '@/store/slices/problemsSlice';
import type { RootState } from '@/store/store';
import type { Problem } from '@/types/problem';

// Custom hook for Problems with enhanced functionality
export const useProblemsRedux = () => {
  const authState = useSelector((state: RootState) => state.auth);

  // Basic queries
  const getAllProblems = useGetAllProblemsQuery();

  // Mutations (for admin use)
  const [createProblemTrigger, createProblemResult] =
    useCreateProblemMutation();
  const [updateProblemTrigger, updateProblemResult] =
    useUpdateProblemMutation();
  const [deleteProblemTrigger, deleteProblemResult] =
    useDeleteProblemMutation();

  // Helper functions that work with the query results
  const searchProblems = (query: string) => {
    if (!query || !getAllProblems.data) return getAllProblems;

    const searchTerm = query.toLowerCase();
    const filtered = getAllProblems.data.filter(
      (problem) =>
        problem.title.toLowerCase().includes(searchTerm) ||
        problem.description.toLowerCase().includes(searchTerm) ||
        problem.category.toLowerCase().includes(searchTerm)
    );

    return {
      ...getAllProblems,
      data: filtered,
    };
  };

  // Note: For dynamic queries, use the hooks directly in components
  // This hook provides static queries and helper functions

  const getProblemByIdWithFallback = (
    id: string,
    queryResult: any // Accept any query result type
  ) => {
    // If problem not found, return a fallback
    if (queryResult.isError && !queryResult.data) {
      return {
        ...queryResult,
        data: {
          id: 'fallback',
          title: 'Problem Not Found',
          description:
            'This problem could not be found. It may have been moved or deleted.',
          difficulty: 'Easy' as const,
          category: 'General',
          tags: [],
          constraints: [],
          examples: [],
          starterCode: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Problem,
        isError: false,
      };
    }

    return queryResult;
  };

  // Admin functions (check if user is admin)
  const isAdminCreateProblem = () => {
    if (!authState.currentUser || !authState.isAdmin) {
      return {
        ...createProblemResult,
        mutateAsync: async (
          ..._args: Parameters<typeof createProblemTrigger>
        ) => {
          throw new Error('Admin access required');
        },
      };
    }
    return {
      ...createProblemResult,
      mutateAsync: createProblemTrigger,
    };
  };

  const isAdminUpdateProblem = () => {
    if (!authState.currentUser || !authState.isAdmin) {
      return {
        ...updateProblemResult,
        mutateAsync: async (
          ..._args: Parameters<typeof updateProblemTrigger>
        ) => {
          throw new Error('Admin access required');
        },
      };
    }
    return {
      ...updateProblemResult,
      mutateAsync: updateProblemTrigger,
    };
  };

  const isAdminDeleteProblem = () => {
    if (!authState.currentUser || !authState.isAdmin) {
      return {
        ...deleteProblemResult,
        mutateAsync: async (
          ..._args: Parameters<typeof deleteProblemTrigger>
        ) => {
          throw new Error('Admin access required');
        },
      };
    }
    return {
      ...deleteProblemResult,
      mutateAsync: deleteProblemTrigger,
    };
  };

  return {
    // Basic data
    allProblems: getAllProblems,

    // Query functions (use hooks directly in components)
    getProblemByIdWithFallback,

    // Enhanced helpers
    searchProblems,

    // Admin mutations
    createProblem: isAdminCreateProblem(),
    updateProblem: isAdminUpdateProblem(),
    deleteProblem: isAdminDeleteProblem(),

    // Loading states
    isLoading: getAllProblems.isLoading,
    isFetching: getAllProblems.isFetching,
    error: getAllProblems.error,

    // Current user info
    currentUser: authState.currentUser,
    isAdmin: authState.isAdmin,
  };
};

export default useProblemsRedux;
