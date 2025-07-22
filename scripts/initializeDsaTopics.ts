// @ts-check
import { dirname } from 'path';
import * as path from 'path';
import { fileURLToPath } from 'url';

import * as dotenv from 'dotenv';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Get the directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file in the project root
const envPath = path.resolve(process.cwd(), '.env.local');
console.log(`Loading environment variables from: ${envPath}`);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
}

// Path to the Firebase Admin SDK service account key
const serviceAccountPath = path.resolve(
  __dirname,
  '..',
  'deneb-88a71-firebase-adminsdk-3z447-5d0122f45c.json'
);

// Initialize Firebase Admin SDK
try {
  console.log('Initializing Firebase Admin...');

  // Initialize Firebase Admin with the service account
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
  });

  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error);
  process.exit(1);
}

// Get Firestore instance
const db = getFirestore();

// Initialize default topics directly in the script
async function initializeDefaultTopics() {
  const defaultTopics = [
    {
      title: 'Arrays',
      slug: 'arrays',
      description:
        'Learn about arrays, their properties, and common operations.',
      category: 'data-structures',
      subcategory: 'linear',
      difficulty: 'beginner',
      tags: ['fixed-size', 'contiguous', 'indexing', 'iteration'],
      prerequisites: [],
      content: `
  # Arrays
  
  An **Array** is a collection of elements stored in contiguous memory locations. Each element can be accessed in O(1) time by its index.
  
  ## 🔧 Common Operations
  
  | Operation        | Time Complexity |
  |------------------|-----------------|
  | Access by index  | O(1)            |
  | Search           | O(n)            |
  | Insertion at end | O(1)*           |
  | Deletion at end  | O(1)*           |
  | Insertion/deletion at arbitrary position | O(n) |
  
  _* amortized if dynamic resizing is used_
  
  ## 🔍 Advantages
  - Constant‑time random access
  - Memory locality improves cache performance
  
  ## ⚠️ Disadvantages
  - Fixed size (unless using dynamic arrays)
  - Costly insertions/deletions in the middle
  
  ---
  
  ## 📘 Example Problems
  
  1. **Sum of Elements**  
     Given \`[1, 2, 3, 4, 5]\`, compute the sum.  
  2. **Rotate Array**  
     Rotate an array to the right by k steps.  
  3. **Two Sum**  
     Find indices of two numbers that add up to a target.
  
  ---
  
  ## ✍️ Sample Implementation (JavaScript)
  
  \`\`\`ts
  function sumArray(arr: number[]): number {
    return arr.reduce((acc, x) => acc + x, 0);
  }
  \`\`\`
      `,
      examples: [
        {
          input: '[1, 2, 3, 4, 5]',
          output: 'Sum: 15',
          explanation:
            'Calculate the sum of all elements using a simple loop or reduce.',
        },
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0, 1]',
          explanation: 'Use a hash map to find two-sum in O(n) time.',
        },
      ],
      operations: [
        'accessByIndex',
        'iterate',
        'append',
        'insertAt',
        'deleteAt',
        'find',
        'rotate',
      ],
      useCases: [
        'Implementing lookup tables',
        'Matrix representation',
        'Storing static collections of items',
      ],
      resources: [
        {
          type: 'article',
          title: 'GeeksforGeeks – Array Data Structure',
          url: 'https://www.geeksforgeeks.org/array-data-structure/',
        },
        {
          type: 'video',
          title: 'Arrays in 5 Minutes',
          url: 'https://www.youtube.com/watch?v=wvTiiA9KjPk',
        },
        {
          type: 'interactive',
          title: 'Visualgo – Array Operations',
          url: 'https://visualgo.net/en/array',
        },
      ],
      lastUpdated: '2025-07-22T11:00:00Z',
    },
    {
      title: 'Linked Lists',
      slug: 'linked-lists',
      description:
        'Understand linked lists, their types, operations, and applications.',
      category: 'data-structures',
      subcategory: 'linear',
      difficulty: 'intermediate',
      tags: ['singly', 'doubly', 'circular', 'pointers', 'dynamic-memory'],
      prerequisites: ['Arrays'],
      content: `
  # Linked Lists
  
  A **Linked List** is a linear collection of nodes where each node contains data and a pointer to the next node.
  
  ## 🧱 Types
  
  1. **Singly Linked List** – one pointer per node  
  2. **Doubly Linked List** – two pointers (next & prev)  
  3. **Circular Linked List** – last node points back to head
  
  ---
  
  ## 🔧 Common Operations
  
  | Operation            | Time Complexity |
  |----------------------|-----------------|
  | Insert at head       | O(1)            |
  | Insert at tail       | O(n)            |
  | Delete by value      | O(n)            |
  | Search               | O(n)            |
  | Reverse the list     | O(n)            |
  
  ---
  
  ## 🔍 Advantages
  - Dynamic size  
  - Efficient insertions/deletions at arbitrary positions
  
  ## ⚠️ Disadvantages
  - No direct indexing  
  - Extra memory for pointers
  
  ---
  
  ## 📘 Example Problems
  
  1. **Reverse a Linked List**  
  2. **Detect Cycle** (Floyd’s algorithm)  
  3. **Merge Two Sorted Lists**
  
  ---
  
  ## ✍️ Sample Implementation (TypeScript)
  
  \`\`\`ts
  class ListNode {
    constructor(
      public value: number,
      public next: ListNode | null = null
    ) {}
  }
  
  function reverseList(head: ListNode | null): ListNode | null {
    let prev: ListNode | null = null;
    let curr = head;
    while (curr) {
      const nxt = curr.next;
      curr.next = prev;
      prev = curr;
      curr = nxt;
    }
    return prev;
  }
  \`\`\`
      `,
      examples: [
        {
          input: '1 → 2 → 3 → 4 → 5',
          output: '5 → 4 → 3 → 2 → 1',
          explanation: 'Reverse a singly linked list using iteration.',
        },
        {
          input: '1 → 2 → 3 → 4 → 5 → 2 (cycle)',
          output: 'true',
          explanation:
            "Detect a cycle using Floyd's Tortoise and Hare algorithm.",
        },
      ],
      operations: [
        'insertAtHead',
        'insertAtTail',
        'deleteNode',
        'reverseList',
        'findMiddleNode',
        'detectCycle',
        'mergeTwoLists',
      ],
      useCases: [
        'Undo/redo functionality in editors',
        'Music playlist navigation',
        'Chaining in hash tables',
      ],
      resources: [
        {
          type: 'article',
          title: 'GeeksforGeeks – Linked List Data Structure',
          url: 'https://www.geeksforgeeks.org/data-structures/linked-list/',
        },
        {
          type: 'video',
          title: 'Linked List Crash Course',
          url: 'https://www.youtube.com/watch?v=njTh_OwMljA',
        },
        {
          type: 'interactive',
          title: 'Visualgo – Linked List',
          url: 'https://visualgo.net/en/list',
        },
      ],
      lastUpdated: '2025-07-22T12:00:00Z',
    },
    {
      title: 'Binary Search',
      slug: 'binary-search',
      description: 'Learn about the binary search algorithm for sorted arrays.',
      category: 'algorithms',
      subcategory: 'divide-and-conquer',
      difficulty: 'beginner',
      tags: ['search', 'divide-and-conquer', 'sorted'],
      prerequisites: ['Arrays'],
      content: `
  # Binary Search
  
  **Binary Search** finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.
  
  ## 🔧 Algorithm Steps
  
  1. Initialize \`low = 0\`, \`high = n-1\`.  
  2. While \`low ≤ high\`:  
     - \`mid = floor((low + high) / 2)\`  
     - If \`arr[mid] == target\`, return \`mid\`.  
     - If \`arr[mid] < target\`, search right half (\`low = mid+1\`).  
     - Else search left half (\`high = mid-1\`).  
  3. Return \`-1\` if not found.
  
  ---
  
  ## 🔍 Time & Space
  
  - **Time Complexity**: O(log n)  
  - **Space Complexity**: O(1)
  
  ---
  
  ## 📘 Example Problems
  
  1. **Standard Binary Search**  
  2. **Search in Rotated Sorted Array**  
  3. **Find First or Last Position of Element**
  
  ---
  
  ## ✍️ Sample Implementation (TypeScript)
  
  \`\`\`ts
  function binarySearch(arr: number[], target: number): number {
    let low = 0, high = arr.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (arr[mid] === target) return mid;
      if (arr[mid] < target) low = mid + 1;
      else high = mid - 1;
    }
    return -1;
  }
  \`\`\`
      `,
      examples: [
        {
          input: 'Array: [1,2,3,4,5,6,7], Target: 4',
          output: 'Index: 3',
          explanation: 'Standard binary search on a sorted array.',
        },
        {
          input: 'Array: [4,5,6,7,0,1,2], Target: 0',
          output: 'Index: 4',
          explanation:
            'Search in a rotated sorted array using modified binary search.',
        },
      ],
      operations: ['binarySearch', 'searchInRotatedArray', 'findFirstLast'],
      useCases: [
        'Lookup in sorted datasets',
        'Finding insertion points',
        'Algorithms that require search subroutines',
      ],
      resources: [
        {
          type: 'article',
          title: 'LeetCode Explore – Binary Search',
          url: 'https://leetcode.com/explore/learn/card/binary-search/',
        },
        {
          type: 'video',
          title: 'Binary Search Explained',
          url: 'https://www.youtube.com/watch?v=P3YID7liBug',
        },
        {
          type: 'interactive',
          title: 'Visualizer – Binary Search',
          url: 'https://visualgo.net/en/binarysearch',
        },
      ],
      lastUpdated: '2025-07-22T13:00:00Z',
    },
  ];

  try {
    console.log('🚀 Initializing default DSA topics...');
    const batch = db.batch();
    const topicsRef = db.collection('dsa-topics');

    // Clear existing topics
    const snapshot = await topicsRef.get();
    const batchSize = 20;
    let currentBatch = 0;

    // Delete in batches of 20 (Firestore limit)
    while (currentBatch < snapshot.size) {
      const batch = db.batch();
      const batchDocs = snapshot.docs.slice(
        currentBatch,
        currentBatch + batchSize
      );
      batchDocs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      currentBatch += batchSize;
    }

    // Add new topics
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    defaultTopics.forEach((topic) => {
      const docRef = topicsRef.doc();
      batch.set(docRef, {
        ...topic,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    });

    await batch.commit();
    console.log(
      `✅ Successfully initialized ${defaultTopics.length} DSA topics!`
    );
  } catch (error) {
    console.error('❌ Error initializing DSA topics:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the initialization
initializeDefaultTopics().catch(console.error);
