import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';

import { db } from '@/firebase/config';
import type { PracticeTopic, Difficulty, Category } from '@/types/practice';

// Transform Firestore document to PracticeTopic
const transformDoc = (doc: any): PracticeTopic => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as PracticeTopic;
};

export const practiceTopicsApi = createApi({
  reducerPath: 'practiceTopicsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['PracticeTopic', 'PracticeTopicList'],
  endpoints: (builder) => ({
    // Get all practice topics
    getAllTopics: builder.query<PracticeTopic[], void>({
      queryFn: async () => {
        if (!db) {
          return { error: { status: 500, data: 'Firebase not initialized' } };
        }
        try {
          const querySnapshot = await getDocs(
            collection(db, 'practice_topics')
          );
          const topics = querySnapshot.docs.map(transformDoc);
          return { data: topics };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: ['PracticeTopicList'],
    }),

    // Get topic by ID
    getTopicById: builder.query<PracticeTopic, string>({
      queryFn: async (id) => {
        if (!db) {
          return { error: { status: 500, data: 'Firebase not initialized' } };
        }
        try {
          const docRef = doc(db, 'practice_topics', id);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            return { error: { status: 404, data: 'Topic not found' } };
          }

          return { data: transformDoc(docSnap) };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: (result, error, id) =>
        result ? [{ type: 'PracticeTopic', id }] : [],
    }),

    // Get topics by category
    getTopicsByCategory: builder.query<PracticeTopic[], Category>({
      queryFn: async (category) => {
        if (!db) {
          return { error: { status: 500, data: 'Firebase not initialized' } };
        }
        try {
          const q = query(
            collection(db, 'practice_topics'),
            where('category', '==', category)
          );
          const querySnapshot = await getDocs(q);
          const topics = querySnapshot.docs.map(transformDoc);
          return { data: topics };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: ['PracticeTopicList'],
    }),

    // Get topics by difficulty
    getTopicsByDifficulty: builder.query<PracticeTopic[], Difficulty>({
      queryFn: async (difficulty) => {
        if (!db) {
          return { error: { status: 500, data: 'Firebase not initialized' } };
        }
        try {
          const q = query(
            collection(db, 'practice_topics'),
            where('difficulty', '==', difficulty)
          );
          const querySnapshot = await getDocs(q);
          const topics = querySnapshot.docs.map(transformDoc);
          return { data: topics };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: ['PracticeTopicList'],
    }),

    // Get all categories
    getCategories: builder.query<Category[], void>({
      queryFn: async () => {
        if (!db) {
          return { error: { status: 500, data: 'Firebase not initialized' } };
        }
        try {
          const querySnapshot = await getDocs(
            collection(db, 'practice_topics')
          );
          const topics = querySnapshot.docs.map(transformDoc);
          const categories = [
            ...new Set(topics.map((topic) => topic.category).filter(Boolean)),
          ] as Category[];
          return { data: categories };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
    }),

    // Create new practice topic (admin only)
    createTopic: builder.mutation<
      PracticeTopic,
      Omit<PracticeTopic, 'id' | 'createdAt' | 'updatedAt'>
    >({
      queryFn: async (topicData) => {
        if (!db) {
          return { error: { status: 500, data: 'Firebase not initialized' } };
        }
        try {
          const docRef = doc(collection(db, 'practice_topics'));
          const newTopic = {
            ...topicData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          };

          await setDoc(docRef, newTopic);
          const createdTopic = {
            id: docRef.id,
            ...newTopic,
            createdAt: newTopic.createdAt.toDate(),
            updatedAt: newTopic.updatedAt.toDate(),
          } as PracticeTopic;

          return { data: createdTopic };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      invalidatesTags: ['PracticeTopicList'],
    }),

    // Update practice topic (admin only)
    updateTopic: builder.mutation<
      PracticeTopic,
      { id: string; updates: Partial<PracticeTopic> }
    >({
      queryFn: async ({ id, updates }) => {
        if (!db) {
          return { error: { status: 500, data: 'Firebase not initialized' } };
        }
        try {
          const docRef = doc(db, 'practice_topics', id);
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
        'PracticeTopicList',
        { type: 'PracticeTopic', id },
      ],
    }),

    // Delete practice topic (admin only)
    deleteTopic: builder.mutation<void, string>({
      queryFn: async (id) => {
        if (!db) {
          return { error: { status: 500, data: 'Firebase not initialized' } };
        }
        try {
          const docRef = doc(db, 'practice_topics', id);
          await deleteDoc(docRef);
          return { data: undefined };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      invalidatesTags: ['PracticeTopicList'],
    }),
  }),
});

// Export hooks
export const {
  useGetAllTopicsQuery,
  useGetTopicByIdQuery,
  useGetTopicsByCategoryQuery,
  useGetTopicsByDifficultyQuery,
  useGetCategoriesQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} = practiceTopicsApi;
