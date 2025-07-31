import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  orderBy,
} from 'firebase/firestore';

import { db } from '@/config/firebase';
import { PracticeQuestion } from '@/types/practiceQuestion';

export const practiceQuestionsService = {
  // Get all practice questions for a topic
  async getQuestionsByTopicId(topicId: string) {
    const q = query(
      collection(db, 'practice_questions'),
      where('topicId', '==', topicId),
      orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PracticeQuestion[];
  },

  // Get a single question by ID
  async getQuestionById(id: string) {
    const questionDoc = await getDoc(doc(db, 'practice_questions', id));
    if (!questionDoc.exists()) {
      throw new Error('Question not found');
    }
    return { id: questionDoc.id, ...questionDoc.data() } as PracticeQuestion;
  },

  // Get questions by type (mcq or coding)
  async getQuestionsByType(topicId: string, type: 'mcq' | 'coding') {
    const q = query(
      collection(db, 'practice_questions'),
      where('topicId', '==', topicId),
      where('type', '==', type),
      orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PracticeQuestion[];
  },
};
