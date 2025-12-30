'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useJavascriptRedux } from '@/hooks/useJavascriptRedux';

interface JavaScriptTopic {
  id: string;
  name: string;
  slug: string;
  description?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  content: string;
}

export default function JavaScriptContentPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<JavaScriptTopic[]>([]);

  // Redux hook for JavaScript content
  const javascriptRedux = useJavascriptRedux();
  const { allTopics, deleteTopic } = javascriptRedux;

  useEffect(() => {
    if (allTopics.data) {
      setTopics(allTopics.data as JavaScriptTopic[]);
    }
  }, [allTopics.data]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this topic?')) {
      try {
        await deleteTopic.mutateAsync(id);
        // Data will be automatically updated via Redux cache invalidation
      } catch (error) {
        console.error('Error deleting topic:', error);
      }
    }
  };

  if (allTopics.isLoading) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">JavaScript Content Management</h1>
        <Button onClick={() => router.push('/admin/javascript/new')}>
          Add New Topic
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.map((topic) => (
              <TableRow key={topic.id}>
                <TableCell className="font-medium">{topic.name}</TableCell>
                <TableCell>{topic.slug}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      topic.difficulty === 'Beginner'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                        : topic.difficulty === 'Intermediate'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                    }`}
                  >
                    {topic.difficulty}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        router.push(`/admin/javascript/edit/${topic.id}`)
                      }
                      aria-label="Edit topic"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(topic.id)}
                      aria-label="Delete topic"
                      className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
