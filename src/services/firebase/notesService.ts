import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

import { db } from '@/firebase/config';

export interface Note {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const notesService = {
  async createNote(content: string, uid: string): Promise<Note> {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }
    const docRef = await addDoc(collection(db, `users/${uid}/notes`), {
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return {
      id: docRef.id,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },

  async getNotes(uid: string): Promise<Note[]> {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }
    const querySnapshot = await getDocs(collection(db, `users/${uid}/notes`));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Note[];
  },

  async updateNote(uid: string, id: string, content: string): Promise<void> {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }
    await updateDoc(doc(db, `users/${uid}/notes`, id), {
      content,
      updatedAt: new Date(),
    });
  },

  async deleteNote(uid: string, id: string): Promise<void> {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }
    await deleteDoc(doc(db, `users/${uid}/notes`, id));
  },
};
