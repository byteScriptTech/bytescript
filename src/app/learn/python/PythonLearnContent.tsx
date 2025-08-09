'use client';

import { BookOpen, CheckCircle2, Clock, Lightbulb } from 'lucide-react';
import { useEffect, useState } from 'react';

import { PythonCodeEditor } from '@/components/common/PythonCodeEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPythonContent } from '@/services/pythonService';
import type { LanguageContent } from '@/types/content';

const PythonLearnContent = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<LanguageContent | null>(null);
  const [activeTab, setActiveTab] = useState('topics');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getPythonContent();
        setContent(data);
        if (data?.topics?.length) {
          setActiveTopic(data.topics[0].id);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load Python content';
        setError(`Error: ${errorMessage}. Please try again later.`);
        console.error('Error fetching Python content:', err);
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
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl">{topic.name}</CardTitle>
              <div className="flex items-center gap-2">
                {topic.difficulty && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                    {topic.difficulty}
                  </span>
                )}
                {topic.timeToComplete && (
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {topic.timeToComplete} min
                  </span>
                )}
              </div>
            </div>
            {topic.description && (
              <p className="text-muted-foreground text-lg">
                {topic.description}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {topic.content && (
            <div className="prose dark:prose-invert max-w-none text-justify">
              {renderMarkdownContent(topic.content)}
            </div>
          )}

          {topic.learningObjectives && topic.learningObjectives.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-lg border border-blue-100 dark:border-blue-900/30">
              <h3 className="text-xl font-semibold flex items-center mb-4 text-blue-700 dark:text-blue-300">
                <Lightbulb className="w-5 h-5 mr-2" />
                Learning Objectives
              </h3>
              <ul className="space-y-2 pl-1">
                {topic.learningObjectives?.map((obj, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {topic.subtopics && topic.subtopics.length > 0 && (
            <div className="space-y-8">
              <h3 className="text-xl font-semibold flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                What You&apos;ll Learn
              </h3>
              <div className="space-y-8">
                {topic.subtopics.map(renderSubtopic)}
              </div>
            </div>
          )}
          {topic.sections?.map((section, sectionIdx) => (
            <div key={sectionIdx} className="space-y-4">
              {section.type === 'text' && (
                <div>
                  {section.title && (
                    <h3 className="text-xl font-semibold mb-2">
                      {section.title}
                    </h3>
                  )}
                  <div className="prose dark:prose-invert max-w-none">
                    {section.content}
                  </div>
                  {section.keyPoints && (
                    <ul className="mt-4 space-y-2">
                      {section.keyPoints?.map((point, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {section.type === 'code' && (
                <div>
                  <h4 className="text-lg font-medium mb-2">{section.title}</h4>
                  <PythonCodeEditor
                    initialCode={section.content || ''}
                    className="mb-2"
                  />
                  {section.explanation && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {section.explanation}
                    </p>
                  )}
                </div>
              )}
              {section.type === 'exercise' && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">
                    <span className="mr-2">💡</span>
                    {section.title}
                  </h4>
                  <p className="mb-3">{section.task}</p>
                  {section.hint && (
                    <details className="mb-3">
                      <summary className="text-sm font-medium text-muted-foreground cursor-pointer">
                        Show Hint
                      </summary>
                      <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded text-sm">
                        {section.hint}
                      </div>
                    </details>
                  )}
                  {section.solution && (
                    <details>
                      <summary className="text-sm font-medium text-muted-foreground cursor-pointer">
                        Show Solution
                      </summary>
                      <div className="mt-2">
                        <PythonCodeEditor
                          initialCode={section.solution || ''}
                          className="text-sm"
                        />
                      </div>
                    </details>
                  )}
                </div>
              )}
              {section.type === 'quiz' && (
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">
                    <span className="mr-2">❓</span>
                    {section.question}
                  </h4>
                  <div className="space-y-2 mb-3">
                    {section.options?.map((option, idx) => (
                      <div
                        key={idx}
                        className={`p-2 border rounded ${
                          section.correctAnswer === idx
                            ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}. {option}
                      </div>
                    ))}
                  </div>
                  {section.explanation && (
                    <div className="text-sm text-muted-foreground p-2 bg-white dark:bg-gray-800 rounded">
                      <span className="font-medium">Explanation:</span>{' '}
                      {section.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {topic.commonMistakes && topic.commonMistakes.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                Common Mistakes to Avoid
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {topic.commonMistakes?.map((mistake, idx) => (
                  <li key={idx} className="text-red-700 dark:text-red-300">
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {topic.resources && topic.resources.length > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                Additional Resources
              </h3>
              <div className="grid gap-3">
                {topic.resources?.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 hover:bg-white dark:hover:bg-gray-800 rounded transition-colors"
                  >
                    <span className="text-green-600 dark:text-green-400">
                      {resource.type === 'documentation'
                        ? '📚'
                        : resource.type === 'video'
                          ? '🎥'
                          : '📄'}
                    </span>
                    <div>
                      <div className="font-medium">{resource.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {new URL(resource.url).hostname}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <p className="text-red-600 dark:text-red-400">
          {error || 'No content available'}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Python Learning Path</h1>
        <p className="text-muted-foreground">
          Learn Python from the ground up with our comprehensive tutorials and
          exercises.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Topics</h2>
            <div className="space-y-2">
              {content.topics?.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopic(topic.id)}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTopic === topic.id
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium'
                      : 'hover:bg-accent'
                  }`}
                >
                  {topic.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList>
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="topics" className="space-y-8">
              {renderTopicContent()}
            </TabsContent>

            <TabsContent value="challenges">
              <h2 className="text-2xl font-bold mb-6">Practice Challenges</h2>
              {content.challenges?.length > 0 ? (
                <div className="space-y-6">
                  {content.challenges.map((challenge, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle>Challenge {idx + 1}</CardTitle>
                        {challenge.difficulty && (
                          <span className="text-sm text-muted-foreground">
                            Difficulty: {challenge.difficulty}
                          </span>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="prose dark:prose-invert max-w-none">
                          {challenge.description}
                        </div>

                        {challenge.requirements && (
                          <div>
                            <h4 className="font-medium mb-2">Requirements:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {challenge.requirements.map((req, i) => (
                                <li key={i}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {challenge.example && (
                          <div>
                            <h4 className="font-medium mb-2">Example:</h4>
                            <PythonCodeEditor
                              initialCode={challenge.example || ''}
                              className="text-sm"
                            />
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button variant="outline">View Solution</Button>
                          <Button>Submit Code</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No challenges available for this topic yet.</p>
              )}
            </TabsContent>

            <TabsContent value="resources">
              <h2 className="text-2xl font-bold mb-6">Learning Resources</h2>
              {content.resources && content.resources.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {content.resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <h4 className="font-medium">{resource.title}</h4>
                      {resource.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {resource.description}
                        </p>
                      )}
                      {resource.author && (
                        <p className="text-xs text-muted-foreground mt-2">
                          By {resource.author}
                        </p>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        {new URL(resource.url).hostname}
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p>No additional resources available.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PythonLearnContent;
