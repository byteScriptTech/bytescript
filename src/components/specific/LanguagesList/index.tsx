import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { useContentContext } from '@/context/ContentContext';
import { useLocalStorage } from '@/context/LocalhostContext';
import { useTopics } from '@/hooks/useTopics';
import { cn } from '@/lib/utils';

import CourseIcon from '../CourseIcon';

export const LanguagesList = () => {
  const router = useRouter();
  const { topics, loading } = useTopics();
  const { content } = useContentContext();
  const { getItem, setItem } = useLocalStorage();
  const progress = getItem('progressCache');

  const handleTopicClick = (name: string, _id: string) => {
    // Save the selected language to local storage
    setItem('lvl_name', name);

    // Navigate to the learn page with the selected language
    if (name === 'competitive-programming') {
      router.push('/competitive-programming');
    } else if (name === 'data-structures-&-algorithms') {
      router.push('/data-structures');
    } else if (name === 'javascript') {
      router.push('/learn/javascript');
    } else if (name === 'python') {
      router.push('/learn/python');
    } else {
      // Default fallback for other languages
      router.push(`/learn/${name.toLowerCase()}`);
    }
  };

  useEffect(() => {
    if (content) {
      const topicsData = topics?.map((topic) => ({
        name: topic.name,
        id: topic.id,
      }));

      if (topicsData) {
        const findLanguage = progress?.includes(content[0]?.name.toLowerCase());

        if (!findLanguage) {
          if (progress?.length) {
            setItem('progressCache', [...progress, content[0]?.name]);
          } else {
            setItem('progressCache', [content[0]?.name.toLowerCase()]);
          }
          // addUserLearningProgress is not defined, you might need to import or define it
          // addUserLearningProgress(currentUser.uid, content[0].name, topicsData);
        }
      }
    }
  }, [content, topics, progress, setItem]);

  const getTopicColor = (topicName: string) => {
    const colors = [
      'bg-blue-50 hover:bg-blue-100 border-blue-200',
      'bg-emerald-50 hover:bg-emerald-100 border-emerald-200',
      'bg-purple-50 hover:bg-purple-100 border-purple-200',
      'bg-amber-50 hover:bg-amber-100 border-amber-200',
      'bg-rose-50 hover:bg-rose-100 border-rose-200',
      'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
    ];
    const index =
      topicName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {loading ? (
        <div className="col-span-full text-center py-8">
          <div
            className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-500 mx-auto"
            role="status"
            aria-label="Loading"
          />
        </div>
      ) : topics?.length === 0 ? (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-600">No topics found</p>
        </div>
      ) : (
        topics.map((topic) => {
          const colorClass = getTopicColor(topic.name);
          return (
            <div
              key={topic.id}
              className={cn(
                'group relative overflow-hidden rounded-xl border-2 p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
                colorClass
              )}
              data-testid={`topic-${topic.name.toLowerCase()}`}
              onClick={() =>
                handleTopicClick(topic.name.toLowerCase(), topic.id)
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleTopicClick(topic.name.toLowerCase(), topic.id);
                }
              }}
              role="button"
              aria-label={`Learn ${topic.name}`}
              tabIndex={0}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <CourseIcon
                      language={topic.name.toLowerCase()}
                      id={topic.id}
                    />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {topic.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    Start learning {topic.name}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-gray-400 group-hover:text-gray-700 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })
      )}
    </div>
  );
};

export default LanguagesList;
