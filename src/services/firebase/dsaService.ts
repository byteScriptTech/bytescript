import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
} from 'firebase/firestore';

import { db } from '@/firebase/config';

export interface DSATopic {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'data-structures' | 'algorithms';
  subcategory?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  content?: string; // Can be markdown or HTML
  timeComplexity?: string;
  spaceComplexity?: string;
  tags?: string[];
  prerequisites?: string[];
  operations?: Array<{
    name: string;
    description: string;
    timeComplexity: string;
    spaceComplexity: string;
  }>;
  useCases?: string[];
  resources?: Array<{
    title: string;
    url: string;
    type: 'article' | 'video' | 'interactive' | 'other';
  }>;
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  status?: 'active' | 'deleted' | 'draft';
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  deletedAt?: string | Date | Timestamp;
  lastUpdated?: Date | Timestamp;
}

const DSA_TOPICS_COLLECTION = 'dsa-topics';

export const dsaService = {
  // Get all DSA topics
  async getAllTopics(): Promise<DSATopic[]> {
    if (!db) {
      if (typeof window === 'undefined') {
        console.warn(
          'Firebase not initialized during build, returning empty topics array'
        );
        return [];
      }
      throw new Error('Firebase is not initialized');
    }
    const querySnapshot = await getDocs(collection(db, DSA_TOPICS_COLLECTION));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as DSATopic[];
  },

  // Get a single DSA topic by slug
  async getTopicBySlug(slug: string): Promise<DSATopic | null> {
    if (!db) {
      // During build time, return null to prevent build failure
      if (typeof window === 'undefined') {
        console.warn(
          'Firebase not initialized during build, returning null for topic'
        );
        return null;
      }
      throw new Error('Firebase is not initialized');
    }
    const querySnapshot = await getDocs(collection(db, DSA_TOPICS_COLLECTION));

    const topic = querySnapshot.docs.find((doc) => doc.data().slug === slug);

    if (!topic) return null;

    return {
      id: topic.id,
      ...topic.data(),
      createdAt: topic.data().createdAt?.toDate(),
      updatedAt: topic.data().updatedAt?.toDate(),
    } as DSATopic;
  },

  // Get a single DSA topic by ID
  async getTopicById(id: string): Promise<DSATopic | null> {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }
    const docRef = doc(db, DSA_TOPICS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate(),
    } as DSATopic;
  },

  // Create or update a DSA topic
  async saveTopic(
    topic: Omit<DSATopic, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }
    const now = new Date();
    const topicRef = id
      ? doc(db, DSA_TOPICS_COLLECTION, id)
      : doc(collection(db, DSA_TOPICS_COLLECTION));

    await setDoc(
      topicRef,
      {
        ...topic,
        updatedAt: now,
        ...(id ? {} : { createdAt: now }),
      },
      { merge: true }
    );

    return topicRef.id;
  },

  // Update an existing DSA topic
  async updateTopic(
    id: string,
    updates: Partial<Omit<DSATopic, 'id' | 'createdAt'>>
  ): Promise<void> {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }
    const docRef = doc(db, DSA_TOPICS_COLLECTION, id);
    const now = new Date();

    await setDoc(
      docRef,
      {
        ...updates,
        updatedAt: now,
      },
      { merge: true }
    );
  },

  // Initialize default DSA topics
  async initializeDefaultTopics() {
    const defaultTopics: Array<
      Omit<DSATopic, 'id' | 'createdAt' | 'updatedAt'>
    > = [
      {
        title: 'Arrays',
        slug: 'arrays',
        description: 'Learn about arrays and their operations',
        category: 'data-structures',
        difficulty: 'beginner',
      },
      {
        title: 'Linked Lists',
        slug: 'linked-lists',
        description:
          'Understand linked lists and their various implementations',
        category: 'data-structures',
        difficulty: 'intermediate',
      },
      {
        title: 'Stacks & Queues',
        slug: 'stacks-queues',
        description: 'Learn about stacks, queues, and their applications',
        category: 'data-structures',
        difficulty: 'intermediate',
      },
      // Add more default topics as needed
    ];

    for (const topic of defaultTopics) {
      await this.saveTopic(topic);
    }
  },
};
