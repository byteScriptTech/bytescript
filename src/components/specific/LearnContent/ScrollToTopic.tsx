import React from 'react';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useContentContext } from '@/context/ContentContext';

type ScrollToTopicProps = {
  loading: boolean;
};

const ScrollToTopic: React.FC<ScrollToTopicProps> = ({ loading }) => {
  const { scrollToList } = useContentContext();
  const handleScrollToTopic = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <React.Fragment>
        <Card className="h-1/2 flex flex-col gap-2 p-4">
          <Skeleton className="h-[125px] w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-[150px]" />
        </Card>
      </React.Fragment>
    );
  }

  return (
    <Card className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Topics</h2>
      <div className="flex flex-col gap-2">
        {scrollToList[0]?.views.map((topic: { name: string; id: string }) => (
          <button
            key={topic.id}
            className="p-2 rounded-md hover:bg-gray-100 cursor-pointer transition duration-200 text-sm"
            onClick={() => handleScrollToTopic(topic.id)}
          >
            <p className="text-gray-700 text-left">{topic.name}</p>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default ScrollToTopic;
