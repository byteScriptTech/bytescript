'use client';

import { BookOpen, FileCode, FileCode2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { cn } from '@/lib/utils';
import { Topic } from '@/types/content';

// Extend the base Topic type with UI-specific properties
type ExtendedTopic = Omit<Topic, 'difficulty'> & {
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  duration?: string;
  description?: string;
};

interface LearnTopicCardProps {
  topic: ExtendedTopic;
  variant?: 'default' | 'featured';
  onTopicClick?: (topic: Topic) => void;
}

export const LearnTopicCard: React.FC<LearnTopicCardProps> = ({
  topic,
  variant = 'default',
  onTopicClick,
}) => {
  const router = useRouter();
  console.log(topic);
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onTopicClick) {
      onTopicClick(topic);
      return;
    }

    const name = topic.name.toLowerCase();
    const routes: Record<string, string> = {
      'competitive-programming': '/competitive-programming',
      'data-structures-&-algorithms': '/learn/data-structures',
    };

    router.push(routes[name] || `/learn/${name}`);
  };

  const formatTopicName = (name: string): string => {
    return name.replace(/-/g, ' ').replace(/&/g, ' & ');
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-blue-100 text-blue-800',
      advanced: 'bg-purple-100 text-purple-800',
    } as const;

    return (
      colors[difficulty.toLowerCase() as keyof typeof colors] ||
      'bg-gray-100 text-gray-800'
    );
  };

  const getTopicIcon = (topicName: string) => {
    const name = topicName.toLowerCase();

    // Programming Languages
    if (name.includes('javascript') || name.includes('js'))
      return <FileCode2 className="w-5 h-5" />;
    if (name.includes('python') || name.includes('java'))
      return <FileCode className="w-5 h-5" />;

    // Default icon for all other cases
    return <BookOpen className="w-5 h-5" />;
  };

  return (
    <div className="relative h-full">
      <div
        className={cn(
          'relative flex flex-col h-full rounded-lg border border-border bg-card/50 overflow-hidden',
          variant === 'featured' && 'ring-1 ring-primary/10',
          'cursor-pointer' // Keep cursor pointer for clickable indication
        )}
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
        <div className="p-5 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              {getTopicIcon(topic.name)}
            </div>
            {topic.difficulty && (
              <span
                className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded',
                  getDifficultyColor(topic.difficulty)
                )}
              >
                {topic.difficulty.charAt(0).toUpperCase() +
                  topic.difficulty.slice(1)}
              </span>
            )}
          </div>

          <div className="flex-grow">
            <h3 className="text-lg font-bold mb-2 text-foreground line-clamp-2">
              {formatTopicName(topic.name)}
            </h3>
            {topic.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {topic.description}
              </p>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-border/50">
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 text-muted-foreground mr-2" />
              <span className="text-sm font-medium text-muted-foreground">
                {topic.duration || 'Varies'}
              </span>
            </div>

            <div className="mt-4 flex items-center text-sm font-medium text-primary">
              Start Learning
              <svg
                className="ml-1.5 w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnTopicCard;
