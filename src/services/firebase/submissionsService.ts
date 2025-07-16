import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  query,
  where,
} from 'firebase/firestore';

import { db } from '@/firebase/config';

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  result: {
    success: boolean;
    output: string;
    error?: string;
    testResults: Array<{
      testCase: {
        id: string;
        problemId: string;
        input: string;
        expectedOutput: string;
      };
      passed: boolean;
      output: string;
      error?: string;
      executionTime: number;
      memoryUsage: number;
    }>;
  };
  submittedAt: Date;
  status: 'passed' | 'failed';
  executionTime: number;
  memoryUsage: number;
}

export const submissionsService = {
  async addSubmission(
    submission: Omit<Submission, 'id' | 'submittedAt'>
  ): Promise<Submission> {
    const now = new Date();
    const newSubmission = {
      ...submission,
      submittedAt: now,
    };
    const docRef = await addDoc(collection(db, 'submissions'), newSubmission);
    return {
      id: docRef.id,
      ...newSubmission,
    } as Submission;
  },

  async getUserSubmissions(userId: string): Promise<Submission[]> {
    const q = query(
      collection(db, 'submissions'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Submission
    );
  },

  async getProblemSubmissions(problemId: string): Promise<Submission[]> {
    const q = query(
      collection(db, 'submissions'),
      where('problemId', '==', problemId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Submission
    );
  },

  async getSubmissionById(id: string): Promise<Submission | null> {
    const docRef = doc(db, 'submissions', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Submission;
    }
    return null;
  },
};
