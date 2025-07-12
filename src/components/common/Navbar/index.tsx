import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React from 'react';

import { auth } from '@/../../lib/firebase';
import Logo from '@/components/common/Logo';
import UserDropDown from '@/components/specific/UserDropDown';

const Navbar = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };
  const handleMyAccountClick = () => {
    router.push('my-account');
  };
  const handleSettingsClick = () => {
    router.push('settings');
  };
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Logo />
      <div className="flex items-center">
        <UserDropDown
          {...{
            handleSignOut,
            handleMyAccountClick,
            handleSettingsClick,
          }}
        />
      </div>
    </header>
  );
};

export default Navbar;
