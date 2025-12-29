'use client';
import { ReactNode } from 'react';

import { Navbar } from '@/components/common/Navbar/Navbar';

export default function InterviewLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
