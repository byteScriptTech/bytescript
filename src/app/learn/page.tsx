'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import Navbar from '@/components/common/Navbar';
import CourseIcon from '@/components/specific/CourseIcon';
import { useTopics } from '@/hooks/useTopics';

export const dynamic = 'force-dynamic';

export default function LearnPage() {
  const { topics, loading } = useTopics();
  const router = useRouter();

  const handleTopicClick = (name: string, id: string) => {
    if (name === 'competitive-programming') {
      router.push('/competitive-programming');
    } else if (name === 'data-structures-&-algorithms') {
      router.push('/data-structures');
    } else {
      router.push(`/language?name=${name}&id=${id}`);
    }
  };

  return (
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
                  <div
                    key={topic.id}
                    className="group relative flex flex-col items-center p-6 rounded-xl border border-border bg-card hover:bg-card/80 transition-colors cursor-pointer shadow-sm hover:shadow-md"
                    onClick={() =>
                      handleTopicClick(topic.name.toLowerCase(), topic.id)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleTopicClick(topic.name.toLowerCase(), topic.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Learn ${topic.name}`}
                  >
                    <div className="mb-4 w-16 h-16 flex items-center justify-center rounded-lg bg-muted/50 p-2 group-hover:bg-muted transition-colors">
                      <CourseIcon
                        language={topic.name.toLowerCase()}
                        id={topic.id}
                        size={40}
                      />
                    </div>
                    <h3 className="text-base font-medium text-center text-foreground group-hover:text-primary transition-colors">
                      {topic.name.replace(/-/g, ' ').replace(/&/g, ' & ')}
                    </h3>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Start learning
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
