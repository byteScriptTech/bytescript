'use client';

import { Suspense } from 'react';

import ScrollToTopic from './ScrollToTopic';
import type { ScrollToTopicProps } from './ScrollToTopic';

function ScrollToTopicSuspenseWrapper(props: ScrollToTopicProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-2 p-4">
          <div className="h-6 w-3/4 bg-muted/30 rounded-md animate-pulse" />
          <div className="h-4 w-1/2 bg-muted/30 rounded-md animate-pulse" />
        </div>
      }
    >
      <ScrollToTopic {...props} />
    </Suspense>
  );
}

export default ScrollToTopicSuspenseWrapper;
