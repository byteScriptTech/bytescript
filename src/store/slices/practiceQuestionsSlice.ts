import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  limit,
} from 'firebase/firestore';

import { db } from '@/firebase/config';
import { PracticeQuestion, QuestionType } from '@/types/practiceQuestion';

// Transform Firestore document to PracticeQuestion
const transformDoc = (doc: any): PracticeQuestion => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as PracticeQuestion;
};

export const practiceQuestionsApi = createApi({
  reducerPath: 'practiceQuestionsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['PracticeQuestion', 'PracticeQuestionList'],
  endpoints: (builder) => ({
    // Get all practice questions with pagination
    getAllQuestions: builder.query<
      PracticeQuestion[],
      { limit?: number } | void
    >({
      queryFn: async (params = {}) => {
        try {
          if (!db) {
            throw new Error('Firestore is not initialized');
          }

          const { limit: limitParam = 20 } = params || {};
          let q = query(
            collection(db, 'practice_questions'),
            orderBy('createdAt', 'desc')
          );

          if (limitParam) {
            q = query(q, limit(limitParam));
          }

          const querySnapshot = await getDocs(q);
          const questions = querySnapshot.docs.map(transformDoc);
          return { data: questions };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: ['PracticeQuestionList'],
    }),

    // Get question by ID
    getQuestionById: builder.query<PracticeQuestion, string>({
      queryFn: async (id) => {
        try {
          if (!db) {
            throw new Error('Firestore is not initialized');
          }

          const docRef = doc(db, 'practice_questions', id);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            return { error: { status: 404, data: 'Question not found' } };
          }

          return { data: transformDoc(docSnap) };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: (result, error, id) =>
        result ? [{ type: 'PracticeQuestion', id }] : [],
    }),

    // Get questions by type
    getQuestionsByType: builder.query<PracticeQuestion[], QuestionType>({
      queryFn: async (type) => {
        try {
          if (!db) {
            throw new Error('Firestore is not initialized');
          }

          const q = query(
            collection(db, 'practice_questions'),
            where('type', '==', type),
            orderBy('createdAt', 'desc')
          );
          const querySnapshot = await getDocs(q);
          const questions = querySnapshot.docs.map(transformDoc);
          return { data: questions };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: ['PracticeQuestionList'],
    }),

    // Get questions by topic
    getQuestionsByTopic: builder.query<PracticeQuestion[], string>({
      queryFn: async (topicId) => {
        try {
          if (!db) {
            throw new Error('Firestore is not initialized');
          }

          const q = query(
            collection(db, 'practice_questions'),
            where('topicId', '==', topicId),
            orderBy('createdAt', 'desc')
          );
          const querySnapshot = await getDocs(q);
          const questions = querySnapshot.docs.map(transformDoc);
          return { data: questions };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: ['PracticeQuestionList'],
    }),

    // Search questions
    searchQuestions: builder.query<
      PracticeQuestion[],
      { query: string; type?: QuestionType; topicId?: string }
    >({
      queryFn: async ({ query: searchQuery, type, topicId }) => {
        try {
          if (!db) {
            throw new Error('Firestore is not initialized');
          }

          let q = query(
            collection(db, 'practice_questions'),
            orderBy('createdAt', 'desc')
          );

          if (type) {
            q = query(q, where('type', '==', type));
          }

          if (topicId) {
            q = query(q, where('topicId', '==', topicId));
          }

          const querySnapshot = await getDocs(q);
          let questions = querySnapshot.docs.map(transformDoc);

          // Client-side text search
          if (searchQuery) {
            const searchTerm = searchQuery.toLowerCase();
            questions = questions.filter(
              (question) =>
                question.question.toLowerCase().includes(searchTerm) ||
                question.explanation?.toLowerCase().includes(searchTerm)
            );
          }

          return { data: questions };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: ['PracticeQuestionList'],
    }),

    // Create new question (admin only)
    createQuestion: builder.mutation<
      PracticeQuestion,
      Omit<PracticeQuestion, 'id' | 'createdAt' | 'updatedAt'>
    >({
      queryFn: async (questionData) => {
        try {
          if (!db) {
            throw new Error('Firestore is not initialized');
          }

          const docRef = await addDoc(collection(db, 'practice_questions'), {
            ...questionData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

          // Fetch the created document
          const createdDoc = await getDoc(docRef);
          return { data: transformDoc(createdDoc) };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      invalidatesTags: ['PracticeQuestionList'],
    }),

    // Update question (admin only)
    updateQuestion: builder.mutation<
      PracticeQuestion,
      { id: string; updates: Partial<PracticeQuestion> }
    >({
      queryFn: async ({ id, updates }) => {
        try {
          if (!db) {
            throw new Error('Firestore is not initialized');
          }

          const docRef = doc(db, 'practice_questions', id);
          const updateData = {
            ...updates,
            updatedAt: serverTimestamp(),
          };

          await updateDoc(docRef, updateData);

          // Fetch updated document
          const updatedDoc = await getDoc(docRef);
          return { data: transformDoc(updatedDoc) };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      invalidatesTags: (result, error, { id }) => [
        'PracticeQuestionList',
        { type: 'PracticeQuestion', id },
      ],
    }),

    // Delete question (admin only)
    deleteQuestion: builder.mutation<void, string>({
      queryFn: async (id) => {
        try {
          if (!db) {
            throw new Error('Firestore is not initialized');
          }

          const docRef = doc(db, 'practice_questions', id);
          await deleteDoc(docRef);
          return { data: undefined };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      invalidatesTags: ['PracticeQuestionList'],
    }),

    // Get question statistics
    getQuestionStats: builder.query<
      {
        total: number;
        byType: Record<QuestionType, number>;
        byTopic: Record<string, number>;
      },
      void
    >({
      queryFn: async () => {
        try {
          if (!db) {
            throw new Error('Firestore is not initialized');
          }

          const querySnapshot = await getDocs(
            collection(db, 'practice_questions')
          );
          const questions = querySnapshot.docs.map(transformDoc);

          const stats = {
            total: questions.length,
            byType: questions.reduce(
              (acc, q) => {
                acc[q.type] = (acc[q.type] || 0) + 1;
                return acc;
              },
              {} as Record<QuestionType, number>
            ),
            byTopic: questions.reduce(
              (acc, q) => {
                acc[q.topicId] = (acc[q.topicId] || 0) + 1;
                return acc;
              },
              {} as Record<string, number>
            ),
          };

          return { data: stats };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: ['PracticeQuestionList'],
    }),
  }),
});

// Export hooks
export const {
  useGetAllQuestionsQuery,
  useGetQuestionByIdQuery,
  useGetQuestionsByTypeQuery,
  useGetQuestionsByTopicQuery,
  useSearchQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useGetQuestionStatsQuery,
} = practiceQuestionsApi;
