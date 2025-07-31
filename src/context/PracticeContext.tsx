import React, { createContext, useContext, useEffect, useState } from 'react';

import { practiceTopicsService } from '@/services/firebase/practiceTopicsService';
import { PracticeTopic } from '@/types/practice';

interface PracticeContextType {
  topics: PracticeTopic[];
  loading: boolean;
  error: string | null;
  fetchTopics: () => Promise<void>;
  fetchTopicsByCategory: (category: string) => Promise<PracticeTopic[]>;
  getTopic: (id: string) => Promise<PracticeTopic | undefined>;
}

const PracticeContext = createContext<PracticeContextType | undefined>(
  undefined
);

export const PracticeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [topics, setTopics] = useState<PracticeTopic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const data = await practiceTopicsService.getAllTopics();
      // Sort topics by order
      const sortedTopics = [...data].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );
      setTopics(sortedTopics);
      setError(null);
    } catch (err) {
      console.error('Error fetching practice topics:', err);
      setError('Failed to load practice topics');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopicsByCategory = async (category: string) => {
    try {
      const data = await practiceTopicsService.getTopicsByCategory(category);
      // Sort topics by order
      return [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (err) {
      console.error(`Error fetching ${category} practice topics:`, err);
      setError(`Failed to load ${category} practice topics`);
      return [];
    }
  };

  const getTopic = async (id: string): Promise<PracticeTopic | undefined> => {
    try {
      return await practiceTopicsService.getTopicById(id);
    } catch (err) {
      console.error(`Error fetching topic ${id}:`, err);
      setError('Failed to load topic');
      return undefined;
    }
  };

  // Fetch all topics on initial load
  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <PracticeContext.Provider
      value={{
        topics,
        loading,
        error,
        fetchTopics,
        fetchTopicsByCategory,
        getTopic,
      }}
    >
      {children}
    </PracticeContext.Provider>
  );
};

export const usePractice = () => {
  const context = useContext(PracticeContext);
  if (context === undefined) {
    throw new Error('usePractice must be used within a PracticeProvider');
  }
  return context;
};
