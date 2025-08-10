import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';
import type { Challenge, LanguageContent, Topic } from '@/types/content';

const PYTHON_CONTENT_COLLECTION = 'languages';
const PYTHON_CONTENT_ID = 'python';

/**
 * Fetches Python language content from Firestore
 */
export const getPythonContent = async (): Promise<LanguageContent | null> => {
  try {
    const docRef = doc(db, PYTHON_CONTENT_COLLECTION, PYTHON_CONTENT_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as LanguageContent;
    }

    console.warn('No Python content found');
    return null;
  } catch (error) {
    console.error('Error fetching Python content:', error);
    throw error;
  }
};

export const pythonService = {
  async getAllTopics() {
    try {
      const docRef = doc(db, PYTHON_CONTENT_COLLECTION, PYTHON_CONTENT_ID);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.error('Python content not found');
        return [];
      }

      const data = docSnap.data();
      // Return the topics array or empty array if it doesn't exist
      return data.topics || [];
    } catch (error) {
      console.error('Error getting Python topics:', error);
      throw error;
    }
  },

  // Get a single Python topic by ID
  async getTopicById(id: string) {
    try {
      const docRef = doc(db, PYTHON_CONTENT_COLLECTION, PYTHON_CONTENT_ID);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.error('Python content not found');
        return null;
      }

      const data = docSnap.data();
      const topics: Topic[] = data.topics || [];
      return topics.find((topic) => topic.id === id) || null;
    } catch (error) {
      console.error('Error getting Python topic:', error);
      throw error;
    }
  },

  // Create a new Python topic
  async createTopic(topicData: Omit<Topic, 'id'>) {
    try {
      const docRef = doc(db, PYTHON_CONTENT_COLLECTION, PYTHON_CONTENT_ID);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Python content not found');
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
      console.error('Error creating Python topic:', error);
      throw error;
    }
  },

  // Update an existing Python topic
  async updateTopic(id: string, topicData: Partial<Omit<Topic, 'id'>>) {
    try {
      const docRef = doc(db, PYTHON_CONTENT_COLLECTION, PYTHON_CONTENT_ID);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Python content not found');
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
      console.error('Error updating Python topic:', error);
      throw error;
    }
  },

  // Delete a Python topic
  async deleteTopic(id: string) {
    try {
      const docRef = doc(db, PYTHON_CONTENT_COLLECTION, PYTHON_CONTENT_ID);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Python content not found');
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
      console.error('Error deleting Python topic:', error);
      throw error;
    }
  },

  // Get Python topics by difficulty
  async getTopicsByDifficulty(difficulty: string) {
    try {
      const docRef = doc(db, PYTHON_CONTENT_COLLECTION, PYTHON_CONTENT_ID);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.error('Python content not found');
        return [];
      }

      const data = docSnap.data();
      const topics: Topic[] = data.topics || [];
      return topics.filter((topic) => topic.difficulty === difficulty);
    } catch (error) {
      console.error('Error getting Python topics by difficulty:', error);
      throw error;
    }
  },
};

/**
 * Fetches a specific topic by its slug
 */
export const getPythonTopicBySlug = async (
  slug: string
): Promise<Topic | undefined> => {
  try {
    const content = await getPythonContent();
    if (!content) return undefined;

    return content.topics.find((topic: Topic) => topic.slug === slug);
  } catch (error) {
    console.error(`Error fetching topic with slug ${slug}:`, error);
    throw error;
  }
};

/**
 * Fetches a specific challenge by its ID
 */
export const getPythonChallengeById = async (
  challengeId: string
): Promise<Challenge | undefined> => {
  try {
    const content = await getPythonContent();
    if (!content) return undefined;

    // Search through all topics and their challenges
    for (const topic of content.topics) {
      if (topic.challenges) {
        const challenge = topic.challenges.find(
          (c: { id: string }) => c.id === challengeId
        );
        if (challenge) return challenge;
      }
    }

    console.warn(`No challenge found with ID: ${challengeId}`);
    return undefined;
  } catch (error) {
    console.error(`Error fetching challenge with ID ${challengeId}:`, error);
    throw error;
  }
};

/**
 * Fetches all Python topics with basic information
 */
export const getAllPythonTopics = async (): Promise<
  Array<{ id: string; name: string; slug: string; description?: string }>
> => {
  try {
    const content = await getPythonContent();
    if (!content) return [];

    return content.topics.map((topic) => ({
      id: topic.id,
      name: topic.name,
      slug: topic.slug,
      description: topic.description,
    }));
  } catch (error) {
    console.error('Error fetching Python topics:', error);
    throw error;
  }
};

/**
 * Fetches all challenges for a specific topic
 */
export const getChallengesByTopicSlug = async (
  topicSlug: string
): Promise<Challenge[]> => {
  try {
    const topic = await getPythonTopicBySlug(topicSlug);
    if (!topic || !topic.challenges) return [];

    return topic.challenges;
  } catch (error) {
    console.error(`Error fetching challenges for topic ${topicSlug}:`, error);
    throw error;
  }
};
