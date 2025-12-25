import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Code Playground - Interactive Coding Environment | byteScript',
  description:
    'Practice coding in our interactive playground. Write, run, and debug JavaScript and Python code in your browser. Perfect for learning, experimenting, and testing algorithms.',
  keywords: [
    'code playground',
    'online code editor',
    'javascript playground',
    'python playground',
    'interactive coding',
    'learn to code',
    'code practice',
    'programming sandbox',
  ],
  openGraph: {
    title: 'Code Playground - Interactive Coding Environment | byteScript',
    description:
      'Practice coding in our interactive playground. Write, run, and debug JavaScript and Python code in your browser.',
    type: 'website',
    url: 'https://bytescript.tech/editor',
    images: [
      {
        url: '/images/favicon.png',
        width: 1200,
        height: 630,
        alt: 'Code Playground - Interactive Coding Environment',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code Playground - Interactive Coding Environment | byteScript',
    description:
      'Practice coding in our interactive playground. Write, run, and debug JavaScript and Python code in your browser.',
    images: ['/images/favicon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
