'use client';

import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type Problem } from '@/types/problem';

import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';

interface ProblemsTableProps {
  data: Problem[];
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  onEdit: (id: string) => void;
}

export function ProblemsTable({ data, onDelete, onEdit }: ProblemsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const handleDeleteClick = (item: { id: string; title?: string }) => {
    setItemToDelete({ id: item.id, title: item.title || 'Untitled' });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const result = await onDelete(itemToDelete.id);
      if (result.success) {
        toast.success('Problem deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete problem');
      }
    } catch (error) {
      console.error('Error deleting problem:', error);
      toast.error('An error occurred while deleting the problem');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No problems found. Create one to get started.
      </div>
    );
  }

  const getDifficultyBadge = (difficulty: string) => {
    const difficultyColors = {
      Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      Medium:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyColors[difficulty as keyof typeof difficultyColors]}`}
      >
        {difficulty}
      </span>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <button
                  onClick={() => onEdit(item.id)}
                  className="text-left hover:underline"
                >
                  {item.title}
                </button>
              </TableCell>
              <TableCell className="capitalize">
                {item.category.replace('-', ' ')}
              </TableCell>
              <TableCell>{getDifficultyBadge(item.difficulty)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(item.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item.id)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(item)}
                    disabled={isDeleting}
                  >
                    {isDeleting && itemToDelete?.id === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-red-500" />
                    )}
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Problem"
        description={`Are you sure you want to delete "${itemToDelete?.title}"? This action cannot be undone.`}
        confirmButtonText={isDeleting ? 'Deleting...' : 'Delete'}
      />
    </div>
  );
}
