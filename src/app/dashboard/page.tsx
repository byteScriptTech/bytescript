'use client';
import * as React from 'react';

import Navbar from '@/components/common/Navbar';
import SideBar from '@/components/common/Sidebar';
import AuthGuard from '@/components/misc/authGuard';
import LanguagesList from '@/components/specific/LanguagesList';
import { LanguagesProvider } from '@/context/LanguagesContext';

function Dashboard() {
  return (
    <AuthGuard>
      <LanguagesProvider>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <SideBar />
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <Navbar />
            <LanguagesList />
          </div>
        </div>
      </LanguagesProvider>
    </AuthGuard>
  );
}

export default Dashboard;
