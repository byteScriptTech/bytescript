import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useLanguages } from '@/context/LanguagesContext';
import { useLocalStorage } from '@/context/LocalhostContext';
import { useProgressTime } from '@/hooks/useProgressTime';
import { LearningProgress } from '@/types/learningProgress';

import { ActionButtons } from './ActionButtons';
import { CarryOnCardTitle } from './CarryOnCardTitle';
import { EmptyState } from './EmptyState';
import { ProgressInfo } from './ProgressInfo';

const CarryOnWhereLeft: React.FC = () => {
  const router = useRouter();
  const { getItem } = useLocalStorage();
  const { learningProgress, getUserLearningProgress } = useLanguages();
  const currentLang = getItem('lvl_name');
  const lvt_name = getItem('lvt_name');
  const lvt = getItem('lvt');
  const lvt_sub = getItem('lvt_sub');
  const user = getItem('user');
  const estimatedReadTime = useProgressTime(
    learningProgress as LearningProgress | null
  );

  useEffect(() => {
    if (user && currentLang) {
      getUserLearningProgress(user?.uid, currentLang);
    }
  }, [user, currentLang, getUserLearningProgress]);

  const handleCarryOnClick = () => {
    router.push(`${lvt}&lvt_sub=${lvt_sub}`);
  };

  if (!currentLang) {
    return <EmptyState />;
  }

  return (
    <Card className="bg-white rounded-lg p-6 shadow-sm">
      <CardHeader>
        <CarryOnCardTitle />
        <ProgressInfo
          language={currentLang}
          timeLeft={estimatedReadTime}
          progress={learningProgress?.progress || 0}
        />
      </CardHeader>
      <CardContent>
        <ActionButtons
          onCarryOn={handleCarryOnClick}
          lastVisitedTopic={lvt_name}
        />
      </CardContent>
    </Card>
  );
};

export default CarryOnWhereLeft;
