import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useContentContext } from '@/context/ContentContext';
import { useLanguages } from '@/context/LanguagesContext';
import { useLocalStorage } from '@/context/LocalhostContext';

import { Content } from './Content';
import Navigation from './Navigation';
import ScrollToTopic from './ScrollToTopic';

interface Topic {
  id: string;
  name: string;
}
interface LearnContentProps {
  currentTopic: Topic | undefined;
  setCurrentTopic: (item: Topic) => void;
}
const LearnContent: React.FC<LearnContentProps> = ({
  setCurrentTopic,
  currentTopic,
}) => {
  const [topics, setTopics] = useState<Topic[] | undefined>([]);
  const searchParams = useSearchParams();
  const { getItem } = useLocalStorage();
  const topicIdArray = searchParams.getAll('id');
  const topicId = topicIdArray[1];

  const currentUser = React.useMemo(() => getItem('user'), [getItem]);
  const currentLang = React.useMemo(() => getItem('lvl_name'), [getItem]);

  const { content, loading } = useContentContext();
  const { getUserLearningProgress } = useLanguages();

  const courseContent = React.useMemo(() => content?.[0], [content]);

  useEffect(() => {
    if (currentLang && currentUser?.uid) {
      getUserLearningProgress(currentUser.uid, currentLang);
    }
  }, [currentLang, currentUser?.uid]);

  // Update topics when course content or topicId changes
  useEffect(() => {
    if (!courseContent) return;

    const newTopics =
      topicId && courseContent[topicId]
        ? courseContent[topicId]?.topics
        : courseContent.topics;

    setTopics((prevTopics) => {
      // Only update if topics have actually changed
      if (JSON.stringify(prevTopics) !== JSON.stringify(newTopics)) {
        return newTopics;
      }
      return prevTopics;
    });
  }, [courseContent, topicId]);

  return (
    <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[20%_60%_20%] lg:grid-cols-[20%_60%_20%]">
      <Navigation
        ctid={currentTopic?.id}
        {...{ loading, topics, setCurrentTopic }}
      />
      <div className="grid gap-6 overflow-y-auto h-[calc(100vh-20vh)] custom-scrollbar">
        {!content || loading ? (
          <Card className="h-1/2">
            <ContentSkeleton />
          </Card>
        ) : (
          <Content />
        )}
      </div>
      <ScrollToTopic loading={loading} />
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
