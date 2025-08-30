import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
} from 'firebase/firestore';

import { db } from '@/config/firebase';

export interface PatternData {
  id: string;
  title: string;
  slug: string;
  description: string;
  readme: string;
  category?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  order?: number;
  icon?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PATTERNS_COLLECTION = 'patterns';

export const patternService = {
  // Get all patterns
  async getPatterns(): Promise<PatternData[]> {
    try {
      const querySnapshot = await getDocs(collection(db, PATTERNS_COLLECTION));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PatternData[];
    } catch (error) {
      console.error('Error getting patterns:', error);
      throw error;
    }
  },

  // Get a single pattern by slug
  async getPatternById(slug: string): Promise<PatternData | null> {
    try {
      const patternsRef = collection(db, PATTERNS_COLLECTION);
      const q = query(patternsRef, where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot, 'this is the query snapshot');
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return { id: doc.id, ...data } as PatternData;
      }
      return null;
    } catch (error) {
      console.error('Error getting pattern by slug:', error);
      throw error;
    }
  },

  // Add or update a pattern
  async savePattern(
    pattern: Omit<PatternData, 'id'>,
    id?: string
  ): Promise<string> {
    try {
      const patternRef = id
        ? doc(db, PATTERNS_COLLECTION, id)
        : doc(collection(db, PATTERNS_COLLECTION));

      const patternData = {
        ...pattern,
        updatedAt: new Date(),
        ...(!id && { createdAt: new Date() }), // Only set on create
      };

      await setDoc(patternRef, patternData, { merge: true });
      return patternRef.id;
    } catch (error) {
      console.error('Error saving pattern:', error);
      throw error;
    }
  },

  // Seed initial patterns data
  async seedPatterns(patterns: Omit<PatternData, 'id'>[]): Promise<void> {
    try {
      const batch = [];

      for (const pattern of patterns) {
        const docRef = doc(collection(db, PATTERNS_COLLECTION));
        batch.push(
          setDoc(docRef, {
            ...pattern,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        );
      }

      await Promise.all(batch);
      console.log('Successfully seeded patterns data');
    } catch (error) {
      console.error('Error seeding patterns:', error);
      throw error;
    }
  },
};
