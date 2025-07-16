import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';

import { db } from '@/firebase/config';

export interface TestCase {
  id: string;
  problemId: string;
  input: string;
  expectedOutput: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const testCasesService = {
  async getTestCasesByProblemId(problemId: string): Promise<TestCase[]> {
    const q = query(
      collection(db, 'testCases'),
      where('problemId', '==', problemId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as TestCase
    );
  },

  async addTestCase(
    problemId: string,
    input: string,
    expectedOutput: string
  ): Promise<TestCase> {
    const now = Timestamp.now();
    const testCaseData = {
      problemId,
      input,
      expectedOutput,
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await addDoc(collection(db, 'testCases'), testCaseData);
    return {
      id: docRef.id,
      ...testCaseData,
    } as TestCase;
  },

  async updateTestCase(
    id: string,
    updates: Partial<TestCase>
  ): Promise<TestCase | null> {
    const testCaseRef = doc(db, 'testCases', id);
    await updateDoc(testCaseRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    const docSnap = await getDoc(testCaseRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as TestCase;
    }
    return null;
  },

  async deleteTestCase(id: string): Promise<void> {
    await deleteDoc(doc(db, 'testCases', id));
  },
};
