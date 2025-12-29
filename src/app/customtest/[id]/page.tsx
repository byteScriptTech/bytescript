'use client';

import React from 'react';

import AuthGuard from '@/components/misc/authGuard';

import CustomTest from './CustomTest';

export const dynamic = 'force-dynamic';

export default function CustomTestPage() {
  return (
    
      <AuthGuard>
        <CustomTest />
      </AuthGuard>
    
  );
}
