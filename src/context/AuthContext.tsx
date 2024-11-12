import { signInWithPopup, onAuthStateChanged, getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore/lite';
import { useRouter } from 'next/navigation';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import { useToast } from '@/hooks/use-toast';

import { db, githubProvider, googleProvider } from '../../lib/firebase';

interface AuthContextType {
  currentUser: any;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: UserInfo, updates: Partial<UserInfo>) => Promise<void>;
}
interface UserInfo {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  has_update?: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, []);

  const saveUser = async (user: UserInfo) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef); // Check if the user exists
    console.log(user, 'user saved');
    const { uid, displayName, email, photoURL, has_update } = user;
    if (!userDoc.exists()) {
      // User doesn't exist, save them
      try {
        await setDoc(userDocRef, {
          uid,
          displayName,
          email,
          photoURL,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          has_update,
        });
        console.log('User saved to Firestore:', user);
      } catch (error) {
        console.error('Error saving user to Firestore:', error);
      }
    } else {
      console.log('User already exists in Firestore');
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setCurrentUser(user);
      const importantUserInfo: UserInfo = {
        uid: user.uid,
        displayName: user.displayName || 'Anonymous',
        email: user.email || 'No Email',
        photoURL: user.photoURL,
        has_update: false,
      };
      localStorage.setItem('user', JSON.stringify(importantUserInfo));

      await saveUser(importantUserInfo);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: error.message,
      });
      console.error('Google Sign In Error:', error);
    }
  };
  const updateUser = async (user: UserInfo, updates: Partial<UserInfo>) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    console.log(user.uid, updates, 'user.uid');
    if (userDoc.exists()) {
      try {
        await updateDoc(userDocRef, {
          ...updates, // Only update the fields that are passed
          updatedAt: new Date().toISOString(),
        });
        console.log('User updated in Firestore:', user);
      } catch (error) {
        console.error('Error updating user in Firestore:', error);
      }
    } else {
      console.log('User does not exist in Firestore');
    }
  };

  const signInWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      const importantUserInfo: UserInfo = {
        uid: user.uid,
        displayName: user.displayName || 'Anonymous',
        email: user.email || 'No Email',
        photoURL: user.photoURL,
        has_update: false,
      };
      localStorage.setItem('user', JSON.stringify(importantUserInfo));
      await saveUser(importantUserInfo);
      setCurrentUser(user);
      console.log('Github User:', user);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: error.message,
      });
      console.error('Github Sign In Error:', error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: error.message,
      });
      console.error('Sign Out Error:', error);
    }
  };

  useEffect(() => {
    setCurrentUser(auth.currentUser);
  }, [auth.currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signInWithGoogle,
        signInWithGithub,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
