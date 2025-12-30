import { useSelector } from 'react-redux';

import type { DSATopic } from '@/store/slices/dsaTopicsSlice';
import {
  useGetAllTopicsQuery,
  useGetTopicBySlugQuery,
  useGetTopicsByCategoryQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} from '@/store/slices/dsaTopicsSlice';
import type { RootState } from '@/store/store';

// Custom hook for DSA Topics with enhanced functionality
export const useDSATopicsRedux = () => {
  const authState = useSelector((state: RootState) => state.auth);

  // Basic queries
  const getAllTopics = useGetAllTopicsQuery();
  const getAllDataStructuresQuery =
    useGetTopicsByCategoryQuery('data-structures');
  const getAllAlgorithmsQuery = useGetTopicsByCategoryQuery('algorithms');

  // Mutations (for admin use)
  const [createTopicTrigger, createTopicResult] = useCreateTopicMutation();
  const [updateTopicTrigger, updateTopicResult] = useUpdateTopicMutation();
  const [deleteTopicTrigger, deleteTopicResult] = useDeleteTopicMutation();

  // Helper functions that work with the query results
  const getAllDataStructures = () => {
    return {
      ...getAllDataStructuresQuery,
      data: getAllDataStructuresQuery.data?.filter(
        (topic) => !topic.subcategory || topic.subcategory === 'basic'
      ),
    };
  };

  const getAllAlgorithms = () => {
    return getAllAlgorithmsQuery;
  };

  const getTopicsBySubcategory = (subcategory: string) => {
    if (!getAllTopics.data) return getAllTopics;

    const filtered = getAllTopics.data.filter(
      (topic) => topic.subcategory === subcategory
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
        topic.title.toLowerCase().includes(searchTerm) ||
        topic.description.toLowerCase().includes(searchTerm) ||
        topic.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
    );

    return {
      ...getAllTopics,
      data: filtered,
    };
  };

  // Note: For dynamic queries, use the hooks directly in components
  // This hook provides static queries and helper functions

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
          title: 'Topic Not Found',
          slug,
          description:
            'This topic could not be found. It may have been moved or deleted.',
          category: 'data-structures' as const,
          content:
            '# Topic Not Found\n\nThe requested topic could not be found. Please check the URL or try browsing our available topics.',
        } as DSATopic,
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

    // Query functions (use hooks directly in components)
    getTopicBySlugWithFallback,

    // Enhanced helpers
    getAllDataStructures,
    getAllAlgorithms,
    getTopicsBySubcategory,
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

export default useDSATopicsRedux;
