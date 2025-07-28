'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DataStructureForm } from '@/components/admin/DataStructureForm';
import AuthGuard from '@/components/misc/authGuard';
import { AuthProvider } from '@/context/AuthContext';
import type { DataStructureFormValues } from '@/lib/validations';
import { dsaService } from '@/services/firebase/dsaService';

// Interface for the topic data structure
interface DSATopic {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'data-structures' | 'algorithms' | string; // Allow string for form compatibility
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  content?: string;
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  status?: 'active' | 'deleted' | 'draft';
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}

export default function EditDataStructurePage() {
  const { id } = useParams();
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
        // Fetch all topics and find the one with matching ID
        const topics = (await dsaService.getAllTopics()) as DSATopic[];
        const topic = topics.find((t) => t.id === id);

        if (topic) {
          // Map the topic data to the form values
          setData({
            name: topic.title, // Map title to name for the form
            slug: topic.slug,
            description: topic.description || '',
            category: topic.category,
            timeComplexity: topic.timeComplexity || '',
            spaceComplexity: topic.spaceComplexity || '',
          });
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
      // First, get the current topic to preserve any fields not in the form
      const topics = (await dsaService.getAllTopics()) as DSATopic[];
      const currentTopic = topics.find((t) => t.id === id);

      if (!currentTopic) {
        throw new Error('Data structure not found');
      }

      // Create the updated topic object with all fields from the form
      const updatedTopic = {
        // Map form data to topic fields
        title: formData.name,
        slug: formData.slug,
        description: formData.description,
        category: formData.category as 'data-structures' | 'algorithms',
        timeComplexity: formData.timeComplexity,
        spaceComplexity: formData.spaceComplexity,
        // Preserve other fields from the current topic
        ...Object.fromEntries(
          Object.entries(currentTopic).filter(
            ([key]) =>
              ![
                'id',
                'createdAt',
                'updatedAt',
                'title',
                'slug',
                'description',
                'category',
                'timeComplexity',
                'spaceComplexity',
              ].includes(key)
          )
        ),
      } as const;

      // Save the updated topic
      await dsaService.saveTopic(updatedTopic, id);

      toast.success('Data structure updated successfully!');
      router.push('/admin/data-structures');
      router.refresh(); // Refresh the page to show the updated data
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
    <AuthProvider>
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
    </AuthProvider>
  );
}
