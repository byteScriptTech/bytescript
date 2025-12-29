import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { db } from '@/firebase/config';

interface Language {
  id: string;
  name: string;
}

interface Topic {
  name: string;
  id: string;
  isCompleted: boolean;
}

interface LearningProgress {
  progress: number;
  topics: Topic[];
}

export const languagesApi = createApi({
  reducerPath: 'languagesApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Language', 'LearningProgress'],
  endpoints: (builder) => ({
    getLanguages: builder.query<Language[], void>({
      queryFn: async () => {
        try {
          const cachedData = localStorage.getItem('languages');
          if (cachedData) {
            return { data: JSON.parse(cachedData) };
          }

          const querySnapshot = await getDocs(collection(db, 'languages'));
          const languagesList: Language[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Language[];

          localStorage.setItem('languages', JSON.stringify(languagesList));
          return { data: languagesList };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      providesTags: ['Language'],
    }),
    addLanguage: builder.mutation<void, { name: string }>({
      queryFn: async ({ name }) => {
        try {
          await addDoc(collection(db, 'languages'), { name });
          localStorage.removeItem('languages');
          return { data: undefined };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      invalidatesTags: ['Language'],
    }),
    updateLanguage: builder.mutation<void, { id: string; name: string }>({
      queryFn: async ({ id, name }) => {
        try {
          const languageRef = doc(db, 'languages', id);
          await updateDoc(languageRef, { name });
          localStorage.removeItem('languages');
          return { data: undefined };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      invalidatesTags: ['Language'],
    }),
    deleteLanguage: builder.mutation<void, { id: string }>({
      queryFn: async ({ id }) => {
        try {
          const languageRef = doc(db, 'languages', id);
          await deleteDoc(languageRef);
          localStorage.removeItem('languages');
          return { data: undefined };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      invalidatesTags: ['Language'],
    }),
    getUserLearningProgress: builder.query<
      LearningProgress | null,
      { userUUID: string; language: string }
    >({
      queryFn: async ({ userUUID, language }) => {
        try {
          const languageRef = doc(
            db,
            `user_learnings/${userUUID}/languages`,
            language
          );
          const docSnap = await getDoc(languageRef);

          if (docSnap.exists()) {
            return { data: docSnap.data() as LearningProgress };
          } else {
            return { data: null };
          }
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      providesTags: ['LearningProgress'],
    }),
    addUserLearningProgress: builder.mutation<
      void,
      { userUUID: string; language: string; topics: Topic[] }
    >({
      queryFn: async ({ userUUID, language, topics }) => {
        try {
          const learningProgress: LearningProgress = {
            progress: 0,
            topics,
          };

          await setDoc(
            doc(db, `user_learnings/${userUUID}/languages`, language),
            learningProgress
          );
          return { data: undefined };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      invalidatesTags: ['LearningProgress'],
    }),
    updateUserLearningProgress: builder.mutation<
      void,
      {
        userUUID: string;
        language: string;
        updatedProgress: number;
        updatedTopics: Topic[];
      }
    >({
      queryFn: async ({
        userUUID,
        language,
        updatedProgress,
        updatedTopics,
      }) => {
        try {
          const languageRef = doc(
            db,
            `user_learnings/${userUUID}/languages`,
            language
          );
          await updateDoc(languageRef, {
            progress: updatedProgress,
            topics: updatedTopics,
          });
          return { data: undefined };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      invalidatesTags: ['LearningProgress'],
    }),
  }),
});

export const {
  useGetLanguagesQuery,
  useAddLanguageMutation,
  useUpdateLanguageMutation,
  useDeleteLanguageMutation,
  useGetUserLearningProgressQuery,
  useAddUserLearningProgressMutation,
  useUpdateUserLearningProgressMutation,
} = languagesApi;
