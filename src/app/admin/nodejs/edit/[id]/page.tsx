'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { nodejsService } from '@/services/nodejsService';

import { NodejsContentForm } from '../../NodejsContentForm';

export default function EditNodejsContentPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await nodejsService.getTopicById(params.id);
        if (!data) {
          router.push('/404');
          return;
        }
        setContent(data);
      } catch (error) {
        console.error('Error fetching content:', error);
        router.push('/500');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [params.id, router]);

  const handleSuccess = async () => {
    try {
      const updatedContent = await nodejsService.getTopicById(params.id);
      setContent(updatedContent);
      toast.success('Content updated successfully!');
    } catch (error) {
      console.error('Error refetching content:', error);
      toast.error('Failed to refresh content');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">Content not found</h2>
        <Button onClick={() => router.push('/admin/nodejs')} className="mt-4">
          Back to Node.js Content
        </Button>
      </div>
    );
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
