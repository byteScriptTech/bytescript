import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { InterviewQuestionsList } from '@/components/interview/InterviewQuestionsList';
import { Button } from '@/components/ui/button';

// Mock data - in a real app, this would come from a database or API
const interviewQuestions = {
  nodejs: [
    {
      id: 1,
      question: 'What is Node.js?',
      answer:
        "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine that allows you to run JavaScript on the server side.",
    },
    {
      id: 2,
      question: 'What is the event loop in Node.js?',
      answer:
        'The event loop is what allows Node.js to perform non-blocking I/O operations by offloading operations to the system kernel whenever possible.',
    },
    {
      id: 3,
      question: 'What is npm?',
      answer:
        "npm (Node Package Manager) is the default package manager for Node.js and the world's largest software registry.",
    },
  ],
  react: [
    {
      id: 1,
      question: 'What is React?',
      answer:
        'React is a JavaScript library for building user interfaces, developed by Facebook. It allows developers to create reusable UI components.',
    },
    {
      id: 2,
      question: 'What are React Hooks?',
      answer:
        'Hooks are functions that let you use state and other React features without writing a class. They were introduced in React 16.8.',
    },
  ],
  python: [
    {
      id: 1,
      question: 'What is Python?',
      answer:
        'Python is a high-level, interpreted programming language known for its readability and versatility.',
    },
    {
      id: 2,
      question: 'What are Python decorators?',
      answer:
        'Decorators are a very powerful and useful tool in Python since they allow programmers to modify the behavior of a function or class.',
    },
  ],
  sql: [
    {
      id: 1,
      question: 'What is SQL?',
      answer:
        'SQL (Structured Query Language) is a standard language for managing and manipulating relational databases.',
    },
    {
      id: 2,
      question: 'What is a JOIN in SQL?',
      answer:
        'A JOIN clause is used to combine rows from two or more tables, based on a related column between them.',
    },
  ],
  typescript: [
    {
      id: 1,
      question: 'What is TypeScript?',
      answer:
        'TypeScript is a strongly typed superset of JavaScript that compiles to plain JavaScript.',
    },
    {
      id: 2,
      question: 'What are TypeScript interfaces?',
      answer:
        'Interfaces in TypeScript are used to define the structure of an object.',
    },
  ],
};

const topicTitles = {
  nodejs: 'Node.js',
  react: 'React',
  python: 'Python',
  sql: 'SQL',
  typescript: 'TypeScript',
};

export default function InterviewTopicPage({
  params,
}: {
  params: { topicId: string };
}) {
  const { topicId } = params;
  const topicTitle = topicTitles[topicId as keyof typeof topicTitles];
  const questions =
    interviewQuestions[topicId as keyof typeof interviewQuestions] || [];

  if (!topicTitle) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/interview">
          <Button variant="ghost" className="pl-0">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Interview Topics
          </Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">
        {topicTitle} Interview Questions
      </h1>
      <InterviewQuestionsList questions={questions} />
    </div>
  );
}

// Generate static params for pre-rendering
export async function generateStaticParams() {
  return Object.keys(topicTitles).map((topic) => ({
    topicId: topic,
  }));
}
