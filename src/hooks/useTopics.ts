import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

import { db } from '@/firebase/config';

import { Topic } from '../types/content';

export const addTopic = async (topic: Omit<Topic, 'id'>) => {
  try {
    if (!db) return;
    const docRef = doc(db, 'topics', topic.slug);
    await setDoc(docRef, {
      ...topic,
      id: topic.slug,
    });
    return true;
  } catch (error) {
    console.error('Error adding topic:', error);
    return false;
  }
};

export const useTopics = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        if (!db) return;
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

    fetchTopics();
  }, []);

  const addTopic = async (topic: Omit<Topic, 'id'>) => {
    try {
      if (!db) return;
      await setDoc(doc(db, 'topics', topic.slug), {
        ...topic,
        id: topic.slug,
      });
      return true;
    } catch (error) {
      console.error('Error adding topic:', error);
      return false;
    }
  };

  return {
    topics,
    loading,
    addTopic,
  };
};
