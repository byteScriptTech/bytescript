'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DataStructureForm } from '@/components/admin/DataStructureForm';
import AuthGuard from '@/components/misc/authGuard';
import type { DataStructureFormValues } from '@/lib/validations';
import { dsaService, type DSATopic } from '@/services/firebase/dsaService';

export default function EditDataStructurePage() {
  const params = useParams<{ id?: string | string[] }>();
  const id = params?.id;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DataStructureFormValues | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || Array.isArray(id)) {
        toast.error('Invalid data structure ID');
        router.push('/admin/data-structures');
        return;
      }

      try {
        // Fetch the specific topic by ID
        const topic = await dsaService.getTopicById(id);

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
            // Convert operations to string array for the form
            operations:
              topic.operations?.map((op) =>
                typeof op === 'string' ? op : op.name
              ) || [],
            useCases: topic.useCases || [],
            resources: topic.resources || [],
            examples: topic.examples || [],
            // Convert Date/Timestamp to ISO string for the form
            lastUpdated: topic.lastUpdated
              ? topic.lastUpdated instanceof Date
                ? topic.lastUpdated.toISOString()
                : (topic.lastUpdated as any).toDate
                  ? (topic.lastUpdated as any).toDate().toISOString()
                  : new Date().toISOString()
              : new Date().toISOString(),
          };

          setData(formValues);
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
    if (!id || Array.isArray(id)) {
      toast.error('Invalid data structure ID');
      return;
    }

    try {
      // Create the updated topic object with all fields from the form
      // Get current topic to preserve any fields not in the form
      const currentTopic = await dsaService.getTopicById(id);
      if (!currentTopic) {
        throw new Error('Topic not found');
      }

      const now = new Date();
      // Create a new object with the correct types for Firestore
      const updatedTopic: Partial<Omit<DSATopic, 'id' | 'createdAt'>> = {
        // Map form data to topic fields
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
        // Convert string array to operations array with default values
        operations:
          formData.operations?.map((op) => ({
            name: op,
            description: '',
            timeComplexity: '',
            spaceComplexity: '',
          })) || [],
        useCases: formData.useCases,
        resources: formData.resources,
        examples: formData.examples,
        lastUpdated: now,
        // Preserve existing status if not in form
        status: currentTopic.status || 'active',
        // Set updatedAt to current date
        updatedAt: now,
      };

      try {
        // Update the topic in Firestore
        await dsaService.updateTopic(id, updatedTopic);
        toast.success('Data structure updated successfully');
        router.push('/admin/data-structures');
      } catch (error) {
        console.error('Error updating data structure:', error);
        toast.error('Failed to update data structure');
      }
    } catch (error) {
      console.error('Error updating data structure:', error);
      toast.error('Failed to update data structure. Please try again.');
    }
  };

  if (isLoading) {
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
