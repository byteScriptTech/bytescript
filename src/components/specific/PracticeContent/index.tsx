import { Play, Clock, BookOpen, Target, Timer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePractice } from '@/context/PracticeContext';

interface Topic {
  id: string;
  name: string;
  description?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  category?: 'problems' | 'dsa' | 'javascript' | 'python';
  order?: number;
}

interface PracticeContentProps {
  currentTopic: Topic | undefined;
  setCurrentTopic: (item: Topic) => void;
  category: string;
  topicId?: string | null;
}

const PracticeContent: React.FC<PracticeContentProps> = ({
  setCurrentTopic,
  currentTopic,
  category,
  topicId = null,
}) => {
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const { topics, loading, error, fetchTopicsByCategory } = usePractice();

  useEffect(() => {
    const filterTopics = async () => {
      setIsLoading(true);
      try {
        if (category === 'all') {
          setFilteredTopics(topics);
        } else {
          const categoryTopics = await fetchTopicsByCategory(category);
          setFilteredTopics(categoryTopics);
        }
      } catch (err) {
        console.error('Error filtering topics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    filterTopics();
  }, [category, topics, fetchTopicsByCategory]);

  // Set current topic based on URL or first topic
  useEffect(() => {
    if (filteredTopics.length > 0) {
      if (topicId) {
        const topic = filteredTopics.find((t) => t.id === topicId);
        if (topic) {
          setCurrentTopic(topic);
          return;
        }
      }
      // Set first topic if no topic is selected
      if (
        !currentTopic ||
        !filteredTopics.some((t) => t.id === currentTopic.id)
      ) {
        setCurrentTopic(filteredTopics[0]);
      }
    }
  }, [filteredTopics, topicId, currentTopic, setCurrentTopic]);

  if (loading || isLoading) {
    return <ContentSkeleton />;
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
        Error loading practice topics: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onStart={() => router.push(`/practice/${topic.id}`)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">
              No topics found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ContentSkeleton = () => (
  <div className="container mx-auto py-6 px-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <div className="w-5 h-5 bg-primary/20 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded-full bg-muted" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-6 w-3/4 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-5/6 bg-muted rounded" />
            </div>
            <div className="flex items-center gap-4 pt-4">
              <div className="h-4 w-16 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
            </div>
            <div className="pt-4 mt-auto">
              <div className="h-10 w-full bg-muted rounded" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default React.memo(PracticeContent);

function TopicCard({ topic, onStart }: { topic: Topic; onStart: () => void }) {
  const { getTimerEnabled, toggleTimer } = usePractice();
  const isTimerEnabled = getTimerEnabled(topic.id);

  const getDifficultyColor = (difficulty?: string) => {
    if (!difficulty)
      return 'bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';

    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'problems':
        return <Target className="w-5 h-5" />;
      case 'dsa':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col">
      <CardHeader className="p-5 pb-4 flex-shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            {getCategoryIcon(topic.category)}
          </div>
          <div className="flex items-center gap-2">
            {topic.difficulty && (
              <Badge
                className={`text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}
              >
                {topic.difficulty}
              </Badge>
            )}
            {topic.category && (
              <Badge variant="secondary" className="text-xs">
                {topic.category}
              </Badge>
            )}
          </div>
        </div>

        <CardTitle className="text-lg font-bold mb-2 line-clamp-2 leading-tight">
          {topic.name}
        </CardTitle>

        {topic.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {topic.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="p-5 pt-0 flex-1 flex flex-col">
        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>Self-paced</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            <span>Practice</span>
          </div>
        </div>

        {/* Tags - if available */}
        <div className="flex flex-wrap gap-1.5 mb-auto pb-4">
          <Badge variant="outline" className="text-xs">
            Interactive
          </Badge>
          {topic.category && (
            <Badge variant="outline" className="text-xs">
              {topic.category}
            </Badge>
          )}
          <Badge
            variant={isTimerEnabled ? 'default' : 'secondary'}
            className="text-xs cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggleTimer(topic.id);
            }}
          >
            <Timer className="h-3 w-3 mr-1" />
            {isTimerEnabled ? 'Timer On' : 'Timer Off'}
          </Badge>
        </div>

        {/* Actions - Stuck to bottom */}
        <div className="pt-4 mt-auto border-t border-border/50">
          <Button onClick={onStart} className="w-full group/btn">
            <Play className="h-4 w-4 mr-2 transition-transform group-hover/btn:translate-x-1" />
            Start Practice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
