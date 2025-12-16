import {
  signInWithPopup,
  onAuthStateChanged,
  getAuth,
  User,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
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

export type UserRole = 'admin' | 'user';

export interface AppUser extends User {
  role?: UserRole;
}

export interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
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
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();
  const createUserDocument = async (user: User) => {
    if (!user.uid) return user;
    if (!db) {
      console.warn('Firestore not initialized');
      return user;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: 'user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(
        userDocRef,
        {
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    const updatedUserDoc = await getDoc(userDocRef);
    return {
      ...user,
      ...updatedUserDoc.data(),
    } as AppUser;
  };

  const signInWithGithub = async () => {
    try {
      if (!auth || !githubProvider) {
        toast.error('Authentication is not configured');
        return;
      }
      const result = await signInWithPopup(auth, githubProvider);
      const userWithRole = await createUserDocument(result.user);
      setCurrentUser(userWithRole);
      toast.success('Signed in successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
      toast.error('Failed to sign in with GitHub');
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      toast.success('Signed out successfully!');
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;

      if (user) {
        const userWithRole = await createUserDocument(user);
        setCurrentUser(userWithRole);
        if (window.location.pathname === '/login') {
          router.push('/dashboard');
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [auth, router]);

  const authValue = {
    currentUser,
    loading,
    isAdmin: currentUser?.role === 'admin',
    signInWithGithub,
    signOut,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};
