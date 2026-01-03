import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
} from 'firebase/firestore';

import { db } from '@/firebase/config';

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
      if (!db) return [];
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

  // Get a single pattern by document ID
  async getPatternById(id: string): Promise<PatternData | null> {
    try {
      if (!db) return null;
      const docRef = doc(db, PATTERNS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as PatternData;
      }
      return null;
    } catch (error) {
      console.error('Error getting pattern by ID:', error);
      throw error;
    }
  },

  // Get a single pattern by slug
  async getPatternBySlug(slug: string): Promise<PatternData | null> {
    try {
      if (!db) return null;
      const patternsRef = collection(db, PATTERNS_COLLECTION);
      const q = query(patternsRef, where('slug', '==', slug));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as PatternData;
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
      if (!db) return '';
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

  // Delete a pattern by ID
  async deletePattern(id: string): Promise<void> {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }
    try {
      const docRef = doc(db, PATTERNS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting pattern:', error);
      throw error;
    }
  },

  // Seed initial patterns data
  async seedPatterns(patterns: Omit<PatternData, 'id'>[]): Promise<void> {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }
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
