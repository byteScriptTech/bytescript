'use client';

import React from 'react';

import { AuthProvider } from '@/context/AuthContext';
import { ContentProvider } from '@/context/ContentContext';
import { LanguagesProvider } from '@/context/LanguagesContext';
import { LocalStorageProvider } from '@/context/LocalhostContext';
import { NotesProvider } from '@/context/NotesContext';

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <LocalStorageProvider>
        <LanguagesProvider>
          <ContentProvider>
            <NotesProvider>{children}</NotesProvider>
          </ContentProvider>
        </LanguagesProvider>
      </LocalStorageProvider>
    </AuthProvider>
  );
}
