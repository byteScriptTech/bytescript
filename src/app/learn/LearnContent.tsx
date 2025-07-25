'use client';

import React, { Suspense } from 'react';

import { LearnTopicCard } from '@/components/specific/LearnTopicCard';
import { useTopics } from '@/hooks/useTopics';

function LearnContentInner() {
  const { topics, loading } = useTopics();
  return (
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
              className="group relative flex flex-col items-center p-6 rounded-xl border border-border bg-card/90 shadow-sm"
            >
              <div className="w-16 h-16 rounded-full bg-muted/80 dark:bg-muted/60 animate-pulse mb-4" />
              <div className="h-6 w-3/4 bg-muted/80 dark:bg-muted/60 animate-pulse rounded-md mb-2" />
              <div className="h-4 w-1/2 bg-muted/80 dark:bg-muted/60 animate-pulse rounded-md" />
            </div>
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
  );
}

export default function LearnContent() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <LearnContentInner />
    </Suspense>
  );
}
