'use client';

import { LocalStorageProvider } from '@/context/LocalhostContext';
import LearnContentWrapper from './components/LearnContentWrapper';

export const dynamic = 'force-dynamic';

export default function LearnNodejsPage() {
  return (
    <LocalStorageProvider>
      <LearnContentWrapper />
    </LocalStorageProvider>
  );
}
