'use client';

import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

import { useAppSelector } from '@/store/hooks';
import {
  useGetLanguagesQuery,
  useAddLanguageMutation,
  useUpdateLanguageMutation,
  useDeleteLanguageMutation,
  useGetUserLearningProgressQuery,
  useAddUserLearningProgressMutation,
  useUpdateUserLearningProgressMutation,
} from '@/store/slices/languagesSlice';

interface Topic {
  name: string;
  id: string;
  isCompleted: boolean;
}

interface LearningProgress {
  progress: number;
  topics: Topic[];
}

export const useLanguagesRedux = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const { currentUser } = useAppSelector((state) => state.auth);
  const userId = currentUser?.uid;

  const {
    data: languages = [],
    isLoading: languagesLoading,
    error: languagesError,
    refetch: refetchLanguages,
  } = useGetLanguagesQuery();

  const {
    data: learningProgress,
    isLoading: progressLoading,
    error: progressError,
  } = useGetUserLearningProgressQuery(
    { userUUID: userId!, language: selectedLanguage! },
    {
      skip: !userId || !selectedLanguage,
    }
  );

  const [addLanguageMutation] = useAddLanguageMutation();
  const [updateLanguageMutation] = useUpdateLanguageMutation();
  const [deleteLanguageMutation] = useDeleteLanguageMutation();
  const [addProgressMutation] = useAddUserLearningProgressMutation();
  const [updateProgressMutation] = useUpdateUserLearningProgressMutation();

  const addLanguage = debounce(async (name: string) => {
    try {
      await addLanguageMutation({ name }).unwrap();
      refetchLanguages();
    } catch (error) {
      console.error('Error adding language:', error);
    }
  }, 300);

  const updateLanguage = debounce(async (id: string, name: string) => {
    try {
      await updateLanguageMutation({ id, name }).unwrap();
      refetchLanguages();
    } catch (error) {
      console.error('Error updating language:', error);
    }
  }, 300);

  const deleteLanguage = debounce(async (id: string) => {
    try {
      await deleteLanguageMutation({ id }).unwrap();
      refetchLanguages();
    } catch (error) {
      console.error('Error deleting language:', error);
    }
  }, 300);

  const addUserLearningProgress = async (
    userUUID: string,
    language: string,
    topics: Topic[]
  ) => {
    try {
      await addProgressMutation({ userUUID, language, topics }).unwrap();
    } catch (error) {
      console.error('Error adding user learning progress:', error);
    }
  };

  const updateUserLearningProgress = debounce(
    async (
      userUUID: string,
      language: string,
      updatedProgress: number,
      updatedTopics: Topic[]
    ) => {
      try {
        await updateProgressMutation({
          userUUID,
          language,
          updatedProgress,
          updatedTopics,
        }).unwrap();
      } catch (error) {
        console.error('Error updating user learning progress:', error);
      }
    },
    300
  );

  const getUserLearningProgress = (userUUID: string, language: string) => {
    setSelectedLanguage(language);
  };

  useEffect(() => {
    refetchLanguages();
  }, [refetchLanguages]);

  return {
    languages,
    loading: languagesLoading || progressLoading,
    error: languagesError || progressError,
    learningProgress: learningProgress || null,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    addUserLearningProgress,
    updateUserLearningProgress,
    getUserLearningProgress,
  };
};
