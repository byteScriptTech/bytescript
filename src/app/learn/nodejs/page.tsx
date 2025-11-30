'use client';

import React, { Suspense } from 'react';

import Navbar from '@/components/common/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import { ContentProvider } from '@/context/ContentContext';
import { LanguagesProvider } from '@/context/LanguagesContext';
import { LocalStorageProvider } from '@/context/LocalhostContext';

import LearnContentWrapper from './components/LearnContentWrapper';

export const dynamic = 'force-dynamic';

function LearnNodejsPageContent() {
  return <LearnContentWrapper />;
}

export default function LearnNodejsPage() {
  return (
    <AuthProvider>
      <LocalStorageProvider>
        <LanguagesProvider>
          <ContentProvider>
            <div className="flex min-h-screen w-full flex-col bg-background">
              <div className="flex flex-col flex-1">
                <Navbar />
                <main className="flex-1">
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    }
                  >
                    <LearnNodejsPageContent />
                  </Suspense>
                </main>
              </div>
            </div>
          </ContentProvider>
        </LanguagesProvider>
      </LocalStorageProvider>
    </AuthProvider>
  );
}
