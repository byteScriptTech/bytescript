'use client';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import AuthGuard from '@/components/misc/authGuard';
import LanguagesList from '@/components/specific/LanguagesList';
import { LanguagesProvider } from '@/context/LanguagesContext';

import { auth } from '../../../lib/firebase';

const Dashboard = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <AuthGuard>
      <LanguagesProvider>
        <div>
          <LanguagesList />
          <h1>Welcome to the Dashboard</h1>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      </LanguagesProvider>
    </AuthGuard>
  );
};

export default Dashboard;
