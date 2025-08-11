import { doc, getDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';
import type { LanguageContent } from '@/types/content';

const JAVASCRIPT_CONTENT_COLLECTION = 'languages';
const JAVASCRIPT_CONTENT_ID = 'javascript';

/**
 * Fetches JavaScript language content from Firestore
 */
export const getJavascriptContent =
  async (): Promise<LanguageContent | null> => {
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
  // Get all JavaScript topics
  getTopics: async () => {
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
      return [];
    }
  },

  // Get a single JavaScript topic by ID
  getTopicById: async (topicId: string) => {
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
      return null;
    }
  },

  // Get JavaScript topics by difficulty
  getTopicsByDifficulty: async (
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ) => {
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
      return [];
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
      return null;
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
      return [];
    }
  },
};
