import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

import { db } from '@/firebase/config';
import { PracticeTopic } from '@/types/practice';

export const practiceTopicsService = {
  // Get all practice topics
  async getAllTopics() {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }
    const q = query(collection(db, 'practice_topics'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PracticeTopic[];
  },

  // Get topics by category
  async getTopicsByCategory(category: string) {
    if (!db) return;
    const q = query(
      collection(db, 'practice_topics'),
      where('category', '==', category)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PracticeTopic[];
  },

  // Get a single topic by ID
  async getTopicById(id: string) {
    if (!db) return;
    const topicDoc = await getDoc(doc(db, 'practice_topics', id));
    if (!topicDoc.exists()) {
      throw new Error('Topic not found');
    }
    return { id: topicDoc.id, ...topicDoc.data() } as PracticeTopic;
  },

  // Create a new practice topic
  async createTopic(
    topic: Omit<PracticeTopic, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    if (!db) return;
    const now = new Date();
    const newTopic = {
      ...topic,
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await addDoc(collection(db, 'practice_topics'), newTopic);
    return { id: docRef.id, ...newTopic } as PracticeTopic;
  },

  // Update a practice topic
  async updateTopic(id: string, updates: Partial<PracticeTopic>) {
    if (!db) return;
    const now = new Date();
    const topicRef = doc(db, 'practice_topics', id);
    await updateDoc(topicRef, {
      ...updates,
      updatedAt: now,
    });
    return this.getTopicById(id);
  },

  // Delete a practice topic
  async deleteTopic(id: string) {
    if (!db) return;
    await deleteDoc(doc(db, 'practice_topics', id));
  },

  // Get all categories
  async getCategories() {
    if (!db) return;
    const topics = await this.getAllTopics();
    const categories = new Set(topics.map((topic) => topic.category));
    return Array.from(categories);
  },
};
