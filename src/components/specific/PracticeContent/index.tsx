import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePractice } from '@/context/PracticeContext';

interface Topic {
  id: string;
  name: string;
  description?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  category?: 'problems' | 'dsa' | 'javascript' | 'python';
  order?: number;
}

interface PracticeContentProps {
  currentTopic: Topic | undefined;
  setCurrentTopic: (item: Topic) => void;
  category: string;
  topicId?: string | null;
}

const PracticeContent: React.FC<PracticeContentProps> = ({
  setCurrentTopic,
  currentTopic,
  category,
  topicId = null,
}) => {
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const { topics, loading, error, fetchTopicsByCategory } = usePractice();
  useEffect(() => {
    const filterTopics = async () => {
      setIsLoading(true);
      try {
        if (category === 'all') {
          setFilteredTopics(topics);
        } else {
          const categoryTopics = await fetchTopicsByCategory(category);
          setFilteredTopics(categoryTopics);
        }
      } catch (err) {
        console.error('Error filtering topics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    filterTopics();
  }, [category, topics, fetchTopicsByCategory]);

  // Set current topic based on URL or first topic
  useEffect(() => {
    if (filteredTopics.length > 0) {
      if (topicId) {
        const topic = filteredTopics.find((t) => t.id === topicId);
        if (topic) {
          setCurrentTopic(topic);
          return;
        }
      }
      // Set first topic if no topic is selected
      if (
        !currentTopic ||
        !filteredTopics.some((t) => t.id === currentTopic.id)
      ) {
        setCurrentTopic(filteredTopics[0]);
      }
    }
  }, [filteredTopics, topicId, currentTopic, setCurrentTopic]);

  if (loading || isLoading) {
    return <ContentSkeleton />;
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
        Error loading practice topics: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic) => (
            <Card
              key={topic.id}
              className={`p-6 cursor-pointer transition-all hover:shadow-l`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold">{topic.name}</h3>
                {topic.difficulty && (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {topic.difficulty}
                  </span>
                )}
              </div>
              {topic.category && (
                <span className="inline-block mb-3 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {topic.category}
                </span>
              )}
              {topic.description && (
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                  {topic.description}
                </p>
              )}
              <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/practice/${topic.id}`);
                  }}
                >
                  Start Practice →
                </button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">
              No topics found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ContentSkeleton = () => (
  <div className="container mx-auto py-6 px-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6">
          <div className="flex justify-between items-start mb-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-4 w-16 mb-3 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Skeleton className="h-4 w-24" />
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default React.memo(PracticeContent);
