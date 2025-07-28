'use client';

import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React from 'react';

import UserDropDown from '@/components/specific/UserDropDown';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/firebase/config';

export function AdminNavbar() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleMyAccountClick = () => {
    router.push('/my-account');
  };

  const handleSettingsClick = () => {
    router.push('/settings');
  };

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>

          {currentUser && (
            <div className="flex items-center gap-3">
              <UserDropDown
                {...{
                  handleSignOut,
                  handleMyAccountClick,
                  handleSettingsClick,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
