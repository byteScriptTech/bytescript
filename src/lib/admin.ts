import { User as FirebaseUser } from 'firebase/auth';

import { adminDb } from './firebase-admin';

export type UserRole = 'admin' | 'user';

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

/**
 * Get user data from Firestore
 */
export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) return null;
    return { uid: userId, ...userDoc.data() } as UserData;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Update user role
 */
export const updateUserRole = async (
  userId: string,
  role: UserRole
): Promise<boolean> => {
  try {
    await adminDb.collection('users').doc(userId).set(
      {
        role,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
};

/**
 * Check if a user is an admin
 */
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  const userData = await getUserData(userId);
  return userData?.role === 'admin';
};

/**
 * Get all admin users
 */
export const getAdminUsers = async (): Promise<UserData[]> => {
  try {
    const snapshot = await adminDb
      .collection('users')
      .where('role', '==', 'admin')
      .get();

    return snapshot.docs.map(
      (doc) =>
        ({
          uid: doc.id,
          ...doc.data(),
        }) as UserData
    );
  } catch (error) {
    console.error('Error getting admin users:', error);
    return [];
  }
};

/**
 * Create or update a user in Firestore
 */
export const createOrUpdateUser = async (user: FirebaseUser) => {
  const userRef = adminDb.collection('users').doc(user.uid);
  const userDoc = await userRef.get();

  const userData: Partial<UserData> = {
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    updatedAt: new Date().toISOString(),
  };

  if (!userDoc.exists) {
    // New user - set default role
    await userRef.set({
      ...userData,
      role: 'user',
      createdAt: new Date().toISOString(),
    });
  } else {
    // Existing user - update last login
    await userRef.update(userData);
  }

  return {
    ...user,
    ...(userDoc.data() || {}),
    ...userData,
  } as UserData & FirebaseUser;
};
