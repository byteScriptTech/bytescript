import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

import { NavigationProps, Topic } from './types';

export const Navigation: React.FC<NavigationProps> = ({
  topics,
  ctid,
  setCurrentTopic,
  loading,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  // Update current topic when ctid or topics change
  useEffect(() => {
    if (topics?.length && ctid) {
      const currentTopic = topics.find((topic) => topic.id === ctid);
      if (currentTopic) {
        setCurrentTopic(currentTopic);
      }
    }
  }, [ctid, topics, setCurrentTopic]);

  const handleTopicClick = (topic: Topic) => {
    const params = new URLSearchParams();
    params.set('topic', topic.id);
    router.push(`${pathname}?${params.toString()}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="grid gap-4 h-[calc(100vh-30vh)] text-sm text-muted-foreground overflow-y-auto custom-scrollbar">
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
