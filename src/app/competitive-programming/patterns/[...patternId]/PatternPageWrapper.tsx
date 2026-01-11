'use client';

import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetPatternBySlugQuery } from '@/store/slices/patternsSlice';

import { PatternCategories } from './components/PatternCategories';
import { PatternHeader } from './components/PatternHeader';
import { ProblemsTab } from './components/ProblemsTab';
import { PatternPageClient } from './PatternPageClient';

interface PatternPageWrapperProps {
  slug: string;
}

export default function PatternPageWrapper({ slug }: PatternPageWrapperProps) {
  const { data: pattern, isLoading, error } = useGetPatternBySlugQuery(slug);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading pattern...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="text-center py-8">
          <p className="text-destructive">
            Error loading pattern: {(error as any)?.data || 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  if (!pattern) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="text-center py-8">
          <p className="text-destructive">Pattern not found</p>
        </div>
      </div>
    );
  }

  return (
    <PatternPageClient pattern={pattern}>
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
            <ProblemsTab patternSlug={pattern.slug} />
          </TabsContent>
        </Tabs>
      </div>
    </PatternPageClient>
  );
}
