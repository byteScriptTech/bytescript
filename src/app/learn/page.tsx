'use client';

import React from 'react';

import Navbar from '@/components/common/Navbar';
import { LocalStorageProvider } from '@/context/LocalhostContext';

import LearnContent from './LearnContent';

export const dynamic = 'force-dynamic';

export default function Learn() {
  return (
    <LocalStorageProvider>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          <LearnContent />
        </main>
      </div>
    </LocalStorageProvider>
  );
}
