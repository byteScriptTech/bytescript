import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore/lite';
import { debounce } from 'lodash';
import React, { createContext, useContext, useState, useEffect } from 'react';

import { db } from '../../lib/firebase';

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
interface LanguagesContextProps {
  languages: Language[];
  fetchLanguages: () => void;
  addLanguage: (name: string) => Promise<void>;
  updateLanguage: (id: string, name: string) => Promise<void>;
  deleteLanguage: (id: string) => Promise<void>;
  addUserLearningProgress: (
    userUUID: string,
    language: string,
    topics: Topic[]
  ) => Promise<void>;
  updateUserLearningProgress: (
    userUUID: string,
    language: string,
    updatedProgress: number,
    updatedTopics: Topic[]
  ) => void;
  getUserLearningProgress: (userUUID: string, language: string) => void;
  learningProgress: LearningProgress | null;
  loading: boolean;
}

const LanguagesContext = createContext<LanguagesContextProps | undefined>(
  undefined
);

export const useLanguages = () => {
  const context = useContext(LanguagesContext);
  if (!context) {
    throw new Error('useLanguages must be used within a LanguagesProvider');
  }
  return context;
};

export const LanguagesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [learningProgress, setLearningProgress] =
    useState<LearningProgress | null>(null);

  const getCachedLanguages = () => {
    const cachedData = localStorage.getItem('languages');
    return cachedData ? JSON.parse(cachedData) : null;
  };

  const saveLanguagesToLocalStorage = (languages: Language[]) => {
    localStorage.setItem('languages', JSON.stringify(languages));
  };

  const fetchLanguages = debounce(async () => {
    setLoading(true);
    const cachedLanguages = getCachedLanguages();
    if (cachedLanguages) {
      setLanguages(cachedLanguages);
      setLoading(false);
      return;
    }

    try {
      const querySnapshot = await getDocs(collection(db, 'languages'));
      const languagesList: Language[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Language[];

      saveLanguagesToLocalStorage(languagesList);
      setLanguages(languagesList);
    } catch (error) {
      console.error('Error fetching languages: ', error);
    } finally {
      setLoading(false);
    }
  }, 300);

  const addLanguage = async (name: string) => {
    try {
      await addDoc(collection(db, 'languages'), { name });
      await fetchLanguages();

      saveLanguagesToLocalStorage(languages);
    } catch (error) {
      console.error('Error adding language: ', error);
    }
  };

  const updateLanguage = async (id: string, name: string) => {
    try {
      const languageRef = doc(db, 'languages', id);
      await updateDoc(languageRef, { name });
      await fetchLanguages();

      saveLanguagesToLocalStorage(languages);
    } catch (error) {
      console.error('Error updating language: ', error);
    }
  };

  const deleteLanguage = async (id: string) => {
    try {
      const languageRef = doc(db, 'languages', id);
      await deleteDoc(languageRef);
      await fetchLanguages();
      saveLanguagesToLocalStorage(languages);
    } catch (error) {
      console.error('Error deleting language: ', error);
    }
  };
  // Add user's learning progress for a specific language
  const addUserLearningProgress = async (
    userUUID: string,
    language: string,
    topics: Topic[]
  ) => {
    const learningProgress: LearningProgress = {
      progress: 0,
      topics,
    };

    try {
      await setDoc(
        doc(db, `user_learnings/${userUUID}/languages`, language),
        learningProgress
      );
      console.log('User learning progress added for language:', language);
    } catch (error) {
      console.error('Error adding user learning progress: ', error);
    }
  };

  // Update user's learning progress for a specific language
  const updateUserLearningProgress = debounce(
    async (
      userUUID: string,
      language: string,
      updatedProgress: number,
      updatedTopics: Topic[]
    ) => {
      const languageRef = doc(
        db,
        `user_learnings/${userUUID}/languages`,
        language
      );
      try {
        await updateDoc(languageRef, {
          progress: updatedProgress,
          topics: updatedTopics,
        });
        getUserLearningProgress(userUUID, language);
        console.log('User learning progress updated for language:', language);
      } catch (error) {
        console.error('Error updating user learning progress: ', error);
      }
    }
  );
  // Get user's learning progress for a specific language
  const getUserLearningProgress = debounce(
    async (userUUID: string, language: string) => {
      const languageRef = doc(
        db,
        `user_learnings/${userUUID}/languages`,
        language
      );

      try {
        const docSnap = await getDoc(languageRef);
        const learningProgress = docSnap.data();
        if (docSnap.exists()) {
          setLearningProgress(learningProgress as LearningProgress);
        } else {
          console.log('No such document!');
          return null;
        }
      } catch (error) {
        console.error('Error getting user learning progress: ', error);
        return null;
      }
    },
    200
  );

  useEffect(() => {
    fetchLanguages();
  }, []);

  return (
    <LanguagesContext.Provider
      value={{
        languages,
        loading,
        fetchLanguages,
        addLanguage,
        updateLanguage,
        deleteLanguage,
        addUserLearningProgress,
        updateUserLearningProgress,
        getUserLearningProgress,
        learningProgress,
      }}
    >
      {children}
    </LanguagesContext.Provider>
  );
};
