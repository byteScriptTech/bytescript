import React, { useEffect, useState, useMemo } from 'react';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useContentRedux } from '@/hooks/useContentRedux';
import { useLanguagesRedux } from '@/hooks/useLanguagesRedux';
import { useLocalStorage } from '@/context/LocalhostContext';

import ContentWithSuspense from './ContentWithSuspense';
import NavigationWithSuspense from './NavigationWithSuspense';
import ScrollToTopicWithSuspense from './ScrollToTopicWithSuspense';
import type { Topic, LearnContentProps } from './types';

const LearnContent: React.FC<LearnContentProps> = ({
  setCurrentTopic,
  currentTopic,
}) => {
  const [topics, setTopics] = useState<Topic[] | undefined>([]);
  const { getItem } = useLocalStorage();

  // Track the topic ID from the current topic
  const topicId = useMemo(() => currentTopic?.id, [currentTopic?.id]);

  const currentUser = useMemo(() => getItem('user'), [getItem]);
  const currentLang = useMemo(() => getItem('lvl_name'), [getItem]);

  const { content, loading } = useContentRedux();
  const { getUserLearningProgress } = useLanguagesRedux();

  const courseContent = useMemo(() => content?.[0], [content]);

  useEffect(() => {
    if (currentLang && currentUser?.uid) {
      getUserLearningProgress(currentUser.uid, currentLang);
    }
  }, [currentLang, currentUser?.uid, getUserLearningProgress]);

  // Set current topic when topics change and we have a topicId
  useEffect(() => {
    if (!topicId || !topics?.length) return;

    const topic = topics.find((t) => t.id === topicId);
    if (topic) {
      setCurrentTopic(topic);
    }
  }, [topicId, topics, setCurrentTopic]);

  // Update topics when course content or topicId changes
  useEffect(() => {
    if (!courseContent) return;

    const newTopics: Topic[] =
      topicId && courseContent[topicId]
        ? courseContent[topicId]?.topics || []
        : courseContent.topics || [];

    setTopics((prevTopics) => {
      // Only update if topics have changed
      if (JSON.stringify(prevTopics) !== JSON.stringify(newTopics)) {
        return newTopics;
      }
      return prevTopics;
    });
  }, [courseContent, topicId]);

  return (
    <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[20%_60%_20%] lg:grid-cols-[20%_60%_20%]">
      <NavigationWithSuspense
        topics={topics || []}
        ctid={currentTopic?.id || null}
        setCurrentTopic={setCurrentTopic}
        loading={loading}
      />
      <div className="grid gap-6 overflow-y-auto h-[calc(100vh-20vh)] custom-scrollbar">
        {!content || loading ? (
          <Card className="p-6">
            <ContentSkeleton />
          </Card>
        ) : (
          <ContentWithSuspense />
        )}
      </div>
      <ScrollToTopicWithSuspense loading={loading} />
    </div>
  );
};

const ContentSkeleton = () => {
  return (
    <div className="p-4">
      <Skeleton className="h-24 rounded-xl my-2" />
      <div className="my-2">
        <Skeleton className="h-6 my-2" />
        <Skeleton className="h-6 my-2" />
        <Skeleton className="h-6 my-2" />
      </div>
    </div>
  );
};

export default React.memo(LearnContent);
