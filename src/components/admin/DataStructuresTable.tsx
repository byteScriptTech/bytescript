'use client';

import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
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

interface DataStructure {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
}

interface DataStructuresTableProps {
  data: DataStructure[];
  onDelete?: (id: string) => Promise<void>;
}

export function DataStructuresTable({
  data,
  onDelete,
}: DataStructuresTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleDeleteClick = (item: DataStructure) => {
    setItemToDelete({ id: item.id, name: item.name });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete || !onDelete) return;

    try {
      await onDelete(itemToDelete.id);
      toast.success(`"${itemToDelete.name}" has been deleted.`);
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(`Failed to delete "${itemToDelete.name}". Please try again.`);
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {item.slug}
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {item.category}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.description}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/data-structures/edit/${item.id}`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-900 hover:bg-red-50"
                      onClick={() => handleDeleteClick(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No data structures found.
              </TableCell>
            </TableRow>
          )}
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
