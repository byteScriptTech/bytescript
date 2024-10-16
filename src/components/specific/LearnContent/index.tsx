import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useContentContext } from '@/context/ContentContext';

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
  const topicIdArray = searchParams.getAll('id');
  const { content, loading } = useContentContext();
  const courseContent: any = content && content[0];
  const topicId = topicIdArray[1];
  useEffect(() => {
    if (topicId && courseContent) {
      const { topics } = courseContent[topicId] || {};
      setTopics(topics);
    } else if (courseContent) {
      const { topics } = courseContent || {};
      setTopics(topics);
    }
  }, [topicId, courseContent]);
  return (
    <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[20%_60%_20%] lg:grid-cols-[20%_60%_20%]">
      <Navigation
        ctid={currentTopic?.id}
        {...{ loading, topics, setCurrentTopic }}
      />
      <div className="grid gap-6 overflow-y-auto h-[calc(100vh-20vh)] custom-scrollbar">
        {loading ? (
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

export default LearnContent;
