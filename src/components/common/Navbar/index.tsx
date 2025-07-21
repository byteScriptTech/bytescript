import { signOut } from 'firebase/auth';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import Logo from '@/components/common/Logo';
import UserDropDown from '@/components/specific/UserDropDown';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/firebase/config';

const Navbar = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [canGoBack, setCanGoBack] = React.useState(false);
  const [canGoForward, setCanGoForward] = React.useState(false);

  React.useEffect(() => {
    setCanGoBack(window.history.length > 1);
    setCanGoForward(window.history.state?.forward !== null);
  }, []);

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
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background p-3 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-4">
      <div className="flex items-center gap-3 sm:gap-4">
        <Logo />
        <Link href="/dashboard">
          <Button
            size="sm"
            className="px-2 h-8 bg-muted text-dark hover:bg-gray-300 transition-colors"
          >
            Go to Dashboard
          </Button>
        </Link>
        <button
          onClick={() => {
            window.history.back();
          }}
          className="p-2 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canGoBack}
          aria-label="Go back"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            window.history.forward();
          }}
          className="p-2 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canGoForward}
          aria-label="Go forward"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      {currentUser && (
        <div className="flex items-center gap-3 sm:gap-4">
          <UserDropDown
            {...{
              handleSignOut,
              handleMyAccountClick,
              handleSettingsClick,
            }}
          />
        </div>
      )}
    </header>
  );
};

export default Navbar;
