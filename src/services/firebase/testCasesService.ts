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
  DocumentData,
} from 'firebase/firestore';

import { db } from '@/firebase/config';

type TimestampObject = {
  seconds: number;
  nanoseconds: number;
};

const convertTimestamp = (
  timestamp: Timestamp | TimestampObject | Date | undefined
): Date | undefined => {
  if (!timestamp) return undefined;
  if (timestamp instanceof Date) return timestamp;
  if ('toDate' in timestamp) return timestamp.toDate();
  return new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
};

export interface TestCase extends DocumentData {
  id: string;
  problemId: string;
  input: string;
  expectedOutput: string;
  createdAt: Date;
  updatedAt: Date;
}

export const testCasesService = {
  async getTestCasesByProblemId(problemId: string): Promise<TestCase[]> {
    if (!db) return [];
    const q = query(
      collection(db, 'testCases'),
      where('problemId', '==', problemId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt:
          convertTimestamp(data.createdAt as Timestamp | undefined) ||
          new Date(),
        updatedAt:
          convertTimestamp(data.updatedAt as Timestamp | undefined) ||
          new Date(),
      } as TestCase;
    });
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
    if (!db) return {} as TestCase;
    const docRef = await addDoc(collection(db, 'testCases'), testCaseData);

    return {
      id: docRef.id,
      ...testCaseData,
      createdAt: convertTimestamp(now) || new Date(),
      updatedAt: convertTimestamp(now) || new Date(),
    } as TestCase;
  },

  async updateTestCase(
    id: string,
    updates: Partial<TestCase>
  ): Promise<TestCase | null> {
    if (!db) return null;
    const testCaseRef = doc(db, 'testCases', id);
    await updateDoc(testCaseRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    const docRef = await getDoc(doc(db, 'testCases', id));
    if (!docRef.exists()) {
      return null;
    }

    const data = docRef.data();
    return {
      id: docRef.id,
      ...data,
      createdAt:
        convertTimestamp(data.createdAt as Timestamp | undefined) || new Date(),
      updatedAt:
        convertTimestamp(data.updatedAt as Timestamp | undefined) || new Date(),
    } as TestCase;
  },

  async deleteTestCase(id: string): Promise<void> {
    if (!db) return;
    await deleteDoc(doc(db, 'testCases', id));
  },
};
