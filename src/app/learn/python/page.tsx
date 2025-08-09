'use client';

import React from 'react';

import Navbar from '@/components/common/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import { ContentProvider } from '@/context/ContentContext';
import { LanguagesProvider } from '@/context/LanguagesContext';
import { LocalStorageProvider } from '@/context/LocalhostContext';

import PythonLearnContent from './PythonLearnContent';

export const dynamic = 'force-dynamic';

export default function PythonLearnPage() {
  return (
    <AuthProvider>
      <LocalStorageProvider>
        <LanguagesProvider>
          <ContentProvider>
            <div className="flex min-h-screen w-full flex-col bg-background">
              <div className="flex flex-col flex-1">
                <Navbar />
                <main className="flex-1">
                  <PythonLearnContent />
                </main>
              </div>
            </div>
          </ContentProvider>
        </LanguagesProvider>
      </LocalStorageProvider>
    </AuthProvider>
  );
}
