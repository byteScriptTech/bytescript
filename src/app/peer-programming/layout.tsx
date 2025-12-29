'use client';

import React from 'react';

import Navbar from '@/components/common/Navbar';
import AuthGuard from '@/components/misc/authGuard';

export default function PeerProgrammingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </AuthGuard>
  );
}
