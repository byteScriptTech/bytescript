import { notFound } from 'next/navigation';

import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { dsaServerUtils } from '@/lib/dsaServerUtils';

import { DSATopicClient } from './DSATopicClient';

interface DSATopicPageProps {
  params: {
    slug: string;
  };
}

export default async function DSATopicPage({ params }: DSATopicPageProps) {
  const { slug } = await params;
  try {
    const topic = await dsaServerUtils.getTopicBySlug(slug);

    if (!topic) {
      notFound();
    }

    // Helper function to safely convert timestamps to ISO strings
    const toISOString = (date: any) => {
      if (!date) return null;
      if (date instanceof Date) return date.toISOString();
      if (typeof date === 'object' && 'toDate' in date) {
        return date.toDate().toISOString();
      }
      return date;
    };

    // Convert Firestore timestamps to plain objects
    const serializedTopic = {
      ...topic,
      createdAt: toISOString(topic.createdAt),
      updatedAt: toISOString(topic.updatedAt),
      lastUpdated: toISOString(topic.updatedAt), // Use updatedAt as fallback
      deletedAt: null,
    };

    return (
      <DSATopicClient topic={serializedTopic}>
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 lg:px-16">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {topic.title}
              </h1>
              {topic.difficulty && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {topic.difficulty.charAt(0).toUpperCase() +
                    topic.difficulty.slice(1)}
                </span>
              )}
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <div className="prose-base sm:prose-lg max-w-none">
                <MarkdownRenderer>{topic.content || ''}</MarkdownRenderer>
              </div>
            </div>

            {topic.examples && topic.examples.length > 0 && (
              <div className="mt-8 space-y-6">
                <h2 className="text-2xl font-semibold">Examples</h2>
                <div className="space-y-6">
                  {topic.examples.map((example, index) => (
                    <div
                      key={index}
                      className="space-y-4 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      {example.input && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Input:
                          </p>
                          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                            <pre className="whitespace-pre-wrap text-sm">
                              {example.input}
                            </pre>
                          </div>
                        </div>
                      )}
                      {example.output && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Output:
                          </p>
                          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                            <pre className="whitespace-pre-wrap text-sm">
                              {example.output}
                            </pre>
                          </div>
                        </div>
                      )}
                      {example.explanation && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Explanation:
                          </p>
                          <div className="prose dark:prose-invert max-w-none text-sm">
                            <MarkdownRenderer>
                              {example.explanation}
                            </MarkdownRenderer>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DSATopicClient>
    );
  } catch (error) {
    console.error('Error loading DSA topic:', error);
    notFound();
  }
}

export async function generateStaticParams() {
  const topics = await dsaServerUtils.getAllTopics();
  return topics.map((topic: any) => ({
    slug: topic.slug,
  }));
}
