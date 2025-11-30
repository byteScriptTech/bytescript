import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';
import type { LanguageContent, Topic } from '@/types/content';

const NODEJS_CONTENT_COLLECTION = 'content';
const NODEJS_CONTENT_ID = 'nodejs';

export const getNodejsContent = async (): Promise<LanguageContent | null> => {
  try {
    const docRef = doc(db, NODEJS_CONTENT_COLLECTION, NODEJS_CONTENT_ID);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as LanguageContent) : null;
  } catch (error) {
    console.error('Error fetching Node.js content:', error);
    throw error;
  }
};

export const nodejsService = {
  // Create a new Node.js topic
  async createTopic(topicData: Omit<Topic, 'id'>) {
    try {
      const docRef = doc(db, NODEJS_CONTENT_COLLECTION, NODEJS_CONTENT_ID);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Node.js content not found');
      }

      const data = docSnap.data();
      const topics: Topic[] = data.topics || [];
      const newTopic = {
        ...topicData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(docRef, {
        topics: [...topics, newTopic],
        updatedAt: new Date().toISOString(),
      });

      return newTopic;
    } catch (error) {
      console.error('Error creating Node.js topic:', error);
      throw error;
    }
  },

  // Update an existing Node.js topic
  async updateTopic(id: string, topicData: Partial<Omit<Topic, 'id'>>) {
    try {
      const docRef = doc(db, NODEJS_CONTENT_COLLECTION, NODEJS_CONTENT_ID);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Node.js content not found');
      }

      const data = docSnap.data();
      const topics: Topic[] = data.topics || [];
      const topicIndex = topics.findIndex((t) => t.id === id);

      if (topicIndex === -1) {
        throw new Error('Topic not found');
      }

      const updatedTopic = {
        ...topics[topicIndex],
        ...topicData,
        updatedAt: new Date().toISOString(),
      };

      topics[topicIndex] = updatedTopic;

      await updateDoc(docRef, {
        topics,
        updatedAt: new Date().toISOString(),
      });

      return updatedTopic;
    } catch (error) {
      console.error('Error updating Node.js topic:', error);
      throw error;
    }
  },

  // Delete a Node.js topic
  async deleteTopic(id: string) {
    try {
      const docRef = doc(db, NODEJS_CONTENT_COLLECTION, NODEJS_CONTENT_ID);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Node.js content not found');
      }

      const data = docSnap.data();
      const topics: Topic[] = data.topics || [];
      const updatedTopics = topics.filter((t) => t.id !== id);

      if (topics.length === updatedTopics.length) {
        throw new Error('Topic not found');
      }

      await updateDoc(docRef, {
        topics: updatedTopics,
        updatedAt: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Error deleting Node.js topic:', error);
      throw error;
    }
  },

  // Get all Node.js topics
  async getTopics() {
    try {
      const content = await getNodejsContent();
      if (!content || !content.topics) {
        return [];
      }
      return content.topics as Topic[];
    } catch (error) {
      console.error('Error getting Node.js topics:', error);
      throw error;
    }
  },

  // Get a single Node.js topic by ID
  async getTopicById(topicId: string) {
    try {
      const content = await getNodejsContent();
      if (!content || !content.topics) return null;
      return content.topics.find((t) => t.id === topicId) || null;
    } catch (error) {
      console.error('Error getting Node.js topic by ID:', error);
      throw error;
    }
  },

  // Get all topics with basic information
  async getAllTopics() {
    try {
      const content = await getNodejsContent();
      if (!content || !content.topics) return [];
      return content.topics.map(
        ({ id, name, slug, description, difficulty }) => ({
          id,
          name,
          slug,
          description,
          difficulty,
        })
      );
    } catch (error) {
      console.error('Error getting all Node.js topics:', error);
      throw error;
    }
  },
};
