/* eslint-disable no-unused-vars */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore/lite';
import React, { createContext, useContext, useState, useEffect } from 'react';

import { db } from '../../lib/firebase';
interface Language {
  id: string;
  name: string;
}

interface LanguagesContextProps {
  languages: Language[];
  fetchLanguages: () => Promise<void>;
  addLanguage: (name: string) => Promise<void>;
  updateLanguage: (id: string, name: string) => Promise<void>;
  deleteLanguage: (id: string) => Promise<void>;
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

  const fetchLanguages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'languages'));
      const languagesList: Language[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Language[];
      setLanguages(languagesList);
    } catch (error) {
      console.error('Error fetching languages: ', error);
    }
  };

  const addLanguage = async (name: string) => {
    try {
      await addDoc(collection(db, 'languages'), { name });
      await fetchLanguages();
    } catch (error) {
      console.error('Error adding language: ', error);
    }
  };

  const updateLanguage = async (id: string, name: string) => {
    try {
      const languageRef = doc(db, 'languages', id);
      await updateDoc(languageRef, { name });
      await fetchLanguages();
    } catch (error) {
      console.error('Error updating language: ', error);
    }
  };

  const deleteLanguage = async (id: string) => {
    try {
      const languageRef = doc(db, 'languages', id);
      await deleteDoc(languageRef);
      await fetchLanguages();
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
