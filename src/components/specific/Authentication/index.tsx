'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';

import { useAuth } from '@/context/AuthContext';

const Authentication = () => {
  const [error, setError] = useState<string | null>(null);
  const { signInWithGithub } = useAuth();

  const handleGithubLogin = async () => {
    try {
      await signInWithGithub();
    } catch (error: any) {
      setError('Failed to sign in with GitHub');
    }
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#111418] dark group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <header className="border-b border-solid border-border bg-background">
          <div className="flex items-center justify-between px-3 py-3 sm:px-8 sm:py-3">
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
          </div>
        </header>
        <div className="px-4 sm:px-40 flex flex-1 justify-center items-center">
          <div className="layout-content-container flex flex-col w-full max-w-[512px] py-4 sm:py-5 justify-center items-center">
            {error && <p className="text-red-500">{error}</p>}
            <h2 className="text-white tracking-light text-[28px] font-semibold leading-tight px-4 text-center pb-3 pt-5">
              Sign in to byteScript
            </h2>
            <div className="flex px-4 py-3 justify-center">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#283039] text-white gap-2 pl-4 text-sm font-bold leading-normal tracking-[0.015em]"
                onClick={handleGithubLogin}
              >
                <div
                  className="text-white"
                  data-icon="GithubLogo"
                  data-size="20px"
                  data-weight="regular"
                  data-testid="github-logo"
                >
                  <FaGithub size={23} />
                </div>
                <span className="truncate">Sign in with GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
