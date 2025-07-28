import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDoc,
} from 'firebase/firestore';

import { db } from '@/firebase/config';

export interface DataStructure {
  id?: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const DATA_STRUCTURES_COLLECTION = 'dataStructures';

export const dataStructuresService = {
  // Get all data structures
  async getAll(): Promise<DataStructure[]> {
    try {
      console.log(
        'Fetching data structures from collection:',
        DATA_STRUCTURES_COLLECTION
      );
      const querySnapshot = await getDocs(
        collection(db, DATA_STRUCTURES_COLLECTION)
      );

      console.log('Query snapshot size:', querySnapshot.size);
      const results = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log('Document data:', { id: doc.id, ...data });
        return {
          id: doc.id,
          ...data,
        };
      }) as DataStructure[];

      console.log('Processed results:', results);
      return results;
    } catch (error) {
      console.error('Error getting data structures:', error);
      throw error;
    }
  },

  // Get a single data structure by ID
  async getById(id: string): Promise<DataStructure | null> {
    try {
      const docRef = doc(db, DATA_STRUCTURES_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as DataStructure;
      }
      return null;
    } catch (error) {
      console.error('Error getting data structure:', error);
      throw error;
    }
  },

  // Create a new data structure
  async create(data: Omit<DataStructure, 'id'>): Promise<DataStructure> {
    try {
      const docRef = await addDoc(collection(db, DATA_STRUCTURES_COLLECTION), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('Error creating data structure:', error);
      throw error;
    }
  },

  // Update an existing data structure
  async update(
    id: string,
    data: Partial<Omit<DataStructure, 'id'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, DATA_STRUCTURES_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating data structure:', error);
      throw error;
    }
  },

  // Delete a data structure
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, DATA_STRUCTURES_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting data structure:', error);
      throw error;
    }
  },

  // Check if a slug is already taken
  async isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, DATA_STRUCTURES_COLLECTION),
        where('slug', '==', slug)
      );

      const querySnapshot = await getDocs(q);

      if (excludeId) {
        return (
          !querySnapshot.empty &&
          !querySnapshot.docs.every((doc) => doc.id === excludeId)
        );
      }

      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking slug:', error);
      throw error;
    }
  },
};
