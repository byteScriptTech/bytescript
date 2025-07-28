'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { toast } from 'sonner';

import {
  DataStructure,
  dataStructuresService,
} from '@/services/dataStructuresService';

interface DataStructuresContextType {
  dataStructures: DataStructure[];
  loading: boolean;
  error: string | null;
  fetchDataStructures: () => Promise<void>;
  createDataStructure: (
    data: Omit<DataStructure, 'id'>
  ) => Promise<DataStructure>;
  updateDataStructure: (
    id: string,
    data: Partial<Omit<DataStructure, 'id'>>
  ) => Promise<void>;
  deleteDataStructure: (id: string) => Promise<void>;
  getDataStructure: (id: string) => Promise<DataStructure | null>;
  isSlugTaken: (slug: string, excludeId?: string) => Promise<boolean>;
}

const DataStructuresContext = createContext<
  DataStructuresContextType | undefined
>(undefined);

interface DataStructuresProviderProps {
  children: ReactNode;
}

export const DataStructuresProvider: React.FC<DataStructuresProviderProps> = ({
  children,
}) => {
  const [dataStructures, setDataStructures] = useState<DataStructure[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDataStructures = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dataStructuresService.getAll();
      setDataStructures(result);
    } catch (err) {
      console.error('Failed to fetch data structures:', err);
      setError('Failed to load data structures. Please try again.');
      toast.error('Failed to load data structures');
    } finally {
      setLoading(false);
    }
  }, []);

  const createDataStructure = async (
    data: Omit<DataStructure, 'id'>
  ): Promise<DataStructure> => {
    try {
      setLoading(true);
      const newDataStructure = await dataStructuresService.create(data);
      await fetchDataStructures(); // Refresh the list
      toast.success('Data structure created successfully');
      return newDataStructure;
    } catch (err) {
      console.error('Failed to create data structure:', err);
      toast.error('Failed to create data structure');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDataStructure = async (
    id: string,
    data: Partial<Omit<DataStructure, 'id'>>
  ) => {
    try {
      setLoading(true);
      await dataStructuresService.update(id, data);
      await fetchDataStructures(); // Refresh the list
      toast.success('Data structure updated successfully');
    } catch (err) {
      console.error('Failed to update data structure:', err);
      toast.error('Failed to update data structure');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDataStructure = async (id: string) => {
    try {
      setLoading(true);
      await dataStructuresService.delete(id);
      await fetchDataStructures(); // Refresh the list
      toast.success('Data structure deleted successfully');
    } catch (err) {
      console.error('Failed to delete data structure:', err);
      toast.error('Failed to delete data structure');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDataStructure = async (
    id: string
  ): Promise<DataStructure | null> => {
    try {
      return await dataStructuresService.getById(id);
    } catch (err) {
      console.error('Failed to get data structure:', err);
      toast.error('Failed to load data structure');
      return null;
    }
  };

  const isSlugTaken = async (
    slug: string,
    excludeId?: string
  ): Promise<boolean> => {
    try {
      return await dataStructuresService.isSlugTaken(slug, excludeId);
    } catch (err) {
      console.error('Error checking slug:', err);
      return true; // Assume slug is taken to prevent duplicates
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDataStructures();
  }, [fetchDataStructures]);

  return (
    <DataStructuresContext.Provider
      value={{
        dataStructures,
        loading,
        error,
        fetchDataStructures,
        createDataStructure,
        updateDataStructure,
        deleteDataStructure,
        getDataStructure,
        isSlugTaken,
      }}
    >
      {children}
    </DataStructuresContext.Provider>
  );
};

export const useDataStructures = (): DataStructuresContextType => {
  const context = useContext(DataStructuresContext);
  if (!context) {
    throw new Error(
      'useDataStructures must be used within a DataStructuresProvider'
    );
  }
  return context;
};
