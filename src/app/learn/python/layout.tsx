import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Learn Python - byteScript',
  description: 'Learn Python',
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
