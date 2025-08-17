'use client';

import React from 'react';

import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import AuthGuard from '@/components/misc/authGuard';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/theme-provider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthGuard>
        <ThemeProvider>
          <div className="flex h-screen bg-background">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <AdminNavbar />
              <main className="flex-1 overflow-y-auto p-6 bg-background">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
