import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Learn - byteScript',
  description: 'Your learning page',
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
