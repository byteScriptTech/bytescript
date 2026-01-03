import {
  createApi,
  BaseQueryFn,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';

import { db } from '@/firebase/config';
import type { CustomTest, TestAttempt, TestAnswer } from '@/types/customTest';

const TESTS_COLLECTION = 'customTests';
const ATTEMPTS_COLLECTION = 'testAttempts';

// Transform Firestore document to CustomTest
const transformDoc = (doc: any): CustomTest => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt:
      data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt:
      data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as CustomTest;
};

// Transform Firestore document to TestAttempt
const transformAttemptDoc = (doc: any): TestAttempt => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    startedAt:
      data.startedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    completedAt: data.completedAt?.toDate?.()?.toISOString() || undefined,
  } as TestAttempt;
};

// Custom base query for Firebase
const firebaseBaseQuery: BaseQueryFn<
  {
    collection: string;
    docId?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    queryParams?: any[];
  },
  unknown,
  FetchBaseQueryError
> = async ({
  collection: collectionName,
  docId,
  method = 'GET',
  body,
  queryParams,
}) => {
  try {
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    let result: any;

    switch (method) {
      case 'GET': {
        if (docId) {
          const docRef = doc(db, collectionName, docId);
          const docSnap = await getDoc(docRef);
          if (collectionName === ATTEMPTS_COLLECTION) {
            result = docSnap.exists() ? transformAttemptDoc(docSnap) : null;
          } else {
            result = docSnap.exists() ? transformDoc(docSnap) : null;
          }
        } else {
          let q;
          if (queryParams && queryParams.length > 0) {
            q = query(collection(db, collectionName), ...queryParams);
          } else {
            q = query(collection(db, collectionName));
          }
          const querySnapshot = await getDocs(q);
          if (collectionName === ATTEMPTS_COLLECTION) {
            result = querySnapshot.docs.map(transformAttemptDoc);
          } else {
            result = querySnapshot.docs.map(transformDoc);
          }
        }
        break;
      }

      case 'POST': {
        const timestampFields =
          collectionName === ATTEMPTS_COLLECTION
            ? { startedAt: Timestamp.now() }
            : { createdAt: Timestamp.now(), updatedAt: Timestamp.now() };

        const docRef = await addDoc(collection(db, collectionName), {
          ...body,
          ...timestampFields,
        });
        result = { id: docRef.id };
        break;
      }

      case 'PUT': {
        if (!docId)
          throw new Error('Document ID is required for PUT operations');
        const docRefToUpdate = doc(db, collectionName, docId);

        const timestampFields =
          collectionName === ATTEMPTS_COLLECTION
            ? { completedAt: Timestamp.now() }
            : { updatedAt: Timestamp.now() };

        await updateDoc(docRefToUpdate, {
          ...body,
          ...timestampFields,
        });
        result = { id: docId };
        break;
      }

      case 'DELETE': {
        if (!docId)
          throw new Error('Document ID is required for DELETE operations');
        await deleteDoc(doc(db, collectionName, docId));
        result = { id: docId };
        break;
      }

      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return { data: result };
  } catch (error) {
    return {
      error: {
        status: 'CUSTOM_ERROR',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

export const customTestsApi = createApi({
  reducerPath: 'customTestsApi',
  baseQuery: firebaseBaseQuery,
  tagTypes: ['CustomTest', 'TestAttempt'],
  endpoints: (builder) => ({
    // Test CRUD operations
    getTest: builder.query<CustomTest | null, string>({
      query: (testId) => ({
        collection: TESTS_COLLECTION,
        docId: testId,
      }),
      providesTags: (result, error, testId) =>
        result ? [{ type: 'CustomTest', id: testId }] : [],
    }),

    getUserTests: builder.query<CustomTest[], string>({
      query: (userId) => ({
        collection: TESTS_COLLECTION,
        queryParams: [
          where('createdBy', '==', userId),
          orderBy('updatedAt', 'desc'),
        ],
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'CustomTest' as const, id })),
              'CustomTest',
            ]
          : ['CustomTest'],
    }),

    getPublicTests: builder.query<CustomTest[], number>({
      query: (limitCount = 20) => ({
        collection: TESTS_COLLECTION,
        queryParams: [
          where('isPublic', '==', true),
          orderBy('createdAt', 'desc'),
          limit(limitCount),
        ],
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'CustomTest' as const, id })),
              'CustomTest',
            ]
          : ['CustomTest'],
    }),

    createTest: builder.mutation<
      string,
      Omit<CustomTest, 'id' | 'createdAt' | 'updatedAt'>
    >({
      query: (testData) => ({
        collection: TESTS_COLLECTION,
        method: 'POST',
        body: testData,
      }),
      invalidatesTags: ['CustomTest'],
    }),

    updateTest: builder.mutation<
      void,
      { testId: string; updates: Partial<CustomTest> }
    >({
      query: ({ testId, updates }) => ({
        collection: TESTS_COLLECTION,
        docId: testId,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { testId }) => [
        { type: 'CustomTest', id: testId },
      ],
    }),

    deleteTest: builder.mutation<void, string>({
      query: (testId) => ({
        collection: TESTS_COLLECTION,
        docId: testId,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, testId) => [
        { type: 'CustomTest', id: testId },
      ],
    }),

    // Test Attempt operations
    getTestAttempts: builder.query<TestAttempt[], string>({
      query: (testId) => ({
        collection: ATTEMPTS_COLLECTION,
        queryParams: [
          where('testId', '==', testId),
          orderBy('startedAt', 'desc'),
        ],
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'TestAttempt' as const, id })),
              'TestAttempt',
            ]
          : ['TestAttempt'],
    }),

    getUserTestAttempts: builder.query<TestAttempt[], string>({
      query: (userId) => ({
        collection: ATTEMPTS_COLLECTION,
        queryParams: [
          where('userId', '==', userId),
          orderBy('startedAt', 'desc'),
        ],
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'TestAttempt' as const, id })),
              'TestAttempt',
            ]
          : ['TestAttempt'],
    }),

    startTestAttempt: builder.mutation<
      string,
      { testId: string; userId: string }
    >({
      query: ({ testId, userId }) => ({
        collection: ATTEMPTS_COLLECTION,
        method: 'POST',
        body: {
          testId,
          userId,
          status: 'in_progress',
          answers: [],
          score: 0,
          timeSpent: 0,
        },
      }),
      invalidatesTags: ['TestAttempt'],
    }),

    submitTestAttempt: builder.mutation<
      void,
      { attemptId: string; answers: TestAnswer[]; timeSpent: number }
    >({
      query: ({ attemptId, answers, timeSpent }) => ({
        collection: ATTEMPTS_COLLECTION,
        docId: attemptId,
        method: 'PUT',
        body: {
          status: 'completed',
          answers,
          timeSpent,
          completedAt: Timestamp.now(),
        },
      }),
      invalidatesTags: (result, error, { attemptId }) => [
        { type: 'TestAttempt', id: attemptId },
      ],
    }),
  }),
});

export const {
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
} = customTestsApi;
