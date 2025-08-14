'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

import { useLanguages } from '@/context/LanguagesContext';

import Content from './Content';

interface Topic {
  id: string;
  name: string;
  content?: string;
  subtopics?: Array<{
    id: string;
    name: string;
    content?: string;
    examples?: any[];
  }>;
}

export default function ContentWithParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getUserLearningProgress } = useLanguages();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  // Get topic and subtopic from URL params
  const topicId = searchParams.get('topic') || '';
  const subtopicId = searchParams.get('subtopic') || '';

  // Mock data - replace with actual data fetching
  useEffect(() => {
    // This is a placeholder - replace with actual data fetching logic
    const fetchTopics = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Mock data - replace with actual data
        const mockTopics: Topic[] = [
          {
            id: '1',
            name: 'Introduction',
            content: 'Introduction content...',
            subtopics: [
              {
                id: '1-1',
                name: 'Getting Started',
                content: 'Getting started content...',
              },
              {
                id: '1-2',
                name: 'Basics',
                content: 'Basics content...',
              },
            ],
          },
          // Add more mock topics as needed
        ];
        setTopics(mockTopics);
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  // Find the current topic based on topicId
  const currentTopic = useMemo(
    () => topics.find((topic) => topic.id === topicId),
    [topics, topicId]
  );

  // Fetch learning progress if needed
  useEffect(() => {
    if (topicId) {
      // Replace 'user-id' with actual user ID
      getUserLearningProgress('user-id', topicId);
    }
  }, [topicId, getUserLearningProgress]);

  // Handle topic click - update URL with new topic and clear subtopic
  const handleTopicClick = (newTopicId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('topic', newTopicId);
    params.delete('subtopic');
    router.push(`?${params.toString()}`);
  };

  // Handle subtopic click - update URL with new subtopic
  const handleSubtopicClick = (newSubtopicId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('subtopic', newSubtopicId);
    router.push(`?${params.toString()}`);
  };

  // Render examples for code blocks
  const renderExamples = (examples: any[]) => {
    if (!examples || examples.length === 0) return null;

    return (
      <div className="space-y-4 mt-6">
        {examples.map((example, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
          >
            {example.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {example.description}
              </p>
            )}
            <div className="bg-black rounded-md overflow-hidden">
              <pre className="p-4 text-sm text-gray-200 overflow-x-auto">
                <code>{example.code}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Show loading state while content is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error if topic is not found
  if (!currentTopic) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Topic not found
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          The requested topic could not be found.
        </p>
      </div>
    );
  }

  return (
    <Content
      topicId={topicId}
      subtopicId={subtopicId}
      content={currentTopic}
      onTopicClick={handleTopicClick}
      onSubtopicClick={handleSubtopicClick}
      renderExamples={renderExamples}
    />
  );
}
