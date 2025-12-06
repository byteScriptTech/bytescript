'use client';

import React from 'react';

import AuthGuard from '@/components/misc/authGuard';
import { AuthProvider } from '@/context/AuthContext';

import CustomTest from './CustomTest';

export const dynamic = 'force-dynamic';

export default function CustomTestPage() {
  return (
    <AuthProvider>
      <AuthGuard>
        <CustomTest />
      </AuthGuard>
    </AuthProvider>
  );
}
