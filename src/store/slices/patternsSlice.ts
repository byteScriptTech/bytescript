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

import { db } from '../../firebase/config';

export interface Pattern {
  id: string;
  title: string;
  description: string;
  slug: string;
  readme: string;
  category?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  order?: number;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

// Transform Firestore document to Pattern
const transformDoc = (doc: any): Pattern => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt:
      data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt:
      data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as Pattern;
};

export const patternsApi = createApi({
  reducerPath: 'patternsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Pattern', 'PatternList'],
  endpoints: (builder) => ({
    // Get all patterns
    getAllPatterns: builder.query<Pattern[], void>({
      queryFn: async () => {
        if (!db) {
          return { error: { status: 500, data: 'Firebase not initialized' } };
        }

        try {
          const querySnapshot = await getDocs(collection(db!, 'patterns'));
          const patterns = querySnapshot.docs.map(transformDoc);
          return { data: patterns };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: ['PatternList'],
    }),

    // Get pattern by slug
    getPatternBySlug: builder.query<Pattern, string>({
      queryFn: async (slug) => {
        if (!db) {
          return { error: { status: 500, data: 'Firebase not initialized' } };
        }

        try {
          const querySnapshot = await getDocs(collection(db!, 'patterns'));
          const patterns = querySnapshot.docs.map(transformDoc);
          const pattern = patterns.find((p) => p.slug === slug);

          if (!pattern) {
            return { error: { status: 404, data: 'Pattern not found' } };
          }

          return { data: pattern };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: (result, error, slug) =>
        result ? [{ type: 'Pattern', id: slug }] : [],
    }),

    // Get pattern by ID
    getPatternById: builder.query<Pattern, string>({
      queryFn: async (id) => {
        if (!db) {
          return { error: { status: 500, data: 'Firebase not initialized' } };
        }

        try {
          const docRef = doc(db!, 'patterns', id);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            return { error: { status: 404, data: 'Pattern not found' } };
          }

          return { data: transformDoc(docSnap) };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: (result, error, id) =>
        result ? [{ type: 'Pattern', id }] : [],
    }),

    // Get patterns by category
    getPatternsByCategory: builder.query<Pattern[], string>({
      queryFn: async (category) => {
        if (!db) {
          return { error: { status: 500, data: 'Firebase not initialized' } };
        }

        try {
          const querySnapshot = await getDocs(collection(db!, 'patterns'));
          const patterns = querySnapshot.docs
            .map(transformDoc)
            .filter((pattern) => {
              if (Array.isArray(pattern.category)) {
                return pattern.category.includes(category);
              }
              return pattern.category === category;
            });
          return { data: patterns };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      providesTags: ['PatternList'],
    }),

    // Create new pattern (admin only)
    createPattern: builder.mutation<
      Pattern,
      Omit<Pattern, 'id' | 'createdAt' | 'updatedAt'>
    >({
      queryFn: async (patternData) => {
        if (!db) {
          return { error: { status: 500, data: 'Firebase not initialized' } };
        }

        try {
          const docRef = doc(collection(db!, 'patterns'));
          const newPattern = {
            ...patternData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          };

          await setDoc(docRef, newPattern);
          const createdPattern = {
            id: docRef.id,
            ...newPattern,
            createdAt: newPattern.createdAt.toDate().toISOString(),
            updatedAt: newPattern.updatedAt.toDate().toISOString(),
          } as Pattern;

          return { data: createdPattern };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      invalidatesTags: ['PatternList'],
    }),

    // Update pattern (admin only)
    updatePattern: builder.mutation<
      Pattern,
      { id: string; updates: Partial<Pattern> }
    >({
      queryFn: async ({ id, updates }) => {
        if (!db) {
          return { error: { status: 500, data: 'Firebase not initialized' } };
        }

        try {
          const docRef = doc(db!, 'patterns', id);
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
        'PatternList',
        { type: 'Pattern', id },
      ],
    }),

    // Delete pattern (admin only)
    deletePattern: builder.mutation<void, string>({
      queryFn: async (id) => {
        if (!db) {
          return { error: { status: 500, data: 'Firebase not initialized' } };
        }

        try {
          const docRef = doc(db!, 'patterns', id);
          await deleteDoc(docRef);
          return { data: undefined };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      invalidatesTags: ['PatternList'],
    }),
  }),
});

// Export hooks
export const {
  useGetAllPatternsQuery,
  useGetPatternBySlugQuery,
  useGetPatternByIdQuery,
  useGetPatternsByCategoryQuery,
  useCreatePatternMutation,
  useUpdatePatternMutation,
  useDeletePatternMutation,
} = patternsApi;
