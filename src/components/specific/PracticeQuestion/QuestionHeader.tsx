import { Timer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Progress } from '@/components/ui/progress';
import { usePractice } from '@/context/PracticeContext';
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
  const { id } = useParams<{ id: string }>();
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  const { getTopic } = usePractice();
  const router = useRouter();

  const [topic, setTopic] = useState<any>(null);
  useEffect(() => {
    const loadTopic = async () => {
      try {
        const topicData = await getTopic(id);
        if (!topicData) {
          router.push('/practice');
          return;
        }
        console.log(topicData, 'topicData');
        setTopic(topicData);

        // In a real app, we would fetch questions from an API
        // const questions = await fetchQuestionsForTopic(id);
        // setQuestions(questions);

        // Set initial time remaining based on first question
        if (mockQuestions[0]?.timeLimit) {
          setTimeRemaining(mockQuestions[0].timeLimit);
        }
      } catch (error) {
        console.error('Error loading topic:', error);
        router.push('/practice');
      }
    };

    loadTopic();
  }, [id]);

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-2">{topic?.name} Practice</h1>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4" />
          <span className="font-medium">{formatTime(timeRemaining)}</span>
        </div>
      </div>
      <Progress value={progress} className="mt-2" />
    </div>
  );
}
