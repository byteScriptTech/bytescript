import React, { createContext, ReactNode, useContext } from 'react';

interface LocalStorageContextType {
  setItem: (key: string, value: string) => void;
  getItem: (key: string) => string | null;
  removeItem: (key: string) => void;
  clear: () => void;
}

const LocalStorageContext = createContext<LocalStorageContextType | undefined>(
  undefined
);

export const useLocalStorage = () => {
  const context = useContext(LocalStorageContext);
  if (!context) {
    throw new Error(
      'useLocalStorage must be used within a LocalStorageProvider'
    );
  }
  return context;
};

export const LocalStorageProvider = ({ children }: { children: ReactNode }) => {
  const setItem = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };

  const getItem = (key: string) => {
    return localStorage.getItem(key);
  };

  const removeItem = (key: string) => {
    localStorage.removeItem(key);
  };

  const clear = () => {
    localStorage.clear();
  };

  return (
    <LocalStorageContext.Provider
      value={{ setItem, getItem, removeItem, clear }}
    >
      {children}
    </LocalStorageContext.Provider>
  );
};
