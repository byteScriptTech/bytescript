'use client';

import { Suspense } from 'react';

import ContentWithParams from './ContentWithParams';

function ContentSuspenseWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      }
    >
      <ContentWithParams />
    </Suspense>
  );
}

export default ContentSuspenseWrapper;
