import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';
import type { LanguageContent, Topic } from '@/types/content';

const NODEJS_CONTENT_COLLECTION = 'content';
const NODEJS_CONTENT_ID = 'nodejs';

export const nodejsApi = createApi({
  reducerPath: 'nodejsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['NodejsContent', 'NodejsTopic'],
  endpoints: (builder) => ({
    // Get Node.js content
    getNodejsContent: builder.query<LanguageContent | null, void>({
      queryFn: async (): Promise<
        | { data: LanguageContent | null }
        | { error: { status: number; data: string } }
      > => {
        try {
          if (!db) {
            throw new Error('Firebase Firestore is not initialized');
          }
          const docRef = doc(db, NODEJS_CONTENT_COLLECTION, NODEJS_CONTENT_ID);
          const docSnap = await getDoc(docRef);
          return {
            data: docSnap.exists() ? (docSnap.data() as LanguageContent) : null,
          };
        } catch (error) {
          console.error('Error fetching Node.js content:', error);
          return {
            error: {
              status: 500,
              data:
                error instanceof Error
                  ? error.message
                  : 'Failed to fetch Node.js content',
            },
          };
        }
      },
      providesTags: ['NodejsContent'],
    }),

    // Get all Node.js topics
    getTopics: builder.query<Topic[], void>({
      queryFn: async (
        _,
        { dispatch }
      ): Promise<
        { data: Topic[] } | { error: { status: number; data: string } }
      > => {
        try {
          const result = await dispatch(
            nodejsApi.endpoints.getNodejsContent.initiate()
          );
          const content = result.data;
          if (!content || !content.topics) {
            return { data: [] };
          }
          return { data: content.topics as Topic[] };
        } catch (error) {
          console.error('Error getting Node.js topics:', error);
          return {
            error: {
              status: 500,
              data:
                error instanceof Error
                  ? error.message
                  : 'Failed to fetch topics',
            },
          };
        }
      },
      providesTags: ['NodejsContent'],
    }),

    // Get a single Node.js topic by ID
    getTopicById: builder.query<Topic | null, string>({
      queryFn: async (
        topicId,
        { dispatch }
      ): Promise<
        { data: Topic | null } | { error: { status: number; data: string } }
      > => {
        try {
          const result = await dispatch(
            nodejsApi.endpoints.getNodejsContent.initiate()
          );
          const content = result.data;
          if (!content || !content.topics) {
            return { data: null };
          }
          const topic =
            content.topics.find((t: Topic) => t.id === topicId) || null;
          return { data: topic };
        } catch (error) {
          console.error('Error getting Node.js topic by ID:', error);
          return {
            error: {
              status: 500,
              data:
                error instanceof Error
                  ? error.message
                  : 'Failed to fetch topic',
            },
          };
        }
      },
      providesTags: ['NodejsContent'],
    }),

    // Get all topics with basic information
    getAllTopics: builder.query<
      Pick<Topic, 'id' | 'name' | 'slug' | 'description' | 'difficulty'>[],
      void
    >({
      queryFn: async (
        _,
        { dispatch }
      ): Promise<
        | {
            data: Pick<
              Topic,
              'id' | 'name' | 'slug' | 'description' | 'difficulty'
            >[];
          }
        | { error: { status: number; data: string } }
      > => {
        try {
          const result = await dispatch(
            nodejsApi.endpoints.getNodejsContent.initiate()
          );
          const content = result.data;
          if (!content || !content.topics) {
            return { data: [] };
          }
          const basicTopics = content.topics.map(
            ({ id, name, slug, description, difficulty }: Topic) => ({
              id,
              name,
              slug,
              description,
              difficulty,
            })
          );
          return { data: basicTopics };
        } catch (error) {
          console.error('Error getting all Node.js topics:', error);
          return {
            error: {
              status: 500,
              data:
                error instanceof Error
                  ? error.message
                  : 'Failed to fetch topics',
            },
          };
        }
      },
      providesTags: ['NodejsContent'],
    }),

    // Create a new Node.js topic
    createTopic: builder.mutation<Topic, Omit<Topic, 'id'>>({
      queryFn: async (
        topicData
      ): Promise<
        { data: Topic } | { error: { status: number; data: string } }
      > => {
        try {
          if (!db) {
            throw new Error('Firebase Firestore is not initialized');
          }
          const docRef = doc(db, NODEJS_CONTENT_COLLECTION, NODEJS_CONTENT_ID);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            throw new Error('Node.js content not found');
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
          console.error('Error creating Node.js topic:', error);
          return {
            error: {
              status: 500,
              data:
                error instanceof Error
                  ? error.message
                  : 'Failed to create topic',
            },
          };
        }
      },
      invalidatesTags: ['NodejsContent'],
    }),

    // Update an existing Node.js topic
    updateTopic: builder.mutation<
      Topic,
      { id: string; topicData: Partial<Omit<Topic, 'id'>> }
    >({
      queryFn: async ({
        id,
        topicData,
      }): Promise<
        { data: Topic } | { error: { status: number; data: string } }
      > => {
        try {
          if (!db) {
            throw new Error('Firebase Firestore is not initialized');
          }
          const docRef = doc(db, NODEJS_CONTENT_COLLECTION, NODEJS_CONTENT_ID);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            throw new Error('Node.js content not found');
          }

          const data = docSnap.data();
          const topics: Topic[] = data.topics || [];
          const topicIndex = topics.findIndex((t: Topic) => t.id === id);

          if (topicIndex === -1) {
            throw new Error('Topic not found');
          }

          const updatedTopic = {
            ...topics[topicIndex],
            ...topicData,
            updatedAt: new Date().toISOString(),
          };

          topics[topicIndex] = updatedTopic;

          await updateDoc(docRef, {
            topics,
            updatedAt: new Date().toISOString(),
          });

          return { data: updatedTopic };
        } catch (error) {
          console.error('Error updating Node.js topic:', error);
          return {
            error: {
              status: 500,
              data:
                error instanceof Error
                  ? error.message
                  : 'Failed to update topic',
            },
          };
        }
      },
      invalidatesTags: ['NodejsContent'],
    }),

    // Delete a Node.js topic
    deleteTopic: builder.mutation<boolean, string>({
      queryFn: async (
        id
      ): Promise<
        { data: boolean } | { error: { status: number; data: string } }
      > => {
        try {
          if (!db) {
            throw new Error('Firebase Firestore is not initialized');
          }
          const docRef = doc(db, NODEJS_CONTENT_COLLECTION, NODEJS_CONTENT_ID);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            throw new Error('Node.js content not found');
          }

          const data = docSnap.data();
          const topics: Topic[] = data.topics || [];
          const updatedTopics = topics.filter((t: Topic) => t.id !== id);

          if (topics.length === updatedTopics.length) {
            throw new Error('Topic not found');
          }

          await updateDoc(docRef, {
            topics: updatedTopics,
            updatedAt: new Date().toISOString(),
          });

          return { data: true };
        } catch (error) {
          console.error('Error deleting Node.js topic:', error);
          return {
            error: {
              status: 500,
              data:
                error instanceof Error
                  ? error.message
                  : 'Failed to delete topic',
            },
          };
        }
      },
      invalidatesTags: ['NodejsContent'],
    }),
  }),
});

export const {
  useGetNodejsContentQuery,
  useGetTopicsQuery,
  useGetTopicByIdQuery,
  useGetAllTopicsQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} = nodejsApi;
