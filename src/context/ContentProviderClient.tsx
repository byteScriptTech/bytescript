'use client';

import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';

import { ContentProvider } from './ContentContext';

function ContentProviderClientInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const topicNameArray = searchParams.getAll('name');
  const topicName = topicNameArray[0];

  return <ContentProvider topicName={topicName}>{children}</ContentProvider>;
}

export function ContentProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <ContentProviderClientInner>{children}</ContentProviderClientInner>
    </Suspense>
  );
}
