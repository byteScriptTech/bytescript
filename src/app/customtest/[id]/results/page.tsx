'use client';

import React from 'react';

import AuthGuard from '@/components/misc/authGuard';
import { AuthProvider } from '@/context/AuthContext';

import CustomTestResults from './CustomTestResults';

export const dynamic = 'force-dynamic';

export default function CustomTestResultsPage() {
  return (
    <AuthProvider>
      <AuthGuard>
        <CustomTestResults />
      </AuthGuard>
    </AuthProvider>
  );
}
