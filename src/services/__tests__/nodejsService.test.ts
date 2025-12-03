import { doc, getDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';
import type { LanguageContent } from '@/types/content';

import { getNodejsContent, nodejsService } from '../nodejsService';

jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock('@/firebase/config', () => ({
  db: {},
  app: {},
  auth: {},
  getAuth: jest.fn(),
  getFirestore: jest.fn(),
  initializeApp: jest.fn(),
}));

describe('Node.js Service', () => {
  const mockDocData: LanguageContent = {
    id: 'nodejs',
    name: 'Node.js',
    tag: 'nodejs',
    description: 'Node.js runtime environment',
    applications: ['Server-side applications', 'APIs', 'CLI tools'],
    explanation: [
      "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
    ],
    best_practices_and_common_mistakes: {
      common_mistakes: [],
      best_practices: [],
    },
    related_topics: [],
    challenges: [],
    examples: [],
    topics: [
      {
        id: '1',
        name: 'Introduction to Node.js',
        slug: 'introduction-to-nodejs',
        description: 'Learn the basics of Node.js',
        content: 'Detailed content about Node.js...',
        difficulty: 'beginner',
        sections: [
          {
            type: 'text',
            title: 'Introduction',
            content: 'Node.js is a JavaScript runtime...',
            explanation:
              'Node.js allows JavaScript to be run on the server side.',
          },
        ],
        examples: [
          {
            id: 'ex1',
            code: 'console.log("Hello, Node.js!");',
            description: 'Simple console log example',
            language: 'javascript',
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNodejsContent', () => {
    it('should return Node.js content when document exists', async () => {
      // Mock successful document fetch
      const mockDocSnap = {
        exists: () => true,
        data: () => mockDocData,
      };
      (getDoc as jest.Mock).mockResolvedValueOnce(mockDocSnap);

      const docRef = {};
      (doc as jest.Mock).mockReturnValue(docRef);

      const result = await getNodejsContent();

      expect(doc).toHaveBeenCalledWith(db, 'content', 'nodejs');
      expect(getDoc).toHaveBeenCalledWith(docRef);
      expect(result).toEqual(mockDocData);
    });

    it('should return null when document does not exist', async () => {
      // Mock document not found
      const mockDocSnap = {
        exists: () => false,
      };
      (getDoc as jest.Mock).mockResolvedValueOnce(mockDocSnap);

      const docRef = {};
      (doc as jest.Mock).mockReturnValue(docRef);

      const result = await getNodejsContent();
      expect(result).toBeNull();
    });

    it('should propagate errors when fetching fails', async () => {
      // Mock error case
      const error = new Error('Firestore error');
      (getDoc as jest.Mock).mockRejectedValueOnce(error);

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const docRef = {};
      (doc as jest.Mock).mockReturnValue(docRef);

      await expect(getNodejsContent()).rejects.toThrow('Firestore error');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching Node.js content:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  // Add more test cases for other service methods (createTopic, updateTopic, etc.)
  describe('getTopics', () => {
    it('should return all topics', async () => {
      const docRef = {};
      (doc as jest.Mock).mockReturnValue(docRef);

      const mockDocSnap = {
        exists: () => true,
        data: () => ({
          topics: mockDocData.topics,
        }),
      };
      (getDoc as jest.Mock).mockResolvedValueOnce(mockDocSnap);

      const result = await nodejsService.getTopics();

      expect(doc).toHaveBeenCalledWith(db, 'content', 'nodejs');
      expect(getDoc).toHaveBeenCalledWith(docRef);
      expect(result).toEqual(mockDocData.topics);
    });
  });
});
