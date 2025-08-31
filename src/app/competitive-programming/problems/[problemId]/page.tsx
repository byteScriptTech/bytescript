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
            <div className="min-h-screen bg-background flex flex-col">
              <Navbar />
              <main className="flex-1 container mx-auto px-4 py-8">
                <div>
                  <ProblemPageContent />
                </div>
              </main>
            </div>
          </LocalStorageProvider>
        </LanguagesProvider>
      </ContentProvider>
    </AuthProvider>
  );
}
