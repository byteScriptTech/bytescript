import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc,
} from 'firebase/firestore';

import { db } from '@/firebase/config';
import { InterviewQuestion } from '@/types/interview';

class InterviewService {
  /**
   * Get all available topics
   */
  public async getTopics(): Promise<string[]> {
    try {
      if (!db) return [];
      const q = query(collection(db, 'interviewQuestions'));
      const querySnapshot = await getDocs(q);
      console.log(
        `Found ${querySnapshot.size} documents in interviewQuestions collection`
      );

      if (querySnapshot.empty) {
        console.warn('No documents found in interviewQuestions collection');
        return [];
      }

      // Log the first few documents to verify structure
      querySnapshot.docs.slice(0, 3).forEach((doc, index) => {
        console.log(`Document ${index + 1}:`, doc.id, '=>', doc.data());
      });

      console.log(`Found ${querySnapshot.size} documents`);
      const topics = new Set<string>();

      querySnapshot.forEach((doc) => {
        try {
          const data = doc.data();
          if (data?.topic) {
            topics.add(data.topic);
          }
        } catch (docError) {
          console.error(`Error processing document ${doc.id}:`, docError);
        }
      });

      return Array.from(topics);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Error in getTopics:', errorMessage);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  }

  /**
   * Get all questions for a specific topic
   */
  public async getQuestionsByTopic(
    topic: string
  ): Promise<InterviewQuestion[]> {
    if (!topic || typeof topic !== 'string') {
      return [];
    }

    try {
      if (!db) return [];
      const normalizedTopic = topic.trim().toLowerCase();
      const allQuestionsQuery = query(collection(db, 'interviewQuestions'));
      const allQuestionsSnapshot = await getDocs(allQuestionsQuery);
      // Get all unique topics
      const allTopics = new Set<string>();
      allQuestionsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.topic) {
          allTopics.add(data.topic);
        }
      });

      // Now execute the actual query
      const q = query(
        collection(db, 'interviewQuestions'),
        where('topic', '==', normalizedTopic),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.warn(`No questions found for topic: "${normalizedTopic}"`);
        return [];
      }

      const questions: InterviewQuestion[] = [];
      querySnapshot.forEach((doc) => {
        try {
          const data = doc.data();
          questions.push({
            id: doc.id,
            ...data,
          } as InterviewQuestion);
        } catch (error) {
          console.error(`Error processing document ${doc.id}:`, error);
        }
      });

      return questions;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Error in getQuestionsByTopic:', errorMessage);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  }

  /**
   * Get a specific question by ID
   */
  public async getQuestionById(
    questionId: string
  ): Promise<InterviewQuestion | null> {
    try {
      if (!db) {
        return null;
      }
      const docRef = doc(db, 'interviewQuestions', questionId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return { id: docSnap.id, ...docSnap.data() } as InterviewQuestion;
    } catch (error) {
      console.error('Error getting question by id:', error);
      throw error;
    }
  }

  /**
   * Search questions across all topics
   */
  public async searchQuestions(query: string): Promise<InterviewQuestion[]> {
    const searchTerm = query.toLowerCase();
    if (!db) {
      return [];
    }
    const q = collection(db, 'interviewQuestions');
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(
        (question: any) =>
          question.question.toLowerCase().includes(searchTerm) ||
          question.tags.some((tag: string) =>
            tag.toLowerCase().includes(searchTerm)
          ) ||
          question.answer.some(
            (answer: any) =>
              answer.type === 'text' &&
              typeof answer.content === 'string' &&
              answer.content.toLowerCase().includes(searchTerm)
          )
      ) as InterviewQuestion[];
  }

  /**
   * Get questions by difficulty level
   */
  public async getQuestionsByDifficulty(
    difficulty: 'easy' | 'medium' | 'hard'
  ): Promise<InterviewQuestion[]> {
    if (!db) {
      return [];
    }
    const q = query(
      collection(db, 'interviewQuestions'),
      where('difficulty', '==', difficulty)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as InterviewQuestion[];
  }
}

// Create and export a singleton instance
export const interviewService = new InterviewService();

export default interviewService;
