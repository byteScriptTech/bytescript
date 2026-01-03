import admin from 'firebase-admin';

import type { Problem } from '../src/types/problem';

// Initialize Firebase Admin with your service account credentials
// You'll need to create a service account key from Firebase Console and place it in the project root
const serviceAccount = require('../deneb-88a71-firebase-adminsdk-3z447-5d0122f45c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://deneb-88a71.firebaseio.com',
});

const db = admin.firestore();

const sampleProblems: Omit<Problem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Two Sum',
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'Easy',
    category: 'Arrays',
    tags: ['arrays', 'hashmap', 'two-pointers'],
    starterCode: `function twoSum(nums, target) {
  // Write your solution here
};`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists',
    ],
  },
  {
    title: 'Add Two Numbers',
    description:
      'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.',
    difficulty: 'Medium',
    category: 'Linked List',
    tags: ['linked-list', 'math'],
    starterCode: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
function addTwoNumbers(l1, l2) {
  // Write your solution here
};`,
    examples: [
      {
        input: 'l1 = [2,4,3], l2 = [5,6,4]',
        output: '[7,0,8]',
        explanation: '342 + 465 = 807',
      },
    ],
    constraints: [
      'The number of nodes in each linked list is in the range [1, 100].',
      '0 <= Node.val <= 9',
      'It is guaranteed that the list represents a number that does not have leading zeros',
    ],
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    description:
      'Given a string s, find the length of the longest substring without repeating characters.',
    difficulty: 'Medium',
    category: 'Strings',
    tags: ['strings', 'sliding-window'],
    starterCode: `function lengthOfLongestSubstring(s) {
  // Write your solution here
};`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces',
    ],
  },
  {
    title: 'Median of Two Sorted Arrays',
    description:
      'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
    difficulty: 'Hard',
    category: 'Arrays',
    tags: ['arrays', 'binary-search'],
    starterCode: `function findMedianSortedArrays(nums1, nums2) {
  // Write your solution here
};`,
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        explanation: 'merged array = [1,2,3] and median is 2.',
      },
    ],
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m <= 1000',
      '0 <= n <= 1000',
      '1 <= m + n <= 2000',
      '-10^6 <= nums1[i], nums2[i] <= 10^6',
    ],
  },
];

async function seedProblems() {
  try {
    console.log('Starting to seed problems...');

    for (const problem of sampleProblems) {
      try {
        const now = new Date();
        const docRef = await db.collection('problems').add({
          ...problem,
          createdAt: now,
          updatedAt: now,
          solved: false,
          lastAttempted: now,
        });

        console.log(
          `Successfully created problem: ${problem.title} with ID: ${docRef.id}`
        );
      } catch (error) {
        console.error(`Failed to create problem: ${problem.title}`, error);
      }
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error during seeding:', error);
  }
}

seedProblems();
