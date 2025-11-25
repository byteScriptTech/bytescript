import { signOut } from 'firebase/auth';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import Logo from '@/components/common/Logo';
import UserDropDown from '@/components/specific/UserDropDown';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/firebase/config';

// Navigation Link Component
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  activeClassName?: string;
}

const NavLink = ({ href, children }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={`px-3 h-8 text-sm font-medium transition-all duration-300 ${
          isActive
            ? 'text-teal-600 hover:bg-transparent hover:text-teal-600'
            : 'text-foreground hover:bg-accent hover:text-accent-foreground'
        }`}
      >
        {children}
      </Button>
    </Link>
  );
};

// Mobile Navigation Link Component
interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  activeClassName?: string;
}

const MobileNavLink = ({
  href,
  children,
  onClick,
  className = '',
  activeClassName = 'text-teal-600 dark:text-teal-400',
}: MobileNavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`w-full flex items-center px-4 py-2.5 rounded-lg transition-all duration-300 text-base font-medium ${
        isActive ? `${activeClassName}` : 'text-foreground hover:bg-accent'
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

// Navigation Controls Component
const NavigationControls = ({
  canGoBack,
  canGoForward,
}: {
  canGoBack: boolean;
  canGoForward: boolean;
}) => (
  <div className="flex items-center gap-1">
    <button
      onClick={() => window.history.back()}
      className="p-2 rounded-md hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!canGoBack}
      aria-label="Go back"
    >
      <ChevronLeft className="h-4 w-4" />
    </button>
    <button
      onClick={() => window.history.forward()}
      className="p-2 rounded-md hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!canGoForward}
      aria-label="Go forward"
    >
      <ChevronRight className="h-4 w-4" />
    </button>
  </div>
);

const Navbar = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
    setCanGoForward(window.history.state?.forward !== null);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleSettingsClick = () => {
    router.push('/settings');
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background transition-shadow duration-200 ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      {/* Desktop Navigation - Keep original layout */}
      <div className="hidden sm:flex items-center justify-between px-3 py-3 sm:px-8 sm:py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="text-md sm:text-lg font-bold text-foreground">
              byte
            </span>
            <span className="text-[#00BFA6] text-base sm:text-xl font-bold">
              Script.
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/learn">Learn</NavLink>
            <NavLink href="/practice">Practice</NavLink>
            <NavLink href="/peer-programming">Peer Programming</NavLink>
            <NavigationControls
              canGoBack={canGoBack}
              canGoForward={canGoForward}
            />
          </div>
        </div>

        <div className="flex items-center">
          {currentUser && (
            <UserDropDown
              handleSignOut={handleSignOut}
              handleSettingsClick={handleSettingsClick}
              userId={currentUser?.uid}
            />
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center">
            <Logo />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 mr-1">
              <NavigationControls
                canGoBack={canGoBack}
                canGoForward={canGoForward}
              />
            </div>

            {currentUser && (
              <div className="ml-1">
                <UserDropDown
                  handleSignOut={handleSignOut}
                  handleSettingsClick={handleSettingsClick}
                  userId={currentUser?.uid}
                />
              </div>
            )}

            <button
              className="p-2 rounded-md hover:bg-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`w-full sm:hidden overflow-hidden transition-all duration-300 ease-in-out bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
          isMobileMenuOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <nav className="px-4 py-3 border-t border-border/40">
          <ul className="space-y-2">
            {[
              { href: '/dashboard', label: 'Dashboard' },
              { href: '/learn', label: 'Learn' },
              { href: '/practice', label: 'Practice' },
              { href: '/peer-programming', label: 'Peer Programming' },
            ].map((item) => (
              <li key={item.href}>
                <MobileNavLink
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200"
                  activeClassName="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                >
                  {item.label}
                </MobileNavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
