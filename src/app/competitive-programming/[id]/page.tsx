'use client';

import Navbar from '@/components/common/Navbar';
import ProblemPageContent from '@/components/specific/ProblemPageContent';
import { AuthProvider } from '@/context/AuthContext';
import { ContentProvider } from '@/context/ContentContext';
import { LanguagesProvider } from '@/context/LanguagesContext';
import { LocalStorageProvider } from '@/context/LocalhostContext';

export default function ProblemPage() {
  return (
    <AuthProvider>
      <ContentProvider>
        <LanguagesProvider>
          <LocalStorageProvider>
            <Navbar />
            <ProblemPageContent />
          </LocalStorageProvider>
        </LanguagesProvider>
      </ContentProvider>
    </AuthProvider>
  );
}
