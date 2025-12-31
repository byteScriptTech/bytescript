'use client';

import {
  signInWithPopup,
  onAuthStateChanged,
  getAuth,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { db, githubProvider } from '@/firebase/config';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser, setLoading, clearUser } from '@/store/slices/authSlice';
import { AppUser } from '@/store/slices/authSlice';

export const useAuthRedux = () => {
  const dispatch = useAppDispatch();
  const { currentUser, loading, isAdmin } = useAppSelector(
    (state) => state.auth
  );
  const router = useRouter();
  const auth = getAuth();

  const createUserDocument = async (user: AppUser): Promise<AppUser> => {
    if (!user.uid) return user;

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
    const docData = updatedUserDoc.data();
    return {
      ...user,
      ...docData,
      // Exclude Firestore timestamps to avoid Redux serialization issues
      createdAt: docData?.createdAt?.toDate?.() || null,
      updatedAt: docData?.updatedAt?.toDate?.() || null,
      lastLogin: docData?.lastLogin?.toDate?.() || null,
    } as AppUser;
  };

  const signInWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const userWithRole = await createUserDocument(result.user as AppUser);
      dispatch(setUser(userWithRole));
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
      dispatch(clearUser());
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

      dispatch(setLoading(true));

      if (user) {
        const userWithRole = await createUserDocument(user as AppUser);
        dispatch(setUser(userWithRole));
        if (window.location.pathname === '/login') {
          router.push('/dashboard');
        }
      } else {
        dispatch(clearUser());
      }

      dispatch(setLoading(false));
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [auth, router, dispatch]);

  return {
    currentUser,
    loading,
    isAdmin,
    signInWithGithub,
    signOut,
  };
};
