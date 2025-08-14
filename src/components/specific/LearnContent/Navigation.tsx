import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { useBreadcrumbContext } from '@/context/BreadCrumbContext';
import { useLocalStorage } from '@/context/LocalhostContext';

import type { Topic } from './types';

export interface NavigationProps {
  topics?: Topic[];
  ctid: string | undefined;
  setCurrentTopic: (topic: Topic) => void;
  loading: boolean;
  topicName?: string | null;
  topicId?: string | null;
}

const Navigation: React.FC<NavigationProps> = ({
  topics,
  ctid,
  setCurrentTopic,
  loading,
  topicName = null,
  topicId = null,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data, addItem } = useBreadcrumbContext();
  const { setItem } = useLocalStorage();

  // Update current topic when ctid or topics change
  useEffect(() => {
    if (topics && topics.length > 0 && ctid) {
      const currentTopic = topics.find((topic) => topic.id === ctid);
      if (currentTopic) {
        setCurrentTopic(currentTopic);
      }
    }
  }, [ctid, topics, setCurrentTopic]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (topicName) params.append('name', topicName);
    if (topicId) params.append('id', topicId);
    setItem('lvt', `${pathname}?${params.toString()}`);
    setItem('lvt_name', data[data.length - 1]?.name);
  }, [topicName, topicId, setItem, data, pathname]);

  const handleTopicClick = (topic: Topic) => {
    const params = new URLSearchParams();
    if (topicName) params.append('name', topicName);
    if (topicId) params.append('id', topicId);
    params.append('name', topic.name);
    params.append('id', topic.id);
    router.push(`${pathname}?${params.toString()}`);

    setCurrentTopic(topic);
    addItem(topic);
  };

  return (
    <nav className="grid gap-4 h-[calc(100vh-30vh)] text-sm text-muted-foreground overflow-y-auto custom-scrollbar">
      {loading && <Skeleton className="h-100 w-full" />}
      {topics?.map((topic) => (
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleTopicClick(topic)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleTopicClick(topic);
            }
          }}
          className={ctid === topic.id ? 'font-semibold text-primary' : ''}
          key={topic.id}
        >
          {topic.name}
        </div>
      ))}
    </nav>
  );
};

export default Navigation;
