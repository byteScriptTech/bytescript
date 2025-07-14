import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export interface Note {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const notesService = {
  async createNote(content: string, uid: string): Promise<Note> {
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
    const querySnapshot = await getDocs(collection(db, `users/${uid}/notes`));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Note[];
  },

  async updateNote(uid: string, id: string, content: string): Promise<void> {
    await updateDoc(doc(db, `users/${uid}/notes`, id), {
      content,
      updatedAt: new Date(),
    });
  },

  async deleteNote(uid: string, id: string): Promise<void> {
    await deleteDoc(doc(db, `users/${uid}/notes`, id));
  },
};
