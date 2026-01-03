import { Timer } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Progress } from '@/components/ui/progress';
import { useTimerSettings } from '@/hooks/useTimerSettings';
import { useGetTopicBySlugQuery } from '@/store/slices/dsaTopicsSlice';
import { DSATopic } from '@/types/dsa';
import { PracticeQuestion } from '@/types/practiceQuestion';

interface QuestionHeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  timeRemaining: number | null;
  progress: number;
  setTimeRemaining: (time: number) => void;
  mockQuestions: PracticeQuestion[];
}

export function QuestionHeader({
  setTimeRemaining,
  mockQuestions,
  currentQuestionIndex,
  totalQuestions,
  timeRemaining,
  progress,
}: QuestionHeaderProps) {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const topicQuery = useGetTopicBySlugQuery(id || '', { skip: !id });
  const { getTimerEnabled } = useTimerSettings();
  const router = useRouter();

  const isTimerEnabled = id ? getTimerEnabled(id) : true;

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const [topic, setTopic] = useState<DSATopic | null>(null);
  useEffect(() => {
    if (!id) {
      router.push('/practice');
      return;
    }

    if (topicQuery.isError) {
      router.push('/practice');
      return;
    }

    if (topicQuery.data) {
      setTopic(topicQuery.data);

      // Set initial time remaining based on first question
      if (mockQuestions[0]?.timeLimit) {
        setTimeRemaining(mockQuestions[0].timeLimit);
      }
    }
  }, [
    id,
    topicQuery.data,
    topicQuery.isError,
    router,
    mockQuestions,
    setTimeRemaining,
  ]);

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-2">{topic?.title} Practice</h1>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
        {isTimerEnabled && (
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span className="font-medium">{formatTime(timeRemaining)}</span>
          </div>
        )}
      </div>
      <Progress value={progress} className="mt-2" />
    </div>
  );
}
