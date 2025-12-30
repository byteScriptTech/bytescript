'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { useJavascriptRedux } from '@/hooks/useJavascriptRedux';

import { JavaScriptContentForm } from '../../JavaScriptContentForm';

export default function EditJavaScriptContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const [id, setId] = useState<string | null>(null);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Redux hook for JavaScript content
  const javascriptRedux = useJavascriptRedux();
  const { getTopicById } = javascriptRedux;

  useEffect(() => {
    params.then((resolved) => {
      setId(resolved.id);
    });
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const topicQuery = getTopicById(id);

    // Update loading state
    setLoading(topicQuery.isLoading);

    // Handle data
    if (topicQuery.data) {
      setContent(topicQuery.data);
    } else if (topicQuery.isError) {
      console.error('Error fetching content:', topicQuery.error);
      router.push('/500');
      setLoading(false);
    }
  }, [id, router, getTopicById]);

  const handleSuccess = async () => {
    if (!id) return;

    try {
      const topicQuery = getTopicById(id);
      if (topicQuery.data) {
        setContent(topicQuery.data);
        toast.success('Content updated successfully!');
      }
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
        <button
          onClick={() => router.push('/admin/javascript')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to JavaScript Content
        </button>
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
      <h1 className="text-2xl font-bold mb-6">Edit JavaScript Content</h1>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <JavaScriptContentForm
          content={formContent}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
