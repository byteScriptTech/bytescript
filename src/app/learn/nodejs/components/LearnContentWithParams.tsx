'use client';

import { useSearchParams } from 'next/navigation';

import LearnContent from './LearnContent';

function LearnContentWithParamsInner() {
  const searchParams = useSearchParams();
  const initialTopicId = searchParams?.get('topic') ?? null;
  const initialSubtopicId = searchParams?.get('subtopic') ?? null;

  return (
    <LearnContent
      initialTopicId={initialTopicId}
      initialSubtopicId={initialSubtopicId}
    />
  );
}

export default function LearnContentWithParams() {
  return <LearnContentWithParamsInner />;
}
