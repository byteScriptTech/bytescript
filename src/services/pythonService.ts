import { doc, getDoc } from 'firebase/firestore';

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
