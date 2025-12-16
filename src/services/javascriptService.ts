import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';
import type { LanguageContent, Topic } from '@/types/content';

const JAVASCRIPT_CONTENT_COLLECTION = 'languages';
const JAVASCRIPT_CONTENT_ID = 'javascript';

/**
 * Fetches JavaScript language content from Firestore
 */
export const getJavascriptContent =
  async (): Promise<LanguageContent | null> => {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }
    try {
      const docRef = doc(
        db,
        JAVASCRIPT_CONTENT_COLLECTION,
        JAVASCRIPT_CONTENT_ID
      );
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as LanguageContent) : null;
    } catch (error) {
      console.error('Error fetching JavaScript content:', error);
      throw error;
    }
  };

export const javascriptService = {
  // Create a new JavaScript topic
  async createTopic(topicData: Omit<Topic, 'id'>) {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }
    try {
      const docRef = doc(
        db,
        JAVASCRIPT_CONTENT_COLLECTION,
        JAVASCRIPT_CONTENT_ID
      );
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('JavaScript content not found');
      }

      const data = docSnap.data();
      const topics: Topic[] = data.topics || [];
      const newTopic = {
        ...topicData,
        id: Date.now().toString(), // Simple ID generation
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(docRef, {
        topics: [...topics, newTopic],
        updatedAt: new Date().toISOString(),
      });

      return newTopic;
    } catch (error) {
      console.error('Error creating JavaScript topic:', error);
      throw error;
    }
  },

  // Update an existing JavaScript topic
  async updateTopic(id: string, topicData: Partial<Omit<Topic, 'id'>>) {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }
    try {
      const docRef = doc(
        db,
        JAVASCRIPT_CONTENT_COLLECTION,
        JAVASCRIPT_CONTENT_ID
      );
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('JavaScript content not found');
      }

      const data = docSnap.data();
      const topics: Topic[] = data.topics || [];
      const topicIndex = topics.findIndex((topic) => topic.id === id);

      if (topicIndex === -1) {
        throw new Error('Topic not found');
      }

      const updatedTopic = {
        ...topics[topicIndex],
        ...topicData,
        updatedAt: new Date().toISOString(),
      };

      const updatedTopics = [...topics];
      updatedTopics[topicIndex] = updatedTopic;

      await updateDoc(docRef, {
        topics: updatedTopics,
        updatedAt: new Date().toISOString(),
      });

      return updatedTopic;
    } catch (error) {
      console.error('Error updating JavaScript topic:', error);
      throw error;
    }
  },

  // Delete a JavaScript topic
  async deleteTopic(id: string) {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }
    try {
      const docRef = doc(
        db,
        JAVASCRIPT_CONTENT_COLLECTION,
        JAVASCRIPT_CONTENT_ID
      );
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('JavaScript content not found');
      }

      const data = docSnap.data();
      const topics: Topic[] = data.topics || [];
      const filteredTopics = topics.filter((topic) => topic.id !== id);

      if (topics.length === filteredTopics.length) {
        throw new Error('Topic not found');
      }

      await updateDoc(docRef, {
        topics: filteredTopics,
        updatedAt: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Error deleting JavaScript topic:', error);
      throw error;
    }
  },

  // Get all JavaScript topics
  getTopics: async () => {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }
    try {
      const docRef = doc(
        db,
        JAVASCRIPT_CONTENT_COLLECTION,
        JAVASCRIPT_CONTENT_ID
      );
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.error('JavaScript content not found');
        return [];
      }
      return (docSnap.data() as LanguageContent).topics || [];
    } catch (error) {
      console.error('Error getting JavaScript topics:', error);
      throw error;
    }
  },

  // Get a single JavaScript topic by ID
  getTopicById: async (topicId: string) => {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }
    try {
      const docRef = doc(
        db,
        JAVASCRIPT_CONTENT_COLLECTION,
        JAVASCRIPT_CONTENT_ID
      );
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.error('JavaScript content not found');
        return null;
      }
      const content = docSnap.data() as LanguageContent;
      return content.topics?.find((topic) => topic.id === topicId) || null;
    } catch (error) {
      console.error('Error getting JavaScript topic:', error);
      throw error;
    }
  },

  // Get JavaScript topics by difficulty
  getTopicsByDifficulty: async (
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ) => {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }
    try {
      const docRef = doc(
        db,
        JAVASCRIPT_CONTENT_COLLECTION,
        JAVASCRIPT_CONTENT_ID
      );
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.error('JavaScript content not found');
        return [];
      }
      const content = docSnap.data() as LanguageContent;
      return (
        content.topics?.filter((topic) => topic.difficulty === difficulty) || []
      );
    } catch (error) {
      console.error('Error getting JavaScript topics by difficulty:', error);
      throw error;
    }
  },

  // Get JavaScript topic by slug
  getTopicBySlug: async (slug: string) => {
    try {
      const content = await getJavascriptContent();
      if (!content || !content.topics) return null;
      return content.topics.find((topic) => topic.slug === slug) || null;
    } catch (error) {
      console.error('Error getting JavaScript topic by slug:', error);
      throw error;
    }
  },

  // Get all JavaScript topics with basic information
  getAllTopics: async () => {
    try {
      const content = await getJavascriptContent();
      if (!content || !content.topics) return [];
      return content.topics.map(
        ({ id, name, description, slug, difficulty }) => ({
          id,
          name,
          description,
          slug,
          difficulty,
        })
      );
    } catch (error) {
      console.error('Error fetching JavaScript topics:', error);
      throw error;
    }
  },
};
