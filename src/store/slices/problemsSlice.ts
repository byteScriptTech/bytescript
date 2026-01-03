import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';

import { db } from '@/firebase/config';
import type { Problem } from '@/types/problem';

// Transform Firestore document to Problem
const transformDoc = (doc: any): Problem => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt:
      data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt:
      data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    // Ensure lastAttempted is serializable (string or null)
    lastAttempted:
      data.lastAttempted && typeof data.lastAttempted === 'string'
        ? data.lastAttempted
        : data.lastAttempted?.toDate?.()?.toISOString() || null,
  } as Problem;
};

export const problemsApi = createApi({
  reducerPath: 'problemsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Problem', 'ProblemList'],
  endpoints: (builder) => ({
    // Get all problems
    getAllProblems: builder.query<Problem[], void>({
      queryFn: async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'problems'));
          const problems = querySnapshot.docs.map(transformDoc);
          return { data: problems };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: ['ProblemList'],
    }),

    // Get problem by ID
    getProblemById: builder.query<Problem, string>({
      queryFn: async (id) => {
        try {
          const docRef = doc(db, 'problems', id);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            return { error: { status: 404, data: 'Problem not found' } };
          }

          return { data: transformDoc(docSnap) };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: (result, error, id) =>
        result ? [{ type: 'Problem', id }] : [],
    }),

    // Get problems by difficulty
    getProblemsByDifficulty: builder.query<
      Problem[],
      'Easy' | 'Medium' | 'Hard'
    >({
      queryFn: async (difficulty) => {
        try {
          const querySnapshot = await getDocs(collection(db, 'problems'));
          const problems = querySnapshot.docs
            .map(transformDoc)
            .filter((problem) => problem.difficulty === difficulty);
          return { data: problems };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: (result, error, difficulty) =>
        result ? [{ type: 'ProblemList', difficulty }] : [],
    }),

    // Get problems by category
    getProblemsByCategory: builder.query<Problem[], string>({
      queryFn: async (category) => {
        try {
          const querySnapshot = await getDocs(collection(db, 'problems'));
          const problems = querySnapshot.docs
            .map(transformDoc)
            .filter((problem) => problem.category === category);
          return { data: problems };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: ['ProblemList'],
    }),

    // Create new problem (admin only)
    createProblem: builder.mutation<
      Problem,
      Omit<Problem, 'id' | 'createdAt' | 'updatedAt'>
    >({
      queryFn: async (problemData) => {
        try {
          const docRef = doc(collection(db, 'problems'));
          const newProblem = {
            ...problemData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          };

          await setDoc(docRef, newProblem);
          const createdProblem = {
            id: docRef.id,
            ...newProblem,
            createdAt: newProblem.createdAt.toDate().toISOString(),
            updatedAt: newProblem.updatedAt.toDate().toISOString(),
          } as Problem;

          return { data: createdProblem };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      invalidatesTags: ['ProblemList'],
    }),

    // Update problem (admin only)
    updateProblem: builder.mutation<
      Problem,
      { id: string; updates: Partial<Problem> }
    >({
      queryFn: async ({ id, updates }) => {
        try {
          const docRef = doc(db, 'problems', id);
          const updateData = {
            ...updates,
            updatedAt: Timestamp.now(),
          };

          await setDoc(docRef, updateData, { merge: true });

          // Fetch updated document
          const updatedDoc = await getDoc(docRef);
          return { data: transformDoc(updatedDoc) };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      invalidatesTags: (result, error, { id }) => [
        'ProblemList',
        { type: 'Problem', id },
      ],
    }),

    // Delete problem (admin only)
    deleteProblem: builder.mutation<void, string>({
      queryFn: async (id) => {
        try {
          const docRef = doc(db, 'problems', id);
          await deleteDoc(docRef);
          return { data: undefined };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      invalidatesTags: ['ProblemList'],
    }),
  }),
});

// Export hooks
export const {
  useGetAllProblemsQuery,
  useGetProblemByIdQuery,
  useGetProblemsByDifficultyQuery,
  useGetProblemsByCategoryQuery,
  useCreateProblemMutation,
  useUpdateProblemMutation,
  useDeleteProblemMutation,
} = problemsApi;
