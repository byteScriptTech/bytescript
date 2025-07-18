import { Timestamp } from 'firebase-admin/firestore';

import { adminDb } from '@/lib/firebase-admin';

interface TestCase {
  id: string;
  problemId: string;
  input: string;
  expectedOutput: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  [key: string]: unknown; // For any additional fields
}

export const serverTestCasesService = {
  async getTestCasesByProblemId(problemId: string): Promise<TestCase[]> {
    const testCasesRef = adminDb.collection('testCases');
    const snapshot = await testCasesRef
      .where('problemId', '==', problemId)
      .get();

    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TestCase[];
  },
};
