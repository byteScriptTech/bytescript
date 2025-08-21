'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { interviewService } from '@/services/interviewService';

const TOPIC_ICONS: Record<string, string> = {
  javascript: '📜',
  react: '⚛️',
  nodejs: '💻',
  python: '🐍',
  typescript: '📝',
  sql: '🗃️',
  default: '❓',
};

interface Topic {
  id: string;
  title: string;
  description: string;
}

export default function InterviewPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        console.log('Fetching topics directly from interviewService...');
        const topicNames = await interviewService.getTopics();
        console.log('Fetched topics:', topicNames);

        const formattedTopics = topicNames.map((topic) => ({
          id: topic,
          title: topic.charAt(0).toUpperCase() + topic.slice(1),
          description: `${topic} interview questions and answers`,
        }));

        setTopics(formattedTopics);
      } catch (err) {
        console.error('Error fetching topics:', err);
        setError('Failed to load interview topics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Interview Preparation</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-40">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Interview Preparation</h1>
      <p className="text-muted-foreground mb-8">
        Select a topic to start preparing for your next interview
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Link href={`/interview/${topic.id}`} key={topic.id}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">
                    {TOPIC_ICONS[topic.id.toLowerCase()] || TOPIC_ICONS.default}
                  </span>
                  {topic.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{topic.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
