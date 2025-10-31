import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Competitive Programming - byteScript',
  description: 'Practice and improve your competitive programming skills',
};

export default function CompetitiveProgrammingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
