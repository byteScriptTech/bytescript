import { signInWithPopup, onAuthStateChanged, getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import { useToast } from '@/hooks/use-toast';

import { githubProvider, googleProvider } from '../../lib/firebase';

interface AuthContextType {
  currentUser: any;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
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

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setCurrentUser(user);
      console.log('Google User:', user);
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
