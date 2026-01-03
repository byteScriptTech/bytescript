import { useSelector } from 'react-redux';

import {
  useGetAllTopicsQuery,
  useGetTopicByIdQuery,
  useGetCategoriesQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} from '@/store/slices/practiceTopicsSlice';
import type { RootState } from '@/store/store';
import type { PracticeTopic, Category } from '@/types/practice';

// Custom hook for Practice Topics with enhanced functionality
export const usePracticeTopicsRedux = () => {
  const authState = useSelector((state: RootState) => state.auth);

  // Basic queries
  const getAllTopics = useGetAllTopicsQuery();
  const getCategories = useGetCategoriesQuery();

  // Mutations (for admin use)
  const [createTopicTrigger, createTopicResult] = useCreateTopicMutation();
  const [updateTopicTrigger, updateTopicResult] = useUpdateTopicMutation();
  const [deleteTopicTrigger, deleteTopicResult] = useDeleteTopicMutation();

  // Helper functions that work with the query results
  // Note: For category/difficulty specific queries, use the hooks directly in components:
  // const topicsByCategory = useGetTopicsByCategoryQuery(category);
  // const topicsByDifficulty = useGetTopicsByDifficultyQuery(difficulty);

  const searchTopics = (query: string) => {
    if (!query || !getAllTopics.data) return getAllTopics;

    const searchTerm = query.toLowerCase();
    const filtered = getAllTopics.data.filter(
      (topic) =>
        topic.name?.toLowerCase().includes(searchTerm) ||
        topic.description?.toLowerCase().includes(searchTerm)
    );

    return {
      ...getAllTopics,
      data: filtered,
    };
  };

  // Note: For dynamic queries, use the hooks directly in components
  // This hook provides static queries and helper functions

  const getTopicByIdWithFallback = (
    id: string,
    queryResult: ReturnType<typeof useGetTopicByIdQuery>
  ) => {
    // If topic not found, return a fallback
    if (queryResult.isError && !queryResult.data) {
      return {
        ...queryResult,
        data: {
          id: 'fallback',
          name: 'Topic Not Found',
          description:
            'This topic could not be found. It may have been moved or deleted.',
          category: 'problems' as Category,
        } as PracticeTopic,
        isError: false,
      };
    }

    return queryResult;
  };

  // Admin functions (check if user is admin)
  const isAdminCreateTopic = () => {
    if (!authState.currentUser || !authState.isAdmin) {
      return {
        ...createTopicResult,
        mutateAsync: async (
          ..._args: Parameters<typeof createTopicTrigger>
        ) => {
          throw new Error('Admin access required');
        },
      };
    }
    return {
      ...createTopicResult,
      mutateAsync: createTopicTrigger,
    };
  };

  const isAdminUpdateTopic = () => {
    if (!authState.currentUser || !authState.isAdmin) {
      return {
        ...updateTopicResult,
        mutateAsync: async (
          ..._args: Parameters<typeof updateTopicTrigger>
        ) => {
          throw new Error('Admin access required');
        },
      };
    }
    return {
      ...updateTopicResult,
      mutateAsync: updateTopicTrigger,
    };
  };

  const isAdminDeleteTopic = () => {
    if (!authState.currentUser || !authState.isAdmin) {
      return {
        ...deleteTopicResult,
        mutateAsync: async (
          ..._args: Parameters<typeof deleteTopicTrigger>
        ) => {
          throw new Error('Admin access required');
        },
      };
    }
    return {
      ...deleteTopicResult,
      mutateAsync: deleteTopicTrigger,
    };
  };

  return {
    // Basic data
    allTopics: getAllTopics,
    categories: getCategories,

    // Query functions (use hooks directly in components)
    getTopicByIdWithFallback,

    // Enhanced helpers
    searchTopics,

    // Admin mutations
    createTopic: isAdminCreateTopic(),
    updateTopic: isAdminUpdateTopic(),
    deleteTopic: isAdminDeleteTopic(),

    // Loading states
    isLoading: getAllTopics.isLoading,
    isFetching: getAllTopics.isFetching,
    error: getAllTopics.error,

    // Current user info
    currentUser: authState.currentUser,
    isAdmin: authState.isAdmin,
  };
};

export default usePracticeTopicsRedux;
