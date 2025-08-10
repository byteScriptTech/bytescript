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
import { pythonService } from '@/services/pythonService';

interface PythonTopic {
  id: string;
  name: string;
  tag: string;
  description?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  content: string;
}

export default function PythonContentPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<PythonTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const data = await pythonService.getAllTopics();
      setTopics(data as PythonTopic[]);
    } catch (error) {
      console.error('Error fetching Python content:', error);
      // Consider adding a toast notification here for better UX
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this topic?')) {
      try {
        await pythonService.deleteTopic(id);
        fetchContent();
      } catch (error) {
        console.error('Error deleting topic:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-2">Loading topics...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Python Topics</h1>
        <Button onClick={() => router.push('/admin/python/new')}>
          Add New Topic
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.map((topic) => (
              <TableRow key={topic.id}>
                <TableCell className="font-medium">{topic.name}</TableCell>
                <TableCell>{topic.tag}</TableCell>
                <TableCell>{topic.difficulty}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        router.push(`/admin/python/edit/${topic.id}`)
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
