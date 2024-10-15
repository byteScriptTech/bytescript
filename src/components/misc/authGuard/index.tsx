import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';

import { auth } from '../../../../lib/firebase';

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="rounded-md h-12 w-12 border-4 border-t-4 border-[#E5E7EB] animate-spin absolute"></div>
      </div>
    );

  return <>{children}</>;
};

export default AuthGuard;
