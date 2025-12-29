'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { useAuthRedux } from '@/hooks/useAuthRedux';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const { currentUser, loading, isAdmin } = useAuthRedux();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push('/login');
      } else if (requireAdmin && !isAdmin) {
        router.push('/');
      }
    }
  }, [currentUser, loading, isAdmin, requireAdmin, router]);

  if (loading || !currentUser || (requireAdmin && !isAdmin)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300">
            {!currentUser ? 'Authenticating...' : 'Checking permissions...'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute requireAdmin>{children}</ProtectedRoute>
);
