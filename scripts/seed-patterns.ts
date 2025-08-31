import admin from 'firebase-admin';

const serviceAccount = require('../deneb-88a71-firebase-adminsdk-3z447-5d0122f45c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://deneb-88a71.firebaseio.com',
});

const db = admin.firestore();
const PATTERNS_COLLECTION = 'patterns';

interface PatternData {
  id?: string;
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

interface SeedPattern
  extends Omit<PatternData, 'id' | 'createdAt' | 'updatedAt'> {}

const patterns: SeedPattern[] = [
  {
    title: 'Sliding Window',
    slug: 'sliding-window',
    description: 'Efficiently process sequential data with a fixed-size window',
    readme: `## Sliding Window Pattern

The Sliding Window pattern is used to perform a required operation on a specific window size of a given array or linked list. This technique is particularly useful for reducing the time complexity of problems that would otherwise require nested loops.

### When to Use
- When the problem involves arrays/lists and asks to find a subarray/sublist with a specific property
- When the problem requires finding the longest/shortest/maximum/minimum subarray/substring
- When you need to optimize a solution that uses nested loops (O(n²) time complexity) to O(n)
- When working with sequential data where you need to maintain a "window" of elements

### Common Variations
- Fixed-size window
- Dynamic-size window
- Window with condition
- String permutation problems

### Example Problems
- [Maximum Sum Subarray of Size K (easy)](https://leetcode.com/problems/maximum-subarray/)
- [Longest Substring with K Distinct Characters (medium)](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/)
- [Fruits into Baskets (medium)](https://leetcode.com/problems/fruit-into-baskets/)
- [Longest Substring Without Repeating Characters (medium)](https://leetcode.com/problems/longest-substring-without-repeating-characters/)
- [Permutation in String (medium)](https://leetcode.com/problems/permutation-in-string/)

### Time and Space Complexity
- **Time Complexity**: O(n) - Each element is processed at most twice (once when added to window, once when removed)
- **Space Complexity**: O(1) to O(k) where k is the size of the character set or distinct elements

### Implementation Tips
1. Use two pointers (start and end) to represent the window
2. Use a hash map to keep track of elements in the current window
3. Adjust the window based on the problem constraints
4. Update the result when the window meets the problem criteria
`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    category: 'Arrays',
    order: 1,
    icon: '🪟',
  },
  {
    title: 'Two Pointers',
    slug: 'two-pointers',
    description: 'Efficiently iterate through data with two pointers',
    readme: `## Two Pointers Pattern

This pattern involves using two pointers to traverse a data structure, typically an array or linked list, to solve problems with improved time or space complexity.

### When to Use
- When you need to find a pair of elements in a sorted array that meet certain criteria
- When you need to find a subarray with a specific property
- When you need to remove duplicates from a sorted array in-place
- When working with linked lists and need to find the middle, detect cycles, or reverse the list

### Common Variations
- One pointer at each end (start and end of array)
- One slow and one fast pointer (tortoise and hare)
- One pointer for writing and one for reading (in-place operations)

### Example Problems
- [Two Sum II - Input Array Is Sorted (easy)](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)
- [3Sum (medium)](https://leetcode.com/problems/3sum/)
- [Container With Most Water (medium)](https://leetcode.com/problems/container-with-most-water/)
- [Remove Duplicates from Sorted Array (easy)](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)
- [Linked List Cycle (easy)](https://leetcode.com/problems/linked-list-cycle/)`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    category: 'Arrays/Linked Lists',
    order: 2,
    icon: '👆👇',
  },
  {
    title: 'Fast & Slow Pointers',
    slug: 'fast-slow-pointers',
    description:
      'Use two pointers moving at different speeds to detect cycles or find specific elements',
    readme: `## Fast & Slow Pointers Pattern

This pattern involves using two pointers that move through an array or linked list at different speeds to solve problems efficiently.

### When to Use
- When you need to find a cycle in a linked list
- When you need to find the middle element of a linked list
- When you need to find if a linked list is a palindrome
- When you need to find the start of a cycle in a linked list

### Common Variations
- Tortoise and Hare algorithm for cycle detection
- Finding the middle element of a linked list
- Finding the kth node from the end of a linked list

### Example Problems
- [Linked List Cycle (easy)](https://leetcode.com/problems/linked-list-cycle/)
- [Middle of the Linked List (easy)](https://leetcode.com/problems/middle-of-the-linked-list/)
- [Happy Number (easy)](https://leetcode.com/problems/happy-number/)
- [Palindrome Linked List (easy)](https://leetcode.com/problems/palindrome-linked-list/)`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    category: 'Linked Lists',
    order: 3,
    icon: '🐢🐇',
  },
  {
    title: 'Merge Intervals',
    slug: 'merge-intervals',
    description: 'Efficiently merge overlapping intervals',
    readme: `## Merge Intervals Pattern

This pattern is used to deal with overlapping intervals. In many problems involving intervals, you need to either find overlapping intervals or merge them if they overlap.

### When to Use
- When you need to find overlapping intervals
- When you need to merge intervals if they overlap
- When you need to find the minimum number of rooms required for meetings
- When you need to find if a person can attend all meetings

### Common Variations
- Merging overlapping intervals
- Finding the intersection of intervals
- Finding the maximum number of overlapping intervals

### Example Problems
- [Merge Intervals (medium)](https://leetcode.com/problems/merge-intervals/)
- [Insert Interval (medium)](https://leetcode.com/problems/insert-interval/)
- [Meeting Rooms (easy)](https://leetcode.com/problems/meeting-rooms/)
- [Meeting Rooms II (medium)](https://leetcode.com/problems/meeting-rooms-ii/)
- [Minimum Number of Arrows to Burst Balloons (medium)](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/)`,
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    category: 'Intervals',
    order: 4,
    icon: '⏱️',
  },
  {
    title: 'Cyclic Sort',
    slug: 'cyclic-sort',
    description:
      'Sort elements in place with O(n) time complexity for specific cases',
    readme: `## Cyclic Sort Pattern

This pattern is used to sort an array in place with O(n) time complexity when the input contains elements in a range from 1 to N.

### When to Use
- When the problem involves a sorted array of numbers in a given range
- When the problem requires finding the missing or duplicate numbers in a range
- When the problem requires finding all duplicate numbers
- When the problem requires finding the first missing positive number

### Common Variations
- Finding the missing number in a range
- Finding all missing numbers in a range
- Finding the duplicate number in a range
- Finding all duplicate numbers in a range

### Example Problems
- [Find the Missing Number (easy)](https://leetcode.com/problems/missing-number/)
- [Find All Numbers Disappeared in an Array (easy)](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/)
- [Find the Duplicate Number (medium)](https://leetcode.com/problems/find-the-duplicate-number/)
- [Find All Duplicates in an Array (medium)](https://leetcode.com/problems/find-all-duplicates-in-an-array/)
- [First Missing Positive (hard)](https://leetcode.com/problems/first-missing-positive/)`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    category: 'Arrays',
    order: 5,
    icon: '🔄',
  },
];

async function seedPatterns() {
  try {
    console.log('Starting to seed patterns...');
    const batch = db.batch();
    const patternsCollection = db.collection(PATTERNS_COLLECTION);
    const now = new Date();

    for (const pattern of patterns) {
      const patternRef = patternsCollection.doc();
      const patternData: PatternData = {
        ...pattern,
        createdAt: now,
        updatedAt: now,
      };
      batch.set(patternRef, patternData);
    }

    await batch.commit();
    console.log('Successfully seeded patterns');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding patterns:', error);
    process.exit(1);
  }
}

// Run the seed function
seedPatterns();
