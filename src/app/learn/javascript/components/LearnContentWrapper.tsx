'use client';

import { Suspense } from 'react';

import LearnContentWithParams from './LearnContentWithParams';

// This is the component that will be used in the page
export default function LearnContentWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      }
    >
      <LearnContentWithParams />
    </Suspense>
  );
}
