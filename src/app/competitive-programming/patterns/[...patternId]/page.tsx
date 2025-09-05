import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { problemsService } from '@/services/firebase/problemsService';
import { patternService } from '@/services/patternService';

import { PatternCategories } from './components/PatternCategories';
import { PatternHeader } from './components/PatternHeader';
import { ProblemCard } from './components/ProblemCard';
import { PatternPageClient } from './PatternPageClient';

// Cache the pattern fetch to deduplicate requests
const getPatternBySlug = cache(async (slug: string) => {
  try {
    return await patternService.getPatternBySlug(slug);
  } catch (error) {
    console.error('Error fetching pattern:', error);
    return null;
  }
});

interface PageProps {
  params: { patternId: string[] };
}

export const revalidate = 3600; // Revalidate at most every hour

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = params.patternId?.[0] || '';
  const pattern = await getPatternBySlug(slug);

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
    // Get the pattern by slug (uses cached version)
    const pattern = await getPatternBySlug(slug);

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
  const { pattern, problems } = await fetchPatternData(patternId);

  return (
    <PatternPageClient>
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <PatternHeader
            title={pattern.title}
            description={pattern.description}
          />
          {pattern.category && (
            <PatternCategories categories={pattern.category} />
          )}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="overview" className="text-sm font-medium">
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="problems"
              className="text-sm font-medium relative"
            >
              <div className="flex items-center gap-2">
                <span>Problems</span>
                <Badge
                  variant="secondary"
                  className="flex h-5 w-5 items-center justify-center p-0 bg-muted-foreground/10 dark:bg-muted-foreground/20 text-foreground/80"
                >
                  {problems.length}
                </Badge>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
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
          </TabsContent>

          <TabsContent value="problems" className="space-y-4">
            <div className="grid gap-4">
              {problems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No problems found for this pattern.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {problems.map((problem) => {
                    return (
                      <ProblemCard
                        key={problem.id}
                        id={problem.id}
                        title={problem.title}
                        description={problem.description}
                        difficulty={problem.difficulty}
                        tags={problem.tags}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PatternPageClient>
  );
}
