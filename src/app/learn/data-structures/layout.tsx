import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Data Structures & Algorithms - byteScript',
  description: 'Learn Data Structures & Algorithms',
};

export default function DataStructuresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
