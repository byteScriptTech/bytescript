import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Competitive Programming - byteScript',
  description:
    'Master competitive programming with byteScript. Practice coding challenges, improve algorithm skills, and prepare for coding interviews with our comprehensive problem set.',
  keywords: [
    'competitive programming',
    'coding challenges',
    'algorithm practice',
    'data structures',
    'coding interview prep',
    'programming competitions',
    'coding exercises',
    'problem solving',
    'coding practice platform',
  ],
  openGraph: {
    title: 'Competitive Programming - byteScript',
    description:
      'Master competitive programming with byteScript. Practice coding challenges and prepare for interviews.',
    url: 'https://bytescript.tech/competitive-programming',
    images: [
      {
        url: '/images/favicon.png',
        width: 1200,
        height: 630,
        alt: 'Competitive Programming on byteScript',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Competitive Programming - byteScript',
    description:
      'Master competitive programming with byteScript. Practice coding challenges and prepare for interviews.',
    images: ['/images/favicon.png'],
    creator: '@bytescriptTech',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Competitive Programming - byteScript',
  description:
    'Master competitive programming with byteScript. Practice coding challenges and prepare for interviews.',
  url: 'https://bytescript.tech/competitive-programming',
  mainEntity: {
    '@type': 'LearningResource',
    name: 'Competitive Programming',
    description: 'Practice coding challenges and improve your algorithm skills',
    learningResourceType: 'Coding Challenges',
    educationalLevel: 'Beginner to Advanced',
  },
};

export default function CompetitiveProgrammingLayout({
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
