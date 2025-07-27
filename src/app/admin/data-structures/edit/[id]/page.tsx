'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DataStructureForm } from '@/components/admin/DataStructureForm';
import type { DataStructureFormValues } from '@/lib/validations';

// Mock data - replace with actual API call
const mockDataStructures = [
  {
    id: '1',
    name: 'Array',
    slug: 'array',
    description: 'A collection of elements identified by index',
    category: 'Basic',
    timeComplexity: 'O(1) for access, O(n) for search/insert/delete',
    spaceComplexity: 'O(n)',
  },
  {
    id: '2',
    name: 'Linked List',
    slug: 'linked-list',
    description: 'A linear collection of data elements',
    category: 'Linear',
    timeComplexity: 'O(n) for access/search, O(1) for insert/delete at head',
    spaceComplexity: 'O(n)',
  },
  {
    id: '3',
    name: 'Binary Tree',
    slug: 'binary-tree',
    description: 'A tree data structure with at most two children',
    category: 'Non-Linear',
    timeComplexity: 'O(log n) for search/insert/delete (balanced)',
    spaceComplexity: 'O(n)',
  },
];

export default function EditDataStructurePage() {
  const { id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DataStructureFormValues | null>(null);

  useEffect(() => {
    // Simulate API call to fetch data structure by ID
    const fetchData = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        const item = mockDataStructures.find((ds) => ds.id === id);
        if (item) {
          setData(item);
        } else {
          toast.error('Data structure not found');
          router.push('/admin/data-structures');
        }
      } catch (error) {
        console.error('Error fetching data structure:', error);
        toast.error('Failed to load data structure');
        router.push('/admin/data-structures');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const handleSubmit = async (formData: DataStructureFormValues) => {
    try {
      // TODO: Replace with actual API call
      console.log('Updating data structure:', { id, ...formData });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Data structure updated successfully!');
      router.push('/admin/data-structures');
    } catch (error) {
      console.error('Error updating data structure:', error);
      toast.error('Failed to update data structure. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data) {
    return null; // or redirect to list page
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Edit Data Structure
        </h1>
        <p className="text-muted-foreground">
          Update the details of this data structure
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <DataStructureForm initialData={data} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
