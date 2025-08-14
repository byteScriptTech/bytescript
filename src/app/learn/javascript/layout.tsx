import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'JavaScript - biteScript',
  description: 'Learn JavaScript',
};

export default function JavaScriptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
