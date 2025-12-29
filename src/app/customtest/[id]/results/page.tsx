'use client';

import React from 'react';

import AuthGuard from '@/components/misc/authGuard';

import CustomTestResults from './CustomTestResults';

export const dynamic = 'force-dynamic';

export default function CustomTestResultsPage() {
  return (
    
      <AuthGuard>
        <CustomTestResults />
      </AuthGuard>
    
  );
}
