'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Topic } from '@/types/content';

import CourseIcon from '../CourseIcon';

interface LearnTopicCardProps {
  topic: Topic;
  onTopicClick?: (topic: Topic) => void;
}

export const LearnTopicCard: React.FC<LearnTopicCardProps> = ({
  topic,
  onTopicClick,
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onTopicClick) {
      onTopicClick(topic);
    } else {
      const name = topic.name.toLowerCase();
      if (name === 'competitive-programming') {
        router.push('/competitive-programming');
      } else if (name === 'data-structures-&-algorithms') {
        router.push('/data-structures');
      } else {
        router.push(
          `/language?name=${encodeURIComponent(topic.name)}&id=${topic.id}`
        );
      }
    }
  };

  const formatTopicName = (name: string): string => {
    return name.replace(/-/g, ' ').replace(/&/g, ' & ');
  };

  return (
    <div
      className="group relative flex flex-col items-center p-6 rounded-xl border border-border bg-card hover:bg-card/80 transition-colors cursor-pointer shadow-sm hover:shadow-md"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e as unknown as React.MouseEvent);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Learn ${topic.name}`}
    >
      <div className="mb-4 w-16 h-16 flex items-center justify-center rounded-lg bg-muted/50 p-2 group-hover:bg-muted transition-colors">
        <CourseIcon
          language={topic.name.toLowerCase()}
          id={topic.id}
          size={40}
        />
      </div>
      <h3 className="text-base font-medium text-center text-foreground group-hover:text-primary transition-colors">
        {formatTopicName(topic.name)}
      </h3>
      <div className="mt-2 text-xs text-muted-foreground">Start learning</div>
    </div>
  );
};

export default LearnTopicCard;
