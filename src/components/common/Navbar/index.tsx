import { signOut } from 'firebase/auth';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import Logo from '@/components/common/Logo';
import UserDropDown from '@/components/specific/UserDropDown';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/firebase/config';

// Navigation Link Component
const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link href={href}>
    <Button
      variant="ghost"
      className="px-3 h-8 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      {children}
    </Button>
  </Link>
);

// Mobile Navigation Link Component
interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const MobileNavLink = ({
  href,
  children,
  onClick,
  className,
}: MobileNavLinkProps) => (
  <Link
    href={href}
    className={`block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors ${className}`}
    onClick={onClick}
  >
    {children}
  </Link>
);

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
            <div className="relative group">
              <NavLink href="/learn">Learn</NavLink>
              <div className="absolute left-0 mt-1 w-48 bg-popover border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link
                    href="/learn"
                    className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    All Topics
                  </Link>
                  <Link
                    href="/learn/python"
                    className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    Python
                  </Link>
                  <Link
                    href="/learn/javascript"
                    className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    JavaScript
                  </Link>
                </div>
              </div>
            </div>
            <NavLink href="/practice">Practice</NavLink>
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
        className={`w-full sm:hidden overflow-hidden transition-all duration-200 ${
          isMobileMenuOpen ? 'max-h-48' : 'max-h-0'
        }`}
      >
        <div className="p-3 space-y-3 border-t">
          {/* Menu Items */}
          <div className="space-y-1">
            <MobileNavLink
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </MobileNavLink>
            <div className="pl-4">
              <MobileNavLink
                href="/learn"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Topics
              </MobileNavLink>
              <MobileNavLink
                href="/learn/python"
                onClick={() => setIsMobileMenuOpen(false)}
                className="pl-6"
              >
                Python
              </MobileNavLink>
            </div>
            <MobileNavLink
              href="/practice"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Practice
            </MobileNavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
