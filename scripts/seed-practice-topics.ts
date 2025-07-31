import admin from 'firebase-admin';

import { PracticeTopic, Difficulty } from '../src/types/practice';

const serviceAccount = require('../deneb-88a71-firebase-adminsdk-3z447-5d0122f45c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://deneb-88a71.firebaseio.com',
});

const db = admin.firestore();

const samplePracticeTopics: Omit<PracticeTopic, 'id'>[] = [
  {
    name: 'Array and Hash Table',
    description: 'Problems involving arrays and hash table operations',
    difficulty: 'Easy' as Difficulty,
    category: 'problems',
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Stack Operations',
    description: 'Problems that can be solved using stack data structure',
    difficulty: 'Easy' as Difficulty,
    category: 'problems',
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'String Manipulation',
    description: 'Problems involving string operations and manipulations',
    difficulty: 'Easy' as Difficulty,
    category: 'problems',
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    name: 'Closures',
    description: 'Understand and implement JavaScript closures',
    difficulty: 'Intermediate' as Difficulty,
    category: 'javascript',
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Promises & Async/Await',
    description: 'Work with JavaScript Promises and async/await',
    difficulty: 'Intermediate' as Difficulty,
    category: 'javascript',
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'ES6+ Features',
    description: 'Master modern JavaScript features',
    difficulty: 'Intermediate' as Difficulty,
    category: 'javascript',
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    name: 'List Comprehensions',
    description: 'Master Python list comprehensions',
    difficulty: 'Beginner' as Difficulty,
    category: 'python',
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Decorators',
    description: 'Understand and implement Python decorators',
    difficulty: 'Advanced' as Difficulty,
    category: 'python',
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Context Managers',
    description: 'Work with Python context managers',
    difficulty: 'Intermediate' as Difficulty,
    category: 'python',
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    name: 'Binary Search',
    description: 'Implement binary search algorithm',
    difficulty: 'Easy' as Difficulty,
    category: 'dsa',
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Merge Sort',
    description: 'Implement the merge sort algorithm',
    difficulty: 'Medium' as Difficulty,
    category: 'dsa',
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Hash Tables',
    description: 'Understand and implement hash tables',
    difficulty: 'Medium' as Difficulty,
    category: 'dsa',
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedPracticeTopics() {
  try {
    console.log('Starting to seed practice topics...');
    const batch = db.batch();
    const collectionRef = db.collection('practice_topics');

    // Clear existing topics
    const snapshot = await collectionRef.get();
    const batchSize = snapshot.size;

    if (batchSize > 0) {
      console.log(`Deleting ${batchSize} existing practice topics...`);
      const deleteBatch = db.batch();
      snapshot.docs.forEach((doc) => {
        deleteBatch.delete(doc.ref);
      });
      await deleteBatch.commit();
    }

    // Add new topics
    console.log(`Adding ${samplePracticeTopics.length} practice topics...`);
    samplePracticeTopics.forEach((topic) => {
      const docRef = collectionRef.doc();
      batch.set(docRef, topic);
    });

    await batch.commit();
    console.log('Successfully seeded practice topics!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding practice topics:', error);
    process.exit(1);
  }
}

seedPracticeTopics();
