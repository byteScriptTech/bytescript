import { signInWithPopup, onAuthStateChanged, getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'sonner';

import { db, githubProvider } from '@/firebase/config';

export interface AuthContextType {
  currentUser: any;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
}
interface UserInfo {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
}
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

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

  const auth = getAuth();

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!isMounted) return;
      setCurrentUser(user);
      if (user && window.location.pathname === '/login') {
        const urlParams = new URLSearchParams(window.location.search);
        const callbackUrl = urlParams.get('callbackUrl') || '/dashboard';
        router.replace(callbackUrl);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [auth, router]);

  const saveUser = async (user: UserInfo) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
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
      localStorage.setItem('user', JSON.stringify(importantUserInfo));
      await saveUser(importantUserInfo);
      setCurrentUser(user);
      console.log('Github User:', user);
    } catch (error: any) {
      toast.error(error.message);
      console.error('Github Sign In Error:', error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      router.push('/');
    } catch (error: any) {
      toast.error(error.message);
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
        signInWithGithub,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
