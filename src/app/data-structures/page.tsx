'use client';

import Link from 'next/link';
import React from 'react';

import Navbar from '@/components/common/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthProvider } from '@/context/AuthContext';
import { LanguagesProvider } from '@/context/LanguagesContext';
import { LocalStorageProvider } from '@/context/LocalhostContext';
import { dsaService } from '@/services/firebase/dsaService';

export const dynamic = 'force-dynamic'; // Disable static generation

interface DSATopic {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'data-structures' | 'algorithms';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  content?: string;
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function DataStructuresPage() {
  const [topics, setTopics] = React.useState<DSATopic[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const data = (await dsaService.getAllTopics()) as DSATopic[];
        setTopics(data);
      } catch (err) {
        console.error('Error fetching topics:', err);
        setError('Failed to load topics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const dataStructures = topics.filter(
    (topic) => topic.category === 'data-structures'
  );
  const algorithms = topics.filter((topic) => topic.category === 'algorithms');

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading topics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const renderTopicCards = (topicList: DSATopic[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topicList.map((topic) => (
        <Card
          key={topic.id}
          className="h-full flex flex-col hover:shadow-lg transition-shadow"
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {topic.title}
              {topic.difficulty && (
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    topic.difficulty === 'beginner'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : topic.difficulty === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {topic.difficulty.charAt(0).toUpperCase() +
                    topic.difficulty.slice(1)}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <p className="text-muted-foreground mb-6 flex-1">
              {topic.description || 'No description available.'}
            </p>
            <Button asChild className="mt-auto w-full">
              <Link href={`/data-structures/${topic.slug}`}>
                Start Learning →
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <AuthProvider>
      <LocalStorageProvider>
        <LanguagesProvider>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Button variant="ghost" asChild className="mb-6">
                <Link href="/learn" className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                  Back to Learn
                </Link>
              </Button>

              <h1 className="text-3xl font-bold mb-8">
                Data Structures & Algorithms
              </h1>

              <div className="space-y-12">
                {dataStructures.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">
                      Data Structures
                    </h2>
                    {renderTopicCards(dataStructures)}
                  </section>
                )}

                {algorithms.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">
                      Algorithms
                    </h2>
                    {renderTopicCards(algorithms)}
                  </section>
                )}

                {topics.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No topics available at the moment.
                    </p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </LanguagesProvider>
      </LocalStorageProvider>
    </AuthProvider>
  );
}

// Client-side component doesn't use revalidate
