'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useGetTopicByIdQuery } from '@/store/slices/nodejsSlice';

import { NodejsContentForm } from '../../NodejsContentForm';

export default function EditNodejsContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolved) => {
      setId(resolved.id);
    });
  }, [params]);

  const {
    data: content,
    isLoading: loading,
    error,
  } = useGetTopicByIdQuery(id || '', {
    skip: !id,
  });

  useEffect(() => {
    if (error && id) {
      console.error('Error fetching content:', error);
      router.push('/500');
    }
  }, [error, id, router]);

  const handleSuccess = () => {
    toast.success('Content updated successfully!');
  };

  if (loading || !id) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  if (!content) {
    return <div className="container mx-auto py-10">Content not found</div>;
  }

  const formContent = {
    id: content.id,
    name: content.name,
    description: content.description || '',
    difficulty: content.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
    content: content.content || '',
    slug: content.slug,
    timeToComplete: content.timeToComplete || 30,
    learningObjectives: content.learningObjectives || [],
    commonMistakes: content.commonMistakes || [],
    resources: content.resources || [],
    examples: content.examples || [],
    subtopics: (content.subtopics || []).map((subtopic: any) => ({
      id: subtopic.id || '',
      name: subtopic.name || '',
      content: subtopic.content || '',
      recommended_resources: subtopic.recommended_resources || [],
      examples: (subtopic.examples || []).map((example: any) => ({
        code: example.code || '',
        description: example.description,
      })),
      exercises: subtopic.exercises || [],
      estimated_time_minutes: subtopic.estimated_time_minutes,
      description: subtopic.description,
    })),
    exercises: content.exercises || [],
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Node.js Content</h1>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <NodejsContentForm content={formContent} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
