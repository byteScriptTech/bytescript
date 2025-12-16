'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { ProblemsTable } from '@/components/admin/ProblemsTable';
import { Button } from '@/components/ui/button';
import {
  problemsService,
  type Problem,
} from '@/services/firebase/problemsService';

export default function ProblemsPage() {
  const router = useRouter();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await problemsService.getAllProblems();
        if (!data) return;
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await problemsService.deleteProblem(id);
      setProblems(problems.filter((problem) => problem.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting problem:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to delete problem',
      };
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/problems/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Problems</h1>
        <Button onClick={() => router.push('/admin/problems/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Problem
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
        <ProblemsTable
          data={problems}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}
