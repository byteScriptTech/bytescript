import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '@/config/firebase';
import { toast } from '@/hooks/use-toast';
import { PracticeQuestion } from '@/types/practiceQuestion';

export const practiceQuestionsService = {
  // Get all practice questions
  async getAllQuestions() {
    const q = query(
      collection(db, 'practice_questions'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PracticeQuestion[];
  },

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

  // Create a new practice question
  async createQuestion(
    questionData: Omit<PracticeQuestion, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    const now = serverTimestamp();
    const docRef = await addDoc(collection(db, 'practice_questions'), {
      ...questionData,
      createdAt: now,
      updatedAt: now,
    });
    return { id: docRef.id, ...questionData } as PracticeQuestion;
  },

  // Update an existing practice question
  async updateQuestion(id: string, updates: Partial<PracticeQuestion>) {
    try {
      const now = serverTimestamp();
      const questionRef = doc(db, 'practice_questions', id);
      await updateDoc(questionRef, {
        ...updates,
        updatedAt: now,
      });
      const updatedQuestion = await this.getQuestionById(id);
      toast({
        title: 'Success',
        description: 'Question updated successfully',
        variant: 'default',
      });
      return updatedQuestion;
    } catch (error) {
      console.error('Error updating question:', error);
      toast({
        title: 'Error',
        description: 'Failed to update question',
        variant: 'destructive',
      });
      throw error;
    }
  },

  // Delete a practice question
  async deleteQuestion(id: string) {
    try {
      await deleteDoc(doc(db, 'practice_questions', id));
      toast({
        title: 'Success',
        description: 'Question deleted successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete question',
        variant: 'destructive',
      });
      throw error;
    }
  },
};
