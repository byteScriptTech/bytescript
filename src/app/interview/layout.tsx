'use client';
import { ReactNode } from 'react';

import { Navbar } from '@/components/common/Navbar/Navbar';
import { AuthProvider } from '@/context/AuthContext';

export default function InterviewLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </AuthProvider>
  );
}
