'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { DataStructuresTable } from '@/components/admin/DataStructuresTable';
import { Button } from '@/components/ui/button';
import { useGetAllTopicsQuery } from '@/store/slices/dsaTopicsSlice';

export default function DataStructuresPage() {
  const { data: topics = [], isLoading, error } = useGetAllTopicsQuery();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      const topicToDelete = topics.find((topic) => topic.id === id);
      if (!topicToDelete) {
        throw new Error('Topic not found');
      }

      const updatedTopic = {
        ...topicToDelete,
        status: 'deleted' as const,
        deletedAt: new Date(),
      };

      // This would need to be implemented in Redux as a soft delete
      // For now, we'll just log it
      console.log('Delete topic:', updatedTopic);

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

  if (isLoading) {
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
    const errorMessage =
      (error as any)?.data?.message ||
      (error as any)?.data ||
      'Failed to load data structures';
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{errorMessage}</p>
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
            updatedAt: (() => {
              if (!ds.updatedAt) return new Date().toISOString();
              if (ds.updatedAt instanceof Date)
                return ds.updatedAt.toISOString();
              if (typeof ds.updatedAt === 'string') return ds.updatedAt;
              return ds.updatedAt.toDate().toISOString();
            })(),
            category: ds.category,
          }))}
          onDelete={handleDelete}
          onEdit={(id) => router.push(`/admin/dsa/edit/${id}`)}
        />
      </div>
    </div>
  );
}
