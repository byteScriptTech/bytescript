'use client';

import Navbar from '@/components/common/Navbar';
import ProblemPageContent from '@/components/specific/ProblemPageContent';
import { LocalStorageProvider } from '@/context/LocalhostContext';

export default function ProblemPage() {
  return (
    <LocalStorageProvider>
      <Navbar />
      <ProblemPageContent />
    </LocalStorageProvider>
  );
}
