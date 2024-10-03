'use client';
import AuthGuard from '@/components/misc/authGuard';

export default function Home() {
  return (
    <AuthGuard>
      <div>Landing Page!</div>
    </AuthGuard>
  );
}
