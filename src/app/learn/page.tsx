'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import Navbar from '@/components/common/Navbar';
import CourseIcon from '@/components/specific/CourseIcon';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
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
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4">
        <Navbar />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid w-full max-w-6xl flex-1 auto-rows-max gap-4">
            <Card className="border p-4 shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Learn
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Explore all available learning categories and start your
                  coding journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="h-32 bg-gray-100 rounded-lg animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {topics?.map((topic) => (
                      <div
                        key={topic.id}
                        className="flex flex-col items-center p-4 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() =>
                          handleTopicClick(topic.name.toLowerCase(), topic.id)
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleTopicClick(
                              topic.name.toLowerCase(),
                              topic.id
                            );
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Learn ${topic.name}`}
                      >
                        <div className="w-16 h-16 mb-3 flex items-center justify-center">
                          <CourseIcon
                            language={topic.name.toLowerCase()}
                            id={topic.id}
                            size={48}
                          />
                        </div>
                        <span className="text-sm font-medium text-center text-gray-900">
                          {topic.name.replace(/-/g, ' ').replace(/&/g, ' & ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
