import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore/lite';
import { debounce } from 'lodash';
import React, { createContext, useContext, useState, useEffect } from 'react';

import { db } from '../../lib/firebase';

interface Language {
  id: string;
  name: string;
}

interface LanguagesContextProps {
  languages: Language[];
  fetchLanguages: () => void;
  addLanguage: (name: string) => Promise<void>;
  updateLanguage: (id: string, name: string) => Promise<void>;
  deleteLanguage: (id: string) => Promise<void>;
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
      }}
    >
      {children}
    </LanguagesContext.Provider>
  );
};
