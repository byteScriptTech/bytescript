import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Learn - biteScript',
  description: 'Learn to code',
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
