'use client';

import { Suspense } from 'react';

import Navigation from './Navigation';
import type { NavigationProps } from './Navigation';

function NavigationSuspenseWrapper(props: NavigationProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-full bg-muted/30 rounded-md animate-pulse"
            />
          ))}
        </div>
      }
    >
      <Navigation {...props} />
    </Suspense>
  );
}

export default NavigationSuspenseWrapper;
