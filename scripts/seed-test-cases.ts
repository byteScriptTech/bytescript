import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

import { Problem } from '@/services/firebase/problemsService.server';

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(
    require('../deneb-88a71-firebase-adminsdk-3z447-5d0122f45c.json')
  ),
});

const db = admin.firestore();

interface TestCase {
  problemId: string;
  input: string;
  expectedOutput: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

async function seedTestCases() {
  try {
    // Fetch all problems
    const problemsSnapshot = await db.collection('problems').get();
    const problems = problemsSnapshot.docs.map((doc) => {
      const problemData = doc.data() as Problem;
      return {
        id: doc.id,
        ...problemData,
      };
    });

    // Seed test cases for each problem
    for (const problem of problems) {
      console.log(`Seeding test cases for problem: ${problem.title}`);

      switch (problem.title) {
        case 'Two Sum':
          // Basic case
          await addTestCase(problem.id, '[2,7,11,15], 9', '[0,1]');
          // Multiple solutions, return any valid pair
          await addTestCase(problem.id, '[3,2,4], 6', '[1,2]');
          // Negative numbers
          await addTestCase(problem.id, '[-3,4,3,90], 0', '[0,2]');
          // Edge case: single element
          await addTestCase(problem.id, '[5], 10', '[]');
          // Edge case: no solution
          await addTestCase(problem.id, '[1,2,3], 7', '[]');
          // Large numbers
          await addTestCase(
            problem.id,
            '[1000000000,2000000000,3000000000], 5000000000',
            '[0,1]'
          );
          break;

        case 'Add Two Numbers':
          // Basic case
          await addTestCase(problem.id, '[2,4,3], [5,6,4]', '[7,0,8]');
          // Different lengths
          await addTestCase(
            problem.id,
            '[9,9,9,9,9,9,9], [9,9,9,9]',
            '[8,9,9,9,0,0,0,1]'
          );
          // Edge case: zero
          await addTestCase(problem.id, '[0], [0]', '[0]');
          // Edge case: carry at end
          await addTestCase(problem.id, '[5], [5]', '[0,1]');
          // Large numbers
          await addTestCase(
            problem.id,
            '[9,9,9,9,9,9,9,9,9,9], [9,9,9,9,9,9,9,9,9,9]',
            '[8,9,9,9,9,9,9,9,9,9,1]'
          );
          break;

        case 'Longest Substring Without Repeating Characters':
          // Basic case
          await addTestCase(problem.id, '"abcabcbb"', '3');
          // All unique characters
          await addTestCase(problem.id, '"pwwkew"', '3');
          // Empty string
          await addTestCase(problem.id, '""', '0');
          // Single character
          await addTestCase(problem.id, '"a"', '1');
          // All same characters
          await addTestCase(problem.id, '"aaaa"', '1');
          // All unique characters
          await addTestCase(problem.id, '"abcdefghijklmnopqrstuvwxyz"', '26');
          break;

        case 'Median of Two Sorted Arrays':
          // Basic case
          await addTestCase(problem.id, '[1,3], [2]', '2.0');
          // Different lengths
          await addTestCase(problem.id, '[1,2], [3,4]', '2.5');
          // Edge case: empty arrays
          await addTestCase(problem.id, '[], [1]', '1.0');
          // Edge case: single element
          await addTestCase(problem.id, '[1], [1]', '1.0');
          // Large numbers
          await addTestCase(
            problem.id,
            '[1,2,3,4,5,6,7,8,9,10], [11,12,13,14,15,16,17,18,19,20]',
            '10.5'
          );
          break;

        default:
          // Add generic test cases with edge cases
          await addTestCase(problem.id, '[]', '[]');
          await addTestCase(problem.id, '[1, 2, 3]', '[1, 2, 3]');
          await addTestCase(problem.id, '[1000000]', '[1000000]');
          await addTestCase(problem.id, '[-1, -2, -3]', '[-1, -2, -3]');
          await addTestCase(problem.id, '[1, 1, 1, 1, 1]', '[1, 1, 1, 1, 1]');
      }

      console.log(`Successfully added test cases for ${problem.title}`);
    }

    console.log('Test cases seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding test cases:', error);
    process.exit(1);
  }
}

async function addTestCase(
  problemId: string,
  input: string,
  expectedOutput: string
) {
  const now = Timestamp.now();
  const testCaseData: TestCase = {
    problemId,
    input,
    expectedOutput,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection('testCases').add(testCaseData);
}

seedTestCases();
