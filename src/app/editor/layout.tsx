import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'JavaScript Playground - biteScript',
  description: 'Learn JavaScript',
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
