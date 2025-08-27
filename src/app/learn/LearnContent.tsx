'use client';

import React, { Suspense } from 'react';

import { LearnTopicCard } from '@/components/specific/LearnTopicCard';
import { useTopics } from '@/hooks/useTopics';
import { Topic } from '@/types/content';

// Extend the base Topic type with additional properties for the UI
type ExtendedTopic = Omit<Topic, 'difficulty'> & {
  progress?: number;
  rating?: number;
  category?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | string;
};

function LearnContentInner() {
  const { topics, loading } = useTopics();
  const filteredTopics = (topics as ExtendedTopic[]) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Spacer */}
      <div className="h-16"></div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 sm:py-16 max-w-7xl">
        {/* All Topics */}
        <div>
          <h2 className="text-2xl font-bold mb-6">All Learning Paths</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-muted/20 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredTopics?.map((topic) => (
                <div key={topic.id} className="relative group">
                  <div className="h-full bg-card rounded-xl border border-border transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)]">
                    <LearnTopicCard topic={topic} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
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
