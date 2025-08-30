import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { problemsService } from '@/services/firebase/problemsService';
import { patternService } from '@/services/patternService';

interface PageProps {
  params: { patternId: string[] };
}

export const revalidate = 3600; // Revalidate at most every hour

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const patternId = params.patternId?.[0] || '';
  const pattern = await patternService.getPatternById(patternId);

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
    // First try to get the pattern by slug
    const pattern = await patternService.getPatternById(slug);

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
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{pattern.title}</h1>
        <p className="text-muted-foreground mt-2">{pattern.description}</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-xs mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="problems">
            Problems ({problems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="prose dark:prose-invert max-w-none">
            <MarkdownRenderer>{pattern.readme}</MarkdownRenderer>
          </div>
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
                {problems.map((problem) => (
                  <Card
                    key={problem.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium">
                            <Link
                              href={`/competitive-programming/problems/${problem.id}`}
                              className="hover:underline"
                            >
                              {problem.title}
                            </Link>
                          </h3>
                          <div className="flex gap-2 mt-1">
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                problem.difficulty === 'Easy'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : problem.difficulty === 'Medium'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}
                            >
                              {problem.difficulty}
                            </span>
                            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                              Not Started
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {problem.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {problem.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {problem.tags?.slice(0, 3).map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {problem.tags && problem.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{problem.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
