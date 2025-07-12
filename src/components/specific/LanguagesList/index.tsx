import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { useContentContext } from '@/context/ContentContext';
import { useLocalStorage } from '@/context/LocalhostContext';
import { useTopics } from '@/hooks/useTopics';

import CourseIcon from '../CourseIcon';

export const LanguagesList = () => {
  const router = useRouter();
  const { topics, loading } = useTopics();
  const { content, fetchContent } = useContentContext();
  const { getItem, setItem } = useLocalStorage();
  const progress = getItem('progressCache');

  const handleTopicClick = (name: string, id: string) => {
    if (name && !content) {
      fetchContent(name);
    }
    setItem('lvl_name', name);
    router.push(`/language?name=${name}&id=${id}`);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading ? (
        <div className="col-span-full text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      ) : topics?.length === 0 ? (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-600">No topics found</p>
        </div>
      ) : (
        topics.map((topic) => (
          <div
            key={topic.id}
            className="group relative"
            onClick={() => handleTopicClick(topic.name.toLowerCase(), topic.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleTopicClick(topic.name.toLowerCase(), topic.id);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <CourseIcon language={topic.name.toLowerCase()} id={topic.id} />
            <div className="absolute inset-0 bg-black/10 rounded-lg transition-opacity group-hover:opacity-100 opacity-0"></div>
          </div>
        ))
      )}
    </div>
  );
};

export default LanguagesList;
