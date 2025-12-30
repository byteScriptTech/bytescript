'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DataStructureForm } from '@/components/admin/DataStructureForm';
import AuthGuard from '@/components/misc/authGuard';
import { useDSATopicsRedux } from '@/hooks/useDSATopicsRedux';
import type { DataStructureFormValues } from '@/lib/validations';
import { useGetTopicByIdQuery } from '@/store/slices/dsaTopicsSlice';

export default function EditDataStructurePage() {
  const params = useParams<{ id?: string | string[] }>();
  const id = params?.id;
  const router = useRouter();
  const { updateTopic } = useDSATopicsRedux();

  console.log('updateTopic hook returns:', updateTopic);

  const { data: topic, isLoading } = useGetTopicByIdQuery(id as string, {
    skip: !id || Array.isArray(id),
  });

  const [data, setData] = useState<DataStructureFormValues | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(true);

  useEffect(() => {
    if (!id || Array.isArray(id)) {
      toast.error('Invalid data structure ID');
      router.push('/admin/dsa');
      return;
    }

    if (topic) {
      // Map the topic data to the form values
      const formValues: DataStructureFormValues = {
        name: topic.title || '',
        slug: topic.slug || '',
        category: topic.category,
        subcategory: topic.subcategory || '',
        difficulty: topic.difficulty || 'beginner',
        description: topic.description || '',
        content: topic.content || '',
        timeComplexity: topic.timeComplexity || '',
        spaceComplexity: topic.spaceComplexity || '',
        tags: topic.tags || [],
        prerequisites: topic.prerequisites || [],
        operations:
          topic.operations?.map((op: any) =>
            typeof op === 'string' ? op : op.name
          ) || [],
        examples: topic.examples || [],
        lastUpdated: topic.updatedAt
          ? topic.updatedAt instanceof Date
            ? topic.updatedAt.toISOString()
            : new Date().toISOString()
          : new Date().toISOString(),
      };

      setData(formValues);
      setIsFormLoading(false);
    } else if (!isLoading) {
      toast.error('Data structure not found');
      router.push('/admin/dsa');
    }
  }, [topic, id, router, isLoading]);

  const handleSubmit = async (formData: DataStructureFormValues) => {
    console.log('handleSubmit called with:', formData);
    if (!id || Array.isArray(id)) {
      toast.error('Invalid data structure ID');
      return;
    }

    try {
      const updatedTopic = {
        title: formData.name,
        slug: formData.slug,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        difficulty: formData.difficulty,
        content: formData.content,
        timeComplexity: formData.timeComplexity,
        spaceComplexity: formData.spaceComplexity,
        tags: formData.tags,
        prerequisites: formData.prerequisites,
        operations:
          formData.operations?.map((op) => ({
            name: op,
            description: '',
            timeComplexity: '',
            spaceComplexity: '',
          })) || [],
        examples: formData.examples,
      };

      console.log('Updating topic with:', {
        id: id as string,
        updates: updatedTopic,
      });

      // Update the topic using Redux mutation
      const result = await updateTopic.mutateAsync({
        id: id as string,
        updates: updatedTopic,
      });

      console.log('updateTopic successful:', result);
      toast.success('Data structure updated successfully');
      router.push('/admin/dsa');
    } catch (error) {
      console.error('Error updating data structure:', error);
      toast.error(
        `Failed to update data structure: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  if (isLoading || isFormLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!data) {
    return null; // or redirect to list page
  }

  return (
    <AuthGuard>
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
    </AuthGuard>
  );
}
