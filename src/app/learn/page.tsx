'use client';

import React from 'react';

import Navbar from '@/components/common/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import { LanguagesProvider } from '@/context/LanguagesContext';
import { LocalStorageProvider } from '@/context/LocalhostContext';

import LearnContent from './LearnContent';

export const dynamic = 'force-dynamic';

export default function Learn() {
  return (
    <AuthProvider>
      <LocalStorageProvider>
        <LanguagesProvider>
          <div className="flex min-h-screen w-full flex-col bg-background">
            <div className="flex flex-col flex-1">
              <Navbar />
              <main className="flex-1">
                <LearnContent />
              </main>
            </div>
          </div>
        </LanguagesProvider>
      </LocalStorageProvider>
    </AuthProvider>
  );
}
