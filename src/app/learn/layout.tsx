import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Learn Programming - byteScript',
  description:
    'Learn programming with byteScript. Master JavaScript, Python, data structures, algorithms, and more with interactive tutorials and hands-on coding exercises.',
  keywords: [
    'learn programming',
    'javascript tutorial',
    'python tutorial',
    'data structures',
    'algorithms',
    'coding tutorial',
    'programming course',
    'interactive coding',
    'web development',
    'programming basics',
  ],
  openGraph: {
    title: 'Learn Programming - byteScript',
    description:
      'Learn programming with byteScript. Master JavaScript, Python, data structures, and more with interactive tutorials.',
    url: 'https://bytescript.tech/learn',
    images: [
      {
        url: '/images/favicon.png',
        width: 1200,
        height: 630,
        alt: 'Learn Programming on byteScript',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learn Programming - byteScript',
    description:
      'Learn programming with byteScript. Master JavaScript, Python, data structures, and more with interactive tutorials.',
    images: ['/images/favicon.png'],
    creator: '@bytescriptTech',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Learn Programming - byteScript',
  description:
    'Learn programming with byteScript. Master JavaScript, Python, data structures, and more with interactive tutorials.',
  url: 'https://bytescript.tech/learn',
  mainEntity: {
    '@type': 'LearningResource',
    name: 'Programming Courses',
    description:
      'Interactive programming tutorials and hands-on coding exercises',
    learningResourceType: 'Tutorial',
    educationalLevel: 'Beginner to Advanced',
    teaches: [
      'JavaScript',
      'Python',
      'Data Structures',
      'Algorithms',
      'Web Development',
    ],
  },
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
