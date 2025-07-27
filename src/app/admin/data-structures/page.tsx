import { Plus } from 'lucide-react';
import Link from 'next/link';

import { DataStructuresTable } from '@/components/admin/DataStructuresTable';
import { Button } from '@/components/ui/button';

export default function DataStructuresPage() {
  // Mock data - replace with actual data fetching
  const dataStructures = [
    {
      id: '1',
      name: 'Array',
      slug: 'array',
      description: 'A collection of elements identified by index',
      category: 'Basic',
    },
    {
      id: '2',
      name: 'Linked List',
      slug: 'linked-list',
      description: 'A linear collection of data elements',
      category: 'Linear',
    },
    {
      id: '3',
      name: 'Binary Tree',
      slug: 'binary-tree',
      description: 'A tree data structure with at most two children',
      category: 'Non-Linear',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data Structures</h1>
          <p className="text-muted-foreground">
            Manage all data structures in the platform
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/data-structures/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Data Structure
          </Link>
        </Button>
      </div>

      <DataStructuresTable data={dataStructures} />
    </div>
  );
}
