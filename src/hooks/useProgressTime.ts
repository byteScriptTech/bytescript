import { LearningProgress } from '@/types/learningProgress';

export const useProgressTime = (learningProgress: LearningProgress | null) => {
  const calculateTime = (topics: LearningProgress['topics']) => {
    const incompleteTopics = topics.filter((t) => !t.isCompleted);
    const totalMinutes = incompleteTopics.length * 10;
    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return hours > 0
      ? `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min${remainingMinutes > 1 ? 's' : ''}`
      : `${totalMinutes} min${totalMinutes > 1 ? 's' : ''}`;
  };

  return learningProgress ? calculateTime(learningProgress.topics) : '';
};
