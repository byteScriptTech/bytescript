/* eslint-disable no-unused-vars */
import Link from 'next/link';
import React, { use, useEffect } from 'react';

import { useBreadcrumbContext } from '@/context/BreadCrumbContext';

type Topic = {
  id: string;
  name: string;
};
interface NavigationProps {
  topics?: Topic[];
  ctid: string | undefined;
  setCurrentTopic: (topic: Topic) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  topics,
  ctid,
  setCurrentTopic,
}) => {
  const { data, addItem } = useBreadcrumbContext();

  useEffect(() => {
    const datalen = data && data.length;
    if (datalen) {
      data[datalen - 1] && setCurrentTopic(data[data.length - 1]);
    }
  }, [data]);

  const handleTopicClick = (topic: Topic) => {
    setCurrentTopic(topic);
    addItem(topic);
  };

  return (
    <nav className="grid gap-4 h-[calc(100vh-30vh)] text-sm text-muted-foreground overflow-y-auto">
      {topics?.map((topic) => (
        <Link
          onClick={() => handleTopicClick(topic)}
          className={ctid === topic.id ? 'font-semibold text-primary' : ''}
          key={topic.id}
          href="#"
        >
          {topic.name}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
