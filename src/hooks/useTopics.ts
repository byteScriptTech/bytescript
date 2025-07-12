import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';

import { db } from '../config/firebase';
import { Topic } from '../types/topic';

export const useTopics = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTopics = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'topics'));
      const topicsData = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Topic
      );
      setTopics(topicsData);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return {
    topics,
    loading,
  };
};
