import { Cpu } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { problemsService } from '@/services/firebase/problemsService';
import { patternService } from '@/services/patternService';

interface PageProps {
  params: { patternId: string[] };
}

export const revalidate = 3600; // Revalidate at most every hour

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = params.patternId?.[0] || '';
  const pattern = await patternService.getPatternBySlug(slug);

  if (!pattern) {
    return {
      title: 'Pattern Not Found',
    };
  }

  return {
    title: `${pattern.title} - Problem Solving Pattern`,
    description: pattern.description,
  };
}

async function fetchPatternData(slug: string) {
  try {
    // Get the pattern by slug
    const pattern = await patternService.getPatternBySlug(slug);

    if (!pattern) {
      console.log(`Pattern not found with slug: ${slug}`);
      notFound();
    }

    // Get all problems and filter by the pattern's slug
    const allProblems = await problemsService.getAllProblems();
    const patternSlugLower = pattern.slug.toLowerCase();

    const problems = allProblems.filter((problem) => {
      return (
        problem.tags?.some(
          (tag) =>
            typeof tag === 'string' && tag.toLowerCase() === patternSlugLower
        ) ||
        (problem.category &&
          typeof problem.category === 'string' &&
          problem.category.toLowerCase() === patternSlugLower)
      );
    });

    return { pattern, problems };
  } catch (error) {
    console.error('Error fetching pattern data:', error);
    notFound();
  }
}

export default async function PatternPage({ params }: PageProps) {
  const patternId = params.patternId?.[0] || '';
  const { pattern } = await fetchPatternData(patternId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Cpu className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {pattern.title}
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              {pattern.description}
            </p>
            {pattern.category && (
              <div className="mt-4 flex flex-wrap gap-2">
                {pattern.category
                  .split(',')
                  .map((cat: string) => cat.trim())
                  .filter(Boolean)
                  .map((category: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {category}
                    </Badge>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <Card className="overflow-hidden">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Pattern Overview</h2>
            <p className="text-muted-foreground">
              Learn how to apply the {pattern.title} pattern to solve coding
              problems efficiently.
            </p>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none prose-headings:font-semibold prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-lg prose-p:leading-relaxed prose-ul:pl-6 prose-li:my-1">
              <MarkdownRenderer>{pattern.readme}</MarkdownRenderer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
