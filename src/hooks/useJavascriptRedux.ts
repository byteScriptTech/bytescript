import { useSelector } from 'react-redux';

import {
  useGetJavascriptContentQuery,
  useGetAllTopicsQuery,
  useGetTopicByIdQuery,
  useGetTopicBySlugQuery,
  useGetTopicsByDifficultyQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} from '@/store/slices/javascriptSlice';
import type { RootState } from '@/store/store';
import type { Topic } from '@/types/content';

// Custom hook for JavaScript content with enhanced functionality
export const useJavascriptRedux = () => {
  const authState = useSelector((state: RootState) => state.auth);

  // Basic queries
  const getJavascriptContent = useGetJavascriptContentQuery();
  const getAllTopics = useGetAllTopicsQuery();

  // Helper functions that work with the query results
  const getTopicsByDifficulty = (
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ) => {
    if (!getAllTopics.data) return getAllTopics;

    const filtered = getAllTopics.data.filter(
      (topic) => topic.difficulty === difficulty
    );
    return {
      ...getAllTopics,
      data: filtered,
    };
  };

  const searchTopics = (query: string) => {
    if (!query || !getAllTopics.data) return getAllTopics;

    const searchTerm = query.toLowerCase();
    const filtered = getAllTopics.data.filter(
      (topic) =>
        topic.name.toLowerCase().includes(searchTerm) ||
        topic.description?.toLowerCase().includes(searchTerm) ||
        topic.slug.toLowerCase().includes(searchTerm)
    );

    return {
      ...getAllTopics,
      data: filtered,
    };
  };

  const getTopicBySlugWithFallback = (
    slug: string,
    queryResult: ReturnType<typeof useGetTopicBySlugQuery>
  ) => {
    // If topic not found, return a fallback
    if (queryResult.isError && !queryResult.data) {
      return {
        ...queryResult,
        data: {
          id: 'fallback',
          name: 'Topic Not Found',
          slug,
          description:
            'This JavaScript topic could not be found. It may have been moved or deleted.',
          content:
            '# Topic Not Found\n\nThe requested JavaScript topic could not be found. Please check the URL or try browsing our available topics.',
        } as Topic,
        isError: false,
      };
    }

    return queryResult;
  };

  // Mutations (for admin use)
  const [createTopicTrigger, createTopicResult] = useCreateTopicMutation();
  const [updateTopicTrigger, updateTopicResult] = useUpdateTopicMutation();
  const [deleteTopicTrigger, deleteTopicResult] = useDeleteTopicMutation();

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
    javascriptContent: getJavascriptContent,
    allTopics: getAllTopics,

    // Query functions (use hooks directly in components)
    getTopicById: useGetTopicByIdQuery,
    getTopicBySlug: useGetTopicBySlugQuery,
    getTopicsByDifficultyQuery: useGetTopicsByDifficultyQuery,

    // Enhanced helpers
    getTopicsByDifficulty: getTopicsByDifficulty,
    searchTopics: searchTopics,
    getTopicBySlugWithFallback,

    // Admin mutations
    createTopic: isAdminCreateTopic(),
    updateTopic: isAdminUpdateTopic(),
    deleteTopic: isAdminDeleteTopic(),

    // Loading states
    isLoading: getJavascriptContent.isLoading || getAllTopics.isLoading,
    isFetching: getJavascriptContent.isFetching || getAllTopics.isFetching,
    error: getJavascriptContent.error || getAllTopics.error,

    // Current user info
    currentUser: authState.currentUser,
    isAdmin: authState.isAdmin,
  };
};

export default useJavascriptRedux;
