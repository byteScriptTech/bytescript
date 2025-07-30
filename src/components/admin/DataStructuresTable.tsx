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

import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';

interface DataStructuresTableProps {
  data: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    status?: 'active' | 'deleted' | 'draft';
    updatedAt: string;
  }>;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  onEdit: (id: string) => void;
}

export function DataStructuresTable({
  data,
  onDelete,
  onEdit,
}: DataStructuresTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleDeleteClick = (item: { id: string; name?: string }) => {
    setItemToDelete({ id: item.id, name: item.name || 'Untitled' });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const result = await onDelete(itemToDelete.id);
      if (result.success) {
        toast.success('Data structure deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete data structure');
      }
    } catch (error) {
      console.error('Error deleting data structure:', error);
      toast.error('An error occurred while deleting the data structure');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No data structures found. Create one to get started.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Difficulty</TableHead>
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
                  {item.name}
                </button>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {item.slug}
              </TableCell>
              <TableCell className="capitalize">
                {item.category?.replace('-', ' ')}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    item.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : item.status === 'deleted'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}
                >
                  {item.status || 'draft'}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    item.difficulty === 'beginner'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : item.difficulty === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {item.difficulty.charAt(0).toUpperCase() +
                    item.difficulty.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                {new Date(item.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
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
                    onClick={() =>
                      handleDeleteClick({
                        id: item.id,
                        name: item.name,
                      })
                    }
                    disabled={isDeleting}
                  >
                    {isDeleting && itemToDelete?.id === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {itemToDelete && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          title={`Delete "${itemToDelete.name}"?`}
          description="This action cannot be undone. This will permanently delete the data structure and all its associated content."
          confirmButtonText={`Delete ${itemToDelete.name}`}
        />
      )}
    </div>
  );
}
