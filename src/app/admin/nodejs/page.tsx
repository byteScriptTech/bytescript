'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { nodejsService } from '@/services/nodejsService';

interface NodejsTopic {
  id: string;
  name: string;
  slug: string;
  description?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export default function NodejsContentPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<NodejsTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const data = await nodejsService.getAllTopics();
      setTopics(data as NodejsTopic[]);
    } catch (error) {
      console.error('Error fetching Node.js content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this topic?')) {
      try {
        await nodejsService.deleteTopic(id);
        fetchContent();
      } catch (error) {
        console.error('Error deleting topic:', error);
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Node.js Content Management</h1>
        <Button onClick={() => router.push('/admin/nodejs/new')}>
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
                        router.push(`/admin/nodejs/edit/${topic.id}`)
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
