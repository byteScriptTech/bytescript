import { onAuthStateChanged } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';

import { auth } from '@/firebase/config';

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string; // Optional redirect path for unauthenticated users
  requireAuth?: boolean; // Whether to require authentication (default: true)
}

const AuthGuard = ({
  children,
  redirectTo = '/login',
  requireAuth = true,
}: AuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (requireAuth && !user) {
        // User is not authenticated and auth is required
        router.push(redirectTo);
      } else if (!requireAuth && user && pathname === '/login') {
        // User is authenticated but on login page, redirect to dashboard
        router.push('/dashboard');
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router, redirectTo, requireAuth, pathname]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="rounded-md h-12 w-12 border-4 border-t-4 border-[#E5E7EB] animate-spin absolute"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
