import Link from 'next/link';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

interface LandingPageHeaderProps {
  handleExploreBiteScriptClick: () => void;
}

const LandingPageHeader = ({
  handleExploreBiteScriptClick,
}: LandingPageHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItems = [
    { text: 'Learn', href: '/learn' },
    { text: 'Practice', href: '/practice' },
    { text: 'Community', href: '/community' },
    { text: 'Editor', href: '/editor' },
  ];

  return (
    <header className="border-b border-solid border-b-[#f0f2f4]">
      <div
        data-testid="header-container"
        className="flex items-center justify-between px-4 py-3 sm:px-10 sm:py-3"
      >
        <Link
          href="/"
          className="flex items-center gap-4 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div>
            <span className="text-md sm:text-md text-black font-bold">
              bite
            </span>
            <span className="text-[#00BFA6] text-base sm:text-xl font-bold">
              Script.
            </span>
          </div>
        </Link>
        <div
          data-testid="header-menu-container"
          className="flex flex-1 justify-end gap-8 sm:gap-4"
          role="navigation"
        >
          <div
            data-testid="header-menu"
            className="hidden sm:flex items-center gap-9"
          >
            {menuItems.map((item) => (
              <a
                key={item.href}
                className="text-[#111418] text-sm font-medium leading-normal hover:text-[#00BFA6] transition-colors"
                href={item.href}
              >
                {item.text}
              </a>
            ))}
          </div>
          <Button
            onClick={handleExploreBiteScriptClick}
            className="hidden sm:flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden h-10 px-4 bg-[#00BFA6] hover:bg-[#00A38C] text-white text-sm font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">Get Started</span>
          </Button>
          <button
            data-testid="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? 'M6 18L18 6M6 6l12 12'
                    : 'M4 6h16M4 12h16M4 18h16'
                }
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        data-testid="mobile-menu"
        className={`sm:hidden fixed top-0 left-0 right-0 bottom-0 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-md text-black font-bold">bite</span>
              <span className="text-[#00BFA6] text-base font-bold">
                Script.
              </span>
            </div>
            <button
              data-testid="mobile-menu-close"
              aria-label="Close navigation menu"
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-[#111418] text-lg font-medium leading-normal hover:text-[#00BFA6] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.text}
              </a>
            ))}
            <Button
              onClick={handleExploreBiteScriptClick}
              className="w-full mt-4 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden h-10 px-4 bg-[#00BFA6] hover:bg-[#00A38C] text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Get Started</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingPageHeader;
