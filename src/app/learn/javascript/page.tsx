'use client';

import Navbar from '@/components/common/Navbar';
import { LocalStorageProvider } from '@/context/LocalhostContext';

import LearnContentWrapper from './components/LearnContentWrapper';

export const dynamic = 'force-dynamic';

export default function LearnJavascriptPage() {
  return (
    <LocalStorageProvider>
      <Navbar />
      <LearnContentWrapper />
    </LocalStorageProvider>
  );
}
