import { signInWithPopup, onAuthStateChanged, getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore/lite';
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
}
interface UserInfo {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
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
    if (!userDoc.exists()) {
      // User doesn't exist, save them
      try {
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
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
      };

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

  const signInWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      const importantUserInfo: UserInfo = {
        uid: user.uid,
        displayName: user.displayName || 'Anonymous',
        email: user.email || 'No Email',
        photoURL: user.photoURL,
      };
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
