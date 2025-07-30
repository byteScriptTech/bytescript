'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { DataStructureForm } from '@/components/admin/DataStructureForm';

export default function NewDataStructurePage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      // TODO: Replace with actual API call
      console.log('Submitting data:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Data structure created successfully!');
      router.push('/admin/data-structures');
    } catch (error) {
      console.error('Error creating data structure:', error);
      toast.error('Failed to create data structure. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Add New Data Structure
        </h1>
        <p className="text-muted-foreground">
          Fill in the details to create a new data structure
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <DataStructureForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
