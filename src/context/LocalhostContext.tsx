import React, { createContext, ReactNode, useContext } from 'react';

interface LocalStorageContextType {
  setItem: (key: string, value: any) => void;
  getItem: (key: string) => any | null;
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
  const setItem = (key: string, value: any) => {
    const serializedValue =
      typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  };

  const getItem = (key: string) => {
    const storedValue = localStorage.getItem(key);
    try {
      return storedValue ? JSON.parse(storedValue) : null;
    } catch (error) {
      return storedValue;
    }
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
