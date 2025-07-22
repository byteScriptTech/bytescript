import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';

export interface DSATopic {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'data-structures' | 'algorithms';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  content?: string; // Can be markdown or HTML
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const DSA_TOPICS_COLLECTION = 'dsa-topics';

export const dsaService = {
  // Get all DSA topics
  async getAllTopics(): Promise<DSATopic[]> {
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

  // Create or update a DSA topic
  async saveTopic(
    topic: Omit<DSATopic, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) {
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
