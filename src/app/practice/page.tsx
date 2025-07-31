'use client';

import React, { useState } from 'react';

import Navbar from '@/components/common/Navbar';
import AuthGuard from '@/components/misc/authGuard';
import PracticeContent from '@/components/specific/PracticeContent';
import { AuthProvider } from '@/context/AuthContext';
import { LanguagesProvider } from '@/context/LanguagesContext';
import { LocalStorageProvider } from '@/context/LocalhostContext';
import { PracticeProvider } from '@/context/PracticeContext';
import { PracticeTopic } from '@/types/practice';

export const dynamic = 'force-dynamic';

export default function Practice() {
  const [currentTopic, setCurrentTopic] = useState<PracticeTopic | undefined>(
    undefined
  );
  const [category, setCategory] = useState<string>('problems');

  return (
    <AuthProvider>
      <LocalStorageProvider>
        <LanguagesProvider>
          <PracticeProvider>
            <AuthGuard>
              <div className="flex min-h-screen w-full flex-col bg-background">
                <div className="flex flex-col flex-1">
                  <Navbar />
                  <main className="flex-1">
                    <div className="container mx-auto py-8 px-4">
                      <h1 className="text-3xl font-bold mb-6">Practice</h1>
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/4">
                          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
                            <h2 className="text-lg font-semibold mb-3">
                              Categories
                            </h2>
                            <div className="space-y-2">
                              {['problems', 'dsa', 'javascript', 'python'].map(
                                (cat) => (
                                  <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`w-full text-left px-3 py-2 rounded capitalize ${
                                      category === cat
                                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                  >
                                    {cat}
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="w-full md:w-3/4">
                          <PracticeContent
                            currentTopic={currentTopic}
                            setCurrentTopic={setCurrentTopic}
                            category={category}
                          />
                        </div>
                      </div>
                    </div>
                  </main>
                </div>
              </div>
            </AuthGuard>
          </PracticeProvider>
        </LanguagesProvider>
      </LocalStorageProvider>
    </AuthProvider>
  );
}
