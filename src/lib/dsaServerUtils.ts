import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

import { db } from '@/firebase/config';
import type { DSATopic } from '@/types/dsa';

// Transform Firestore document to DSATopic (same as Redux slice)
const transformDoc = (doc: any): DSATopic => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt:
      data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt:
      data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as DSATopic;
};

// Server-side DSA utilities that mirror Redux logic
export const dsaServerUtils = {
  async getTopicBySlug(slug: string): Promise<DSATopic | null> {
    try {
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const querySnapshot = await getDocs(collection(db, 'dsa-topics'));
      const topics = querySnapshot.docs.map(transformDoc);
      const topic = topics.find((t) => t.slug === slug);

      if (!topic) {
        return null;
      }

      return topic;
    } catch (error) {
      console.error('Error getting topic by slug:', error);
      return null;
    }
  },

  async getTopicById(id: string): Promise<DSATopic | null> {
    try {
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const docRef = doc(db, 'dsa-topics', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return transformDoc(docSnap);
    } catch (error) {
      console.error('Error getting topic by id:', error);
      return null;
    }
  },

  async getAllTopics(): Promise<DSATopic[]> {
    try {
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const querySnapshot = await getDocs(collection(db, 'dsa-topics'));
      const topics = querySnapshot.docs.map(transformDoc);
      return topics;
    } catch (error) {
      console.error('Error getting all topics:', error);
      return [];
    }
  },
};
