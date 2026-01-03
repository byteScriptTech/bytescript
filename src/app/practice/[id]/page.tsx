'use client';

import React from 'react';

import AuthGuard from '@/components/misc/authGuard';

import Practice from './Practice';

export const dynamic = 'force-dynamic';

export default function PracticeQuestion() {
  return (
    <AuthGuard>
      <Practice />
    </AuthGuard>
  );
}
