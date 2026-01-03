'use client';

import {
  signInWithPopup,
  onAuthStateChanged,
  getAuth,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

import { db, githubProvider } from '../firebase/config';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setUser,
  setLoading,
  clearUser,
  AppUser,
} from '../store/slices/authSlice';

export const useAuthRedux = () => {
  const dispatch = useAppDispatch();
  const { currentUser, loading, isAdmin } = useAppSelector(
    (state) => state.auth
  );
  const router = useRouter();
  const auth = getAuth();

  const createUserDocument = useCallback(
    async (user: AppUser): Promise<AppUser> => {
      if (!user.uid) return user;

      if (!db) {
        throw new Error('Firestore not initialized');
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
      const docData = updatedUserDoc.data();
      const serializableUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
        tenantId: user.tenantId,
        providerData: user.providerData,
        phoneNumber: user.phoneNumber || null,
        providerId: user.providerId || null,
        ...docData,
        // Convert all Firestore Timestamps to ISO strings
        createdAt: docData?.createdAt
          ? docData.createdAt.toDate
            ? docData.createdAt.toDate().toISOString()
            : docData.createdAt
          : null,
        updatedAt: docData?.updatedAt
          ? docData.updatedAt.toDate
            ? docData.updatedAt.toDate().toISOString()
            : docData.updatedAt
          : null,
        lastLogin: docData?.lastLogin
          ? docData.lastLogin.toDate
            ? docData.lastLogin.toDate().toISOString()
            : docData.lastLogin
          : null,
        proactiveRefresh: undefined,
        metadata: {
          creationTime: user.metadata?.creationTime || '',
          lastSignInTime: user.metadata?.lastSignInTime || '',
        },
        refreshToken: user.refreshToken || '',
      } as AppUser;
      return serializableUser;
    },
    []
  );

  const signInWithGithub = async () => {
    try {
      if (!githubProvider) {
        throw new Error('GitHub provider not initialized');
      }
      const result = await signInWithPopup(auth, githubProvider);
      const userWithRole = await createUserDocument(result.user as AppUser);
      // userWithRole already has serializable string properties
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
        try {
          const userWithRole = await createUserDocument(user as AppUser);
          if (isMounted) {
            // userWithRole already has serializable string properties
            dispatch(setUser(userWithRole));
            if (window.location.pathname === '/login') {
              router.push('/dashboard');
            }
          }
        } catch (error) {
          console.error('Error creating user document:', error);
          if (isMounted) {
            dispatch(clearUser());
          }
        }
      } else {
        dispatch(clearUser());
      }

      if (isMounted) {
        dispatch(setLoading(false));
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [auth, router, dispatch, createUserDocument]);

  return {
    currentUser,
    loading,
    isAdmin,
    signInWithGithub,
    signOut,
  };
};
