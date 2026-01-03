import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { Timestamp } from 'firebase/firestore';
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';

import { db } from '@/firebase/config';

export interface Note {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export type EditableNote = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
} | null;

const transformNote = (note: any): Note => ({
  ...note,
  createdAt:
    note.createdAt instanceof Timestamp
      ? note.createdAt.toDate()
      : new Date(note.createdAt),
  updatedAt:
    note.updatedAt instanceof Timestamp
      ? note.updatedAt.toDate()
      : new Date(note.updatedAt),
});

export const notesApi = createApi({
  reducerPath: 'notesApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Note'],
  endpoints: (builder) => ({
    getNotes: builder.query<Note[], string>({
      queryFn: async (userId) => {
        try {
          if (!db) {
            throw new Error('Firebase is not initialized');
          }
          const notesQuery = query(
            collection(db, 'users', userId, 'notes'),
            where('userId', '==', userId)
          );
          const querySnapshot = await getDocs(notesQuery);
          const notes = querySnapshot.docs.map((doc) =>
            transformNote({ id: doc.id, ...doc.data() })
          );
          return { data: notes };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      providesTags: ['Note'],
    }),
    createNote: builder.mutation<Note, { content: string; userId: string }>({
      queryFn: async ({ content, userId }) => {
        try {
          if (!db) {
            throw new Error('Firebase is not initialized');
          }
          const noteRef = doc(collection(db, 'users', userId, 'notes'));
          const noteData = {
            content,
            userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(noteRef, noteData);
          const newNote = transformNote({ id: noteRef.id, ...noteData });
          return { data: newNote };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      invalidatesTags: ['Note'],
    }),
    updateNote: builder.mutation<
      void,
      { userId: string; noteId: string; content: string }
    >({
      queryFn: async ({ userId, noteId, content }) => {
        try {
          if (!db) {
            throw new Error('Firebase is not initialized');
          }
          const noteRef = doc(db, 'users', userId, 'notes', noteId);
          await updateDoc(noteRef, {
            content,
            updatedAt: serverTimestamp(),
          });
          return { data: undefined };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      invalidatesTags: ['Note'],
    }),
    deleteNote: builder.mutation<void, { userId: string; noteId: string }>({
      queryFn: async ({ userId, noteId }) => {
        try {
          if (!db) {
            throw new Error('Firebase is not initialized');
          }
          const noteRef = doc(db, 'users', userId, 'notes', noteId);
          await deleteDoc(noteRef);
          return { data: undefined };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      invalidatesTags: ['Note'],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApi;
