'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

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
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      }
    >
      <LearnContentWithParamsInner />
    </Suspense>
  );
}
