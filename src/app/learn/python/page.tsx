'use client';

import { LocalStorageProvider } from '@/context/LocalhostContext';
import LearnContentWrapper from './LearnContentWrapper';

export const dynamic = 'force-dynamic';

export default function LearnPage() {
  return (
    <LocalStorageProvider>
      <LearnContentWrapper />
    </LocalStorageProvider>
  );
}
