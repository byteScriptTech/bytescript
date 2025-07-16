import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  Firestore,
} from 'firebase/firestore';

import { db } from '../../firebase/config';

// Ensure db is of type Firestore
const firestoreDb = db as Firestore;

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  constraints: string[];
  category: string;
  tags: string[];
  solved?: boolean;
  lastAttempted?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const problemsService = {
  // Get all problems
  async getAllProblems() {
    const q = query(collection(firestoreDb, 'problems'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Problem
    );
  },

  // Get a single problem by ID
  async getProblemById(id: string) {
    const problemRef = doc(db, 'problems', id);
    const docSnap = await getDoc(problemRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Problem;
    }
    return null;
  },

  // Create a new problem
  async createProblem(
    problem: Omit<Problem, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    const now = new Date();
    const newProblem = {
      ...problem,
      createdAt: now,
      updatedAt: now,
      solved: false,
      lastAttempted: now,
    };
    const docRef = await addDoc(collection(db, 'problems'), newProblem);
    return {
      id: docRef.id,
      ...newProblem,
    } as Problem;
  },

  // Update a problem
  async updateProblem(id: string, updates: Partial<Problem>) {
    const problemRef = doc(db, 'problems', id);
    await updateDoc(problemRef, {
      ...updates,
      updatedAt: new Date(),
    });
    return this.getProblemById(id);
  },

  // Delete a problem
  async deleteProblem(id: string) {
    const problemRef = doc(db, 'problems', id);
    await deleteDoc(problemRef);
  },

  // Get problems by difficulty
  async getProblemsByDifficulty(difficulty: string) {
    const q = query(
      collection(db, 'problems'),
      where('difficulty', '==', difficulty)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Problem
    );
  },

  // Get problems by category
  async getProblemsByCategory(category: string) {
    const q = query(
      collection(db, 'problems'),
      where('category', '==', category)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Problem
    );
  },
};
