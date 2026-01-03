import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';
import type { LanguageContent, Topic } from '@/types/content';

const JAVASCRIPT_CONTENT_COLLECTION = 'languages';
const JAVASCRIPT_CONTENT_ID = 'javascript';

// Transform Firestore document to LanguageContent
const transformDoc = (doc: any): LanguageContent => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt:
      data.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
    updatedAt:
      data.updatedAt?.toDate()?.toISOString() || new Date().toISOString(),
  } as LanguageContent;
};

export const javascriptApi = createApi({
  reducerPath: 'javascriptApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['JavaScriptContent', 'JavaScriptTopic'],
  endpoints: (builder) => ({
    // Get JavaScript language content
    getJavascriptContent: builder.query<LanguageContent | null, void>({
      queryFn: async () => {
        try {
          if (!db) {
            throw new Error('Firestore not initialized');
          }

          const docRef = doc(
            db,
            JAVASCRIPT_CONTENT_COLLECTION,
            JAVASCRIPT_CONTENT_ID
          );
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            return { data: transformDoc(docSnap) };
          }
          return { data: null };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      providesTags: ['JavaScriptContent'],
    }),

    // Get all JavaScript topics
    getAllTopics: builder.query<Topic[], void>({
      queryFn: async () => {
        try {
          if (!db) {
            throw new Error('Firestore not initialized');
          }

          const docRef = doc(
            db,
            JAVASCRIPT_CONTENT_COLLECTION,
            JAVASCRIPT_CONTENT_ID
          );
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const content = transformDoc(docSnap);
            return { data: content.topics || [] };
          }
          return { data: [] };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      providesTags: ['JavaScriptContent'],
    }),

    // Get JavaScript topic by ID
    getTopicById: builder.query<Topic | null, string>({
      queryFn: async (topicId) => {
        try {
          if (!db) {
            throw new Error('Firestore not initialized');
          }

          const docRef = doc(
            db,
            JAVASCRIPT_CONTENT_COLLECTION,
            JAVASCRIPT_CONTENT_ID
          );
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const content = transformDoc(docSnap);
            const topic = content.topics?.find((t) => t.id === topicId) || null;
            return { data: topic };
          }
          return { data: null };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      providesTags: (result, error, topicId) =>
        result ? [{ type: 'JavaScriptTopic', id: topicId }] : [],
    }),

    // Get JavaScript topic by slug
    getTopicBySlug: builder.query<Topic | null, string>({
      queryFn: async (slug) => {
        try {
          if (!db) {
            throw new Error('Firestore not initialized');
          }

          const docRef = doc(
            db,
            JAVASCRIPT_CONTENT_COLLECTION,
            JAVASCRIPT_CONTENT_ID
          );
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const content = transformDoc(docSnap);
            const topic = content.topics?.find((t) => t.slug === slug) || null;
            return { data: topic };
          }
          return { data: null };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      providesTags: (result, error, slug) =>
        result ? [{ type: 'JavaScriptTopic', id: slug }] : [],
    }),

    // Get JavaScript topics by difficulty
    getTopicsByDifficulty: builder.query<
      Topic[],
      'beginner' | 'intermediate' | 'advanced'
    >({
      queryFn: async (difficulty) => {
        try {
          if (!db) {
            throw new Error('Firestore not initialized');
          }

          const docRef = doc(
            db,
            JAVASCRIPT_CONTENT_COLLECTION,
            JAVASCRIPT_CONTENT_ID
          );
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const content = transformDoc(docSnap);
            const filteredTopics =
              content.topics?.filter(
                (topic) => topic.difficulty === difficulty
              ) || [];
            return { data: filteredTopics };
          }
          return { data: [] };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      providesTags: ['JavaScriptContent'],
    }),

    // Create a new JavaScript topic
    createTopic: builder.mutation<Topic, Omit<Topic, 'id'>>({
      queryFn: async (topicData) => {
        try {
          if (!db) {
            throw new Error('Firestore not initialized');
          }

          const docRef = doc(
            db,
            JAVASCRIPT_CONTENT_COLLECTION,
            JAVASCRIPT_CONTENT_ID
          );
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            throw new Error('JavaScript content not found');
          }

          const data = docSnap.data();
          const topics: Topic[] = data.topics || [];
          const newTopic = {
            ...topicData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          await updateDoc(docRef, {
            topics: [...topics, newTopic],
            updatedAt: new Date().toISOString(),
          });

          return { data: newTopic };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      invalidatesTags: ['JavaScriptContent'],
    }),

    // Update an existing JavaScript topic
    updateTopic: builder.mutation<
      Topic,
      { id: string; topicData: Partial<Omit<Topic, 'id'>> }
    >({
      queryFn: async ({ id, topicData }) => {
        try {
          if (!db) {
            throw new Error('Firestore not initialized');
          }

          const docRef = doc(
            db,
            JAVASCRIPT_CONTENT_COLLECTION,
            JAVASCRIPT_CONTENT_ID
          );
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            throw new Error('JavaScript content not found');
          }

          const data = docSnap.data();
          const topics: Topic[] = data.topics || [];
          const topicIndex = topics.findIndex((topic) => topic.id === id);

          if (topicIndex === -1) {
            throw new Error('Topic not found');
          }

          const updatedTopic = {
            ...topics[topicIndex],
            ...topicData,
            updatedAt: new Date().toISOString(),
          };

          const updatedTopics = [...topics];
          updatedTopics[topicIndex] = updatedTopic;

          await updateDoc(docRef, {
            topics: updatedTopics,
            updatedAt: new Date().toISOString(),
          });

          return { data: updatedTopic };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      invalidatesTags: (result, error, { id }) =>
        result ? [{ type: 'JavaScriptTopic', id }, 'JavaScriptContent'] : [],
    }),

    // Delete a JavaScript topic
    deleteTopic: builder.mutation<boolean, string>({
      queryFn: async (id) => {
        try {
          if (!db) {
            throw new Error('Firestore not initialized');
          }

          const docRef = doc(
            db,
            JAVASCRIPT_CONTENT_COLLECTION,
            JAVASCRIPT_CONTENT_ID
          );
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            throw new Error('JavaScript content not found');
          }

          const data = docSnap.data();
          const topics: Topic[] = data.topics || [];
          const filteredTopics = topics.filter((topic) => topic.id !== id);

          if (topics.length === filteredTopics.length) {
            throw new Error('Topic not found');
          }

          await updateDoc(docRef, {
            topics: filteredTopics,
            updatedAt: new Date().toISOString(),
          });

          return { data: true };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      invalidatesTags: ['JavaScriptContent'],
    }),
  }),
});

export const {
  useGetJavascriptContentQuery,
  useGetAllTopicsQuery,
  useGetTopicByIdQuery,
  useGetTopicBySlugQuery,
  useGetTopicsByDifficultyQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} = javascriptApi;
