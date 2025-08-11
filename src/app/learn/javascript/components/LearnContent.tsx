'use client';

import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { PythonCodeEditor } from '@/components/common/PythonCodeEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getJavascriptContent } from '@/services/javascriptService';
import type { LanguageContent } from '@/types/content';

const LearnContent = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<LanguageContent | null>(null);
  const [activeTab, setActiveTab] = useState('topics');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getJavascriptContent();
        setContent(data);
        if (data?.topics?.length) {
          setActiveTopic(data.topics[0].id);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to load JavaScript content';
        setError(`Error: ${errorMessage}. Please try again later.`);
        console.error('Error fetching JavaScript content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const renderMarkdownContent = (text: string) => (
    <div
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );

  const renderExamples = (
    examples: Array<{
      code: string;
      description: string;
    }>
  ) => {
    return (
      <div className="space-y-4 mt-4">
        {examples.map((example, idx) => (
          <div key={idx} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b">
              <span className="text-sm font-mono text-muted-foreground">
                {example.description || 'Example'}
              </span>
            </div>
            <div className="p-2 bg-white dark:bg-gray-900">
              <PythonCodeEditor
                initialCode={example.code}
                className="text-sm border-0 rounded-none"
                readOnly={true}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSubtopic = (subtopic: any, index: number) => (
    <div key={index} className="space-y-4 mb-8">
      <h3 className="text-xl font-semibold text-primary">{subtopic.name}</h3>
      {subtopic.content && (
        <div className="prose dark:prose-invert max-w-none">
          {renderMarkdownContent(subtopic.content)}
        </div>
      )}
      {subtopic.examples && subtopic.examples.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-medium mb-3">Examples</h4>
          {renderExamples(subtopic.examples)}
        </div>
      )}
    </div>
  );

  const renderTopicContent = () => {
    if (!content || !activeTopic) return null;

    const topic = content.topics.find((t) => t.id === activeTopic);
    if (!topic) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{topic.name}</CardTitle>
          {topic.description && (
            <p className="text-muted-foreground">{topic.description}</p>
          )}
        </CardHeader>
        <CardContent>
          {topic.subtopics?.map((subtopic, idx) =>
            renderSubtopic(subtopic, idx)
          )}
        </CardContent>
      </Card>
    );
  };

  const renderTopicsList = () => {
    if (!content?.topics?.length) return null;

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {content.topics.map((topic) => (
          <Card
            key={topic.id}
            className={`cursor-pointer transition-colors ${
              activeTopic === topic.id
                ? 'border-primary'
                : 'hover:border-primary/50'
            }`}
            onClick={() => setActiveTopic(topic.id)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{topic.name}</CardTitle>
              {topic.description && (
                <p className="text-sm text-muted-foreground">
                  {topic.description}
                </p>
              )}
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  };

  const renderResources = () => {
    if (!content?.resources?.length) return null;

    return (
      <div className="space-y-4">
        {content.resources.map((resource, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="text-lg">{resource.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {resource.type} • {resource.author}
              </p>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{resource.description}</p>
              <Button asChild variant="outline">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Resource
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
        {error}
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-2">No content available</h2>
        <p className="text-muted-foreground">
          We couldn&apos;t find any JavaScript content to display.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          {content.name}
        </h1>
        <p className="text-lg text-muted-foreground">
          {content.short_description}
        </p>
      </div>

      <Tabs
        defaultValue="topics"
        className="w-full"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="topics" className="space-y-8">
          {renderTopicsList()}
          {activeTopic && renderTopicContent()}
        </TabsContent>

        <TabsContent value="resources">
          <h2 className="text-2xl font-bold mb-6">Learning Resources</h2>
          {renderResources()}
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About {content.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  What is {content.name}?
                </h3>
                <div className="prose dark:prose-invert max-w-none">
                  {content.explanation?.map((paragraph, idx) => (
                    <p key={idx} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {content.applications?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Applications</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    {content.applications.map((app, idx) => (
                      <li key={idx}>{app}</li>
                    ))}
                  </ul>
                </div>
              )}

              {content.learning_objectives?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Learning Objectives
                  </h3>
                  <ul className="space-y-2">
                    {content.learning_objectives.map(
                      (objective: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{objective}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearnContent;
