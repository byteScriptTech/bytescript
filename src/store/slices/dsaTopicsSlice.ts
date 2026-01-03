import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
} from 'firebase/firestore';

import { db } from '@/firebase/config';
import { DSATopic } from '@/types/dsa';

// Transform Firestore document to DSATopic
const transformDoc = (doc: any): DSATopic => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    slug: data.slug,
    description: data.description,
    category: data.category,
    subcategory: data.subcategory,
    difficulty: data.difficulty,
    content: data.content,
    timeComplexity: data.timeComplexity,
    spaceComplexity: data.spaceComplexity,
    tags: data.tags || [],
    prerequisites: data.prerequisites || [],
    operations: data.operations || [],
    examples: data.examples || [],
    visualizations: data.visualizations || [],
    createdAt:
      data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt:
      data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as DSATopic;
};

export const dsaTopicsApi = createApi({
  reducerPath: 'dsaTopicsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['DSATopic', 'DSATopicList'],
  endpoints: (builder) => ({
    // Get all DSA topics
    getAllTopics: builder.query<DSATopic[], void>({
      queryFn: async () => {
        try {
          if (!db) {
            throw new Error('Firestore not initialized');
          }

          const querySnapshot = await getDocs(collection(db, 'dsa-topics'));
          const topics = querySnapshot.docs.map(transformDoc);
          return { data: topics };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: ['DSATopicList'],
    }),

    // Get topic by slug
    getTopicBySlug: builder.query<DSATopic, string>({
      queryFn: async (slug) => {
        try {
          if (!db) {
            throw new Error('Firestore not initialized');
          }

          const querySnapshot = await getDocs(collection(db, 'dsa-topics'));
          const topics = querySnapshot.docs.map(transformDoc);
          const topic = topics.find((t) => t.slug === slug);

          if (!topic) {
            return { error: { status: 404, data: 'Topic not found' } };
          }

          return { data: topic };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: (result, error, slug) =>
        result ? [{ type: 'DSATopic', id: slug }] : [],
    }),

    // Get topic by ID
    getTopicById: builder.query<DSATopic, string>({
      queryFn: async (id) => {
        try {
          if (!db) {
            throw new Error('Firestore not initialized');
          }

          const docRef = doc(db, 'dsa-topics', id);
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
        result ? [{ type: 'DSATopic', id }] : [],
    }),

    // Get topics by category
    getTopicsByCategory: builder.query<
      DSATopic[],
      'data-structures' | 'algorithms'
    >({
      queryFn: async (category) => {
        try {
          if (!db) {
            throw new Error('Firestore not initialized');
          }

          const querySnapshot = await getDocs(collection(db, 'dsa-topics'));
          const topics = querySnapshot.docs
            .map(transformDoc)
            .filter((topic) => topic.category === category);
          return { data: topics };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: ['DSATopicList'],
    }),

    // Get topics by difficulty
    getTopicsByDifficulty: builder.query<
      DSATopic[],
      'beginner' | 'intermediate' | 'advanced'
    >({
      queryFn: async (difficulty) => {
        try {
          if (!db) {
            throw new Error('Firestore not initialized');
          }

          const querySnapshot = await getDocs(collection(db, 'dsa-topics'));
          const topics = querySnapshot.docs
            .map(transformDoc)
            .filter((topic) => topic.difficulty === difficulty);
          return { data: topics };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: ['DSATopicList'],
    }),

    // Create new topic (admin only)
    createTopic: builder.mutation<
      DSATopic,
      Omit<DSATopic, 'id' | 'createdAt' | 'updatedAt'>
    >({
      queryFn: async (topicData) => {
        try {
          if (!db) {
            throw new Error('Firestore not initialized');
          }

          const docRef = doc(collection(db, 'dsa-topics'));
          const newTopic = {
            ...topicData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          };

          await setDoc(docRef, newTopic);
          const createdTopic = {
            id: docRef.id,
            ...newTopic,
            createdAt: newTopic.createdAt.toDate().toISOString(),
            updatedAt: newTopic.updatedAt.toDate().toISOString(),
          } as DSATopic;

          return { data: createdTopic };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      invalidatesTags: ['DSATopicList'],
    }),

    // Update topic (admin only)
    updateTopic: builder.mutation<
      DSATopic,
      { id: string; updates: Partial<DSATopic> }
    >({
      queryFn: async ({ id, updates }) => {
        try {
          if (!db) {
            throw new Error('Firestore not initialized');
          }

          const docRef = doc(db, 'dsa-topics', id);
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
        'DSATopicList',
        { type: 'DSATopic', id },
      ],
    }),

    // Delete topic (admin only)
    deleteTopic: builder.mutation<void, string>({
      queryFn: async (id) => {
        try {
          if (!db) {
            throw new Error('Firestore not initialized');
          }

          const docRef = doc(db, 'dsa-topics', id);
          await setDoc(
            docRef,
            { deleted: true, updatedAt: Timestamp.now() },
            { merge: true }
          );
          return { data: undefined };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      invalidatesTags: ['DSATopicList'],
    }),
  }),
});

// Export hooks
export const {
  useGetAllTopicsQuery,
  useGetTopicBySlugQuery,
  useGetTopicByIdQuery,
  useGetTopicsByCategoryQuery,
  useGetTopicsByDifficultyQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} = dsaTopicsApi;
