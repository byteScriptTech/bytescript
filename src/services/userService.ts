import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';

export interface UserData {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string | null;
  createdAt?: any;
  updatedAt?: any;
}

const userService = {
  // Get user by ID
  getUser: async (userId: string): Promise<UserData | null> => {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return {
          uid: userDoc.id,
          displayName: userDoc.data().displayName || '',
          email: userDoc.data().email || '',
          photoURL: userDoc.data().photoURL || null,
          createdAt: userDoc.data().createdAt,
          updatedAt: userDoc.data().updatedAt,
        } as UserData;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (
    userId: string,
    userData: Partial<UserData>
  ): Promise<void> => {
    if (!db) {
      throw new Error('Firebase is not initialized');
    }
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
};

export default userService;
