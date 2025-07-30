'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { DataStructuresTable } from '@/components/admin/DataStructuresTable';
import { Button } from '@/components/ui/button';
import { dsaService } from '@/services/firebase/dsaService';

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
  status?: 'active' | 'deleted' | 'draft';
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: string;
}

export default function DataStructuresPage() {
  const [topics, setTopics] = useState<DSATopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
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

  const handleDelete = async (id: string) => {
    try {
      const topicToDelete = topics.find((topic) => topic.id === id);
      if (!topicToDelete) {
        throw new Error('Topic not found');
      }

      const updatedTopic = {
        ...topicToDelete,
        status: 'deleted' as const,
        deletedAt: new Date().toISOString(),
      };

      await dsaService.saveTopic(updatedTopic, id);

      setTopics((currentTopics) =>
        currentTopics.filter((topic) => topic.id !== id)
      );

      return { success: true };
    } catch (error) {
      console.error('Error deleting topic:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to delete topic',
      };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading data structures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Data Structures & Algorithms
          </h1>
          <p className="text-muted-foreground">
            Manage your data structures and their content
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/dsa/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Data Structure
          </Link>
        </Button>
      </div>

      <div
        className="rounded-md border
      "
      >
        <DataStructuresTable
          data={topics.map((ds) => ({
            id: ds.id,
            name: ds.title,
            slug: ds.slug,
            description: ds.description,
            difficulty: ds.difficulty || 'beginner',
            updatedAt: ds.updatedAt?.toISOString() || new Date().toISOString(),
          }))}
          onDelete={handleDelete}
          onEdit={(id) => router.push(`/admin/dsa/edit/${id}`)}
        />
      </div>
    </div>
  );
}
