import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import PatternPageWrapper from './PatternPageWrapper';

interface PageProps {
  params: { patternId: string[] };
}

export const revalidate = 3600; // Revalidate at most every hour

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.patternId?.[0] || '';

  return {
    title: `${slug} - Problem Solving Pattern`,
    description: 'Learn coding patterns and algorithms',
  };
}

export default async function PatternPage({ params }: PageProps) {
  const resolvedParams = await params;
  const patternId = resolvedParams.patternId?.[0] || '';

  if (!patternId) {
    notFound();
  }

  return <PatternPageWrapper slug={patternId} />;
}
