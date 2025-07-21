'use client';

import React from 'react';

import Navbar from '@/components/common/Navbar';
import { LearnTopicCard } from '@/components/specific/LearnTopicCard';
import { AuthProvider } from '@/context/AuthContext';
import { ContentProviderClient } from '@/context/ContentProviderClient';
import { LanguagesProvider } from '@/context/LanguagesContext';
import { LocalStorageProvider } from '@/context/LocalhostContext';
import { useTopics } from '@/hooks/useTopics';

export const dynamic = 'force-dynamic';

export default function Learn() {
  const { topics, loading } = useTopics();

  return (
    <AuthProvider>
      <LocalStorageProvider>
        <LanguagesProvider>
          <ContentProviderClient>
            <div className="flex min-h-screen w-full flex-col bg-background">
              <div className="flex flex-col flex-1">
                <Navbar />
                <main className="flex-1">
                  <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="mb-8 text-center sm:text-left">
                      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                        Learn to Code
                      </h1>
                      <p className="mt-2 text-lg text-muted-foreground">
                        Choose a language or topic to start your coding journey
                      </p>
                    </div>

                    {loading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="h-40 rounded-lg bg-muted/50 animate-pulse"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {topics?.map((topic) => (
                          <LearnTopicCard key={topic.id} topic={topic} />
                        ))}
                      </div>
                    )}
                  </div>
                </main>
              </div>
            </div>
          </ContentProviderClient>
        </LanguagesProvider>
      </LocalStorageProvider>
    </AuthProvider>
  );
}
