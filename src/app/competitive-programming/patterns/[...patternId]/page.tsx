import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { problemsService } from '@/services/firebase/problemsService';
import { patternService } from '@/services/patternService';

import { PatternCategories } from './components/PatternCategories';
import { PatternHeader } from './components/PatternHeader';
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
                    const difficultyColors = {
                      Easy: 'border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/50 dark:text-green-300',
                      Medium:
                        'border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
                      Hard: 'border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/50 dark:text-red-300',
                    };

                    const difficulty = problem.difficulty || 'Medium';

                    return (
                      <Card
                        key={problem.id}
                        className="group hover:shadow-md transition-all duration-200 overflow-hidden border-l-4 border-l-transparent hover:border-l-primary"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex flex-col space-y-1.5">
                            <div className="flex justify-between items-start gap-4">
                              <Link
                                href={`/competitive-programming/problems/${problem.id}`}
                                className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md -ml-2 px-2 py-1 -mt-1"
                              >
                                <h3 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
                                  {problem.title}
                                </h3>
                              </Link>
                              <div className="flex-shrink-0">
                                <span
                                  className={cn(
                                    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                                    difficultyColors[
                                      difficulty as keyof typeof difficultyColors
                                    ] || difficultyColors.Medium
                                  )}
                                >
                                  {difficulty}
                                </span>
                              </div>
                            </div>

                            {problem.description && (
                              <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                                {problem.description}
                              </p>
                            )}
                          </div>
                        </CardHeader>

                        <CardFooter className="pt-0">
                          <div className="flex flex-wrap items-center justify-between w-full gap-2">
                            <div className="flex flex-wrap gap-1">
                              {problem.tags?.slice(0, 3).map((tag: string) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs font-normal px-2 py-0.5 h-5"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {problem.tags && problem.tags.length > 3 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs h-5 px-2 py-0.5"
                                >
                                  +{problem.tags.length - 3}
                                </Badge>
                              )}
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              className="ml-auto"
                              asChild
                            >
                              <Link
                                href={`/competitive-programming/problems/${problem.id}`}
                              >
                                Solve Challenge
                              </Link>
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
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
