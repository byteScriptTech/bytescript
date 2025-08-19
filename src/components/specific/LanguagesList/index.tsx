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
      router.push('/learn/data-structures');
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
    const colorVariants = [
      'bg-blue-100/50 dark:bg-blue-900/30 hover:bg-blue-200/50 dark:hover:bg-blue-800/50 border-blue-200 dark:border-blue-800',
      'bg-emerald-100/50 dark:bg-emerald-900/30 hover:bg-emerald-200/50 dark:hover:bg-emerald-800/50 border-emerald-200 dark:border-emerald-800',
      'bg-purple-100/50 dark:bg-purple-900/30 hover:bg-purple-200/50 dark:hover:bg-purple-800/50 border-purple-200 dark:border-purple-800',
      'bg-amber-100/50 dark:bg-amber-900/30 hover:bg-amber-200/50 dark:hover:bg-amber-800/50 border-amber-200 dark:border-amber-800',
      'bg-rose-100/50 dark:bg-rose-900/30 hover:bg-rose-200/50 dark:hover:bg-rose-800/50 border-rose-200 dark:border-rose-800',
      'bg-indigo-100/50 dark:bg-indigo-900/30 hover:bg-indigo-200/50 dark:hover:bg-indigo-800/50 border-indigo-200 dark:border-indigo-800',
    ];
    const index =
      topicName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colorVariants.length;
    return colorVariants[index];
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
                'group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
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
                  <div className="h-12 w-12 rounded-lg bg-background flex items-center justify-center shadow-sm">
                    <CourseIcon
                      language={topic.name.toLowerCase()}
                      id={topic.id}
                    />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {topic.name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    Start learning {topic.name}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors"
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
