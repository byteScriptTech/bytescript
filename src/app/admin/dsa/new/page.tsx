'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { DataStructureForm } from '@/components/admin/DataStructureForm';
import type { DataStructureFormValues } from '@/lib/validations';
import { useCreateTopicMutation } from '@/store/slices/dsaTopicsSlice';

export default function NewDataStructurePage() {
  const router = useRouter();
  const [createTopic, { isLoading }] = useCreateTopicMutation();

  const handleSubmit = async (data: DataStructureFormValues) => {
    try {
      // Create the topic object with all fields from the form
      const newTopic = {
        title: data.name,
        slug: data.slug,
        description: data.description,
        category: data.category,
        subcategory: data.subcategory,
        difficulty: data.difficulty,
        content: data.content,
        timeComplexity: data.timeComplexity,
        spaceComplexity: data.spaceComplexity,
        tags: data.tags,
        prerequisites: data.prerequisites,
        operations:
          data.operations?.map((op) => ({
            name: op,
            description: '',
            timeComplexity: '',
            spaceComplexity: '',
          })) || [],
        useCases: data.useCases,
        resources: data.resources,
        examples: data.examples,
        problems: data.problems,
      };

      // Save the topic using Redux mutation
      await createTopic(newTopic).unwrap();

      toast.success('Data structure created successfully!');
      router.push('/admin/dsa');
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
        <DataStructureForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
