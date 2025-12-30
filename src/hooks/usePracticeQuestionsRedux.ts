import { useSelector } from 'react-redux';

import {
  useGetAllQuestionsQuery,
  useGetQuestionsByTypeQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from '@/store/slices/practiceQuestionsSlice';
import type { RootState } from '@/store/store';
import type { PracticeQuestion } from '@/types/practiceQuestion';

// Custom hook for Practice Questions with enhanced functionality
export const usePracticeQuestionsRedux = () => {
  const authState = useSelector((state: RootState) => state.auth);

  // Basic queries
  const getAllQuestions = useGetAllQuestionsQuery();
  const getMCQQuestions = useGetQuestionsByTypeQuery('mcq');
  const getCodingQuestions = useGetQuestionsByTypeQuery('coding');

  // Mutations (for admin use)
  const createQuestion = useCreateQuestionMutation();
  const updateQuestion = useUpdateQuestionMutation();
  const deleteQuestion = useDeleteQuestionMutation();

  // Note: For dynamic queries, use the hooks directly in components
  // This hook provides static queries and helper functions

  // Enhanced helpers
  const getMCQQuestionsByTopic = (topicId: string, queryResult: any) => {
    return {
      ...queryResult,
      data: queryResult.data?.filter((q: PracticeQuestion) => q.type === 'mcq'),
    };
  };

  const getCodingQuestionsByTopic = (topicId: string, queryResult: any) => {
    return {
      ...queryResult,
      data: queryResult.data?.filter(
        (q: PracticeQuestion) => q.type === 'coding'
      ),
    };
  };

  const searchInAllQuestions = (query: string, queryResult: any) => {
    return queryResult;
  };

  const searchMCQQuestions = (query: string, queryResult: any) => {
    return queryResult;
  };

  const searchCodingQuestions = (query: string, queryResult: any) => {
    return queryResult;
  };

  // Admin functions (check if user is admin)
  const isAdminCreateQuestion = () => {
    if (!authState.currentUser || !authState.isAdmin) {
      return {
        ...createQuestion,
        mutateAsync: async () => {
          throw new Error('Admin access required');
        },
      };
    }
    return createQuestion;
  };

  const isAdminUpdateQuestion = () => {
    if (!authState.currentUser || !authState.isAdmin) {
      return {
        ...updateQuestion,
        mutateAsync: async () => {
          throw new Error('Admin access required');
        },
      };
    }
    return updateQuestion;
  };

  const isAdminDeleteQuestion = () => {
    if (!authState.currentUser || !authState.isAdmin) {
      return {
        ...deleteQuestion,
        mutateAsync: async () => {
          throw new Error('Admin access required');
        },
      };
    }
    return deleteQuestion;
  };

  // Question validation helpers
  const validateMCQQuestion = (question: Partial<PracticeQuestion>) => {
    if (question.type !== 'mcq') return false;
    if (!question.question) return false;
    if (!question.options || !Array.isArray(question.options)) return false;
    if (question.options.length < 2) return false;

    const correctOptions = question.options.filter((opt: any) => opt.isCorrect);
    return correctOptions.length === 1;
  };

  const validateCodingQuestion = (question: Partial<PracticeQuestion>) => {
    if (question.type !== 'coding') return false;
    if (!question.question) return false;
    if (!question.language) return false;
    if (!question.testCases || !Array.isArray(question.testCases)) return false;
    if (question.testCases.length === 0) return false;

    return question.testCases.every((tc: any) => tc.input && tc.output);
  };

  return {
    // Basic data
    allQuestions: getAllQuestions,
    mcqQuestions: getMCQQuestions,
    codingQuestions: getCodingQuestions,

    // Query functions (use hooks directly in components)
    getMCQQuestionsByTopic,
    getCodingQuestionsByTopic,
    searchInAllQuestions,
    searchMCQQuestions,
    searchCodingQuestions,

    // Admin mutations
    createQuestion: isAdminCreateQuestion(),
    updateQuestion: isAdminUpdateQuestion(),
    deleteQuestion: isAdminDeleteQuestion(),

    // Validation helpers
    validateMCQQuestion,
    validateCodingQuestion,

    // Loading states
    isLoading: getAllQuestions.isLoading,
    isFetching: getAllQuestions.isFetching,
    error: getAllQuestions.error,

    // Current user info
    currentUser: authState.currentUser,
    isAdmin: authState.isAdmin,
  };
};

export default usePracticeQuestionsRedux;
