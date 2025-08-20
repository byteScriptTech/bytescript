'use client';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const interviewTopics = [
  {
    id: 'nodejs',
    title: 'Node.js',
    description: 'Node.js interview questions and answers',
    icon: '💻',
  },
  {
    id: 'react',
    title: 'React',
    description: 'React interview questions and answers',
    icon: '⚛️',
  },
  {
    id: 'python',
    title: 'Python',
    description: 'Python interview questions and answers',
    icon: '🐍',
  },
  {
    id: 'sql',
    title: 'SQL',
    description: 'SQL interview questions and answers',
    icon: '🗃️',
  },
  {
    id: 'typescript',
    title: 'TypeScript',
    description: 'TypeScript interview questions and answers',
    icon: '📝',
  },
];

export default function InterviewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Interview Preparation</h1>
      <p className="text-muted-foreground mb-8">
        Select a topic to start preparing for your next interview
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviewTopics.map((topic) => (
          <Link href={`/interview/${topic.id}`} key={topic.id}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{topic.icon}</span>
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
