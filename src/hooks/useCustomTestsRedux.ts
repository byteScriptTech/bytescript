import {
  useGetTestQuery,
  useGetUserTestsQuery,
  useGetPublicTestsQuery,
  useCreateTestMutation,
  useUpdateTestMutation,
  useDeleteTestMutation,
  useGetTestAttemptsQuery,
  useGetUserTestAttemptsQuery,
  useStartTestAttemptMutation,
  useSubmitTestAttemptMutation,
} from '@/store/slices/customTestsSlice';
import type { RootState } from '@/store/store';
import type { CustomTest, TestAnswer } from '@/types/customTest';

// Hook for custom tests operations
export const useCustomTestsRedux = () => {
  // Queries - call all hooks at the top level
  const getTestQuery = useGetTestQuery;
  const getUserTestsQuery = useGetUserTestsQuery;
  const getPublicTestsQuery = useGetPublicTestsQuery;
  const getTestAttemptsQuery = useGetTestAttemptsQuery;
  const getUserTestAttemptsQuery = useGetUserTestAttemptsQuery;

  // Mutations
  const [createTestMutation] = useCreateTestMutation();
  const [updateTestMutation] = useUpdateTestMutation();
  const [deleteTestMutation] = useDeleteTestMutation();
  const [startTestAttemptMutation] = useStartTestAttemptMutation();
  const [submitTestAttemptMutation] = useSubmitTestAttemptMutation();

  // Wrapper functions for better UX
  const getTest = (testId: string) => getTestQuery(testId);
  const getUserTests = (userId: string) => getUserTestsQuery(userId);
  const getPublicTests = (limitCount?: number) =>
    getPublicTestsQuery(limitCount ?? 20);
  const getTestAttempts = (testId: string) => getTestAttemptsQuery(testId);
  const getUserTestAttempts = (userId: string) =>
    getUserTestAttemptsQuery(userId);

  // Wrapper functions for better UX
  const createTest = async (
    testData: Omit<CustomTest, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const result = await createTestMutation(testData).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to create test:', error);
      throw error;
    }
  };

  const updateTest = async (testId: string, updates: Partial<CustomTest>) => {
    try {
      await updateTestMutation({ testId, updates }).unwrap();
    } catch (error) {
      console.error('Failed to update test:', error);
      throw error;
    }
  };

  const deleteTest = async (testId: string) => {
    try {
      await deleteTestMutation(testId).unwrap();
    } catch (error) {
      console.error('Failed to delete test:', error);
      throw error;
    }
  };

  const startTestAttempt = async (testId: string, userId: string) => {
    try {
      const result = await startTestAttemptMutation({
        testId,
        userId,
      }).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to start test attempt:', error);
      throw error;
    }
  };

  const submitTestAttempt = async (
    attemptId: string,
    answers: TestAnswer[],
    timeSpent: number
  ) => {
    try {
      await submitTestAttemptMutation({
        attemptId,
        answers,
        timeSpent,
      }).unwrap();
    } catch (error) {
      console.error('Failed to submit test attempt:', error);
      throw error;
    }
  };

  return {
    // Queries
    getTest,
    getUserTests,
    getPublicTests,
    getTestAttempts,
    getUserTestAttempts,

    // Mutations
    createTest,
    updateTest,
    deleteTest,
    startTestAttempt,
    submitTestAttempt,

    // Selectors for direct access if needed
    selectAllTests: (state: RootState) => state.customTestsApi?.queries || {},
    selectTestById: (state: RootState, testId: string) =>
      state.customTestsApi?.queries[`getTest("${testId}")`]?.data,
  };
};

// Selectors for direct access
export const selectCustomTestsState = (state: RootState) =>
  state.customTestsApi;
