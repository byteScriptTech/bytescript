'use client';

import { signOut } from 'firebase/auth';
import { ArrowLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

import UserDropDown from '@/components/specific/UserDropDown';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/firebase/config';

export function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser } = useAuth();

  const isDashboard = pathname === '/admin';

  const handleBack = () => {
    router.back();
  };

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
            {!isDashboard && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="mr-2"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-xl font-bold text-gray-900">
              {isDashboard ? 'Admin Panel' : 'Back to Dashboard'}
            </h1>
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
