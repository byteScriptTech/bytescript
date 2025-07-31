'use client';

import React from 'react';

import AuthGuard from '@/components/misc/authGuard';
import { AuthProvider } from '@/context/AuthContext';
import { PracticeProvider } from '@/context/PracticeContext';

import Practice from './Practice';

export const dynamic = 'force-dynamic';

export default function PracticeQuestion() {
  return (
    <AuthProvider>
      <AuthGuard>
        <PracticeProvider>
          <Practice />
        </PracticeProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
