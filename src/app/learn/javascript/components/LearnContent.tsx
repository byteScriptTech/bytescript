'use client';

import { CheckCircle2, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useCallback } from 'react';

import { JavaScriptCodeEditor } from '@/components/common/JavaScriptCodeEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { getJavascriptContent } from '@/services/javascriptService';
import type { LanguageContent } from '@/types/content';

interface Example {
  code: string;
  description?: string;
}

// Main component that doesn't use search params directly
export interface LearnContentProps {
  initialTopicId?: string | null;
}

const LearnContent: React.FC<LearnContentProps> = ({
  initialTopicId = null,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<LanguageContent | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [activeSubtopic, setActiveSubtopic] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('js-sidebar');
      const menuButton = document.getElementById('js-menu-button');
      if (
        sidebarOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, isMobile]);

  const scrollToSubtopic = useCallback((subtopicId: string) => {
    setActiveSubtopic(subtopicId);
    // Use a small timeout to ensure the DOM is updated
    setTimeout(() => {
      const element = document.getElementById(`subtopic-${subtopicId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Small offset to account for fixed header
        window.scrollBy(0, -20);
      }
    }, 0);
  }, []);

  const fetchContent = useCallback(async () => {
    try {
      const data = await getJavascriptContent();
      setContent(data);
      if (data?.topics?.length) {
        // Use initialTopicId if provided and valid, otherwise default to first topic
        const topicToSet = data.topics.some(
          (topic) => topic.id === initialTopicId
        )
          ? initialTopicId
          : data.topics[0].id;
        setActiveTopic(topicToSet);
      }
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to load JavaScript content';
      setError(`Error: ${errorMessage}. Please try again later.`);
      console.error('Error fetching JavaScript content:', err);
      throw err;
    }
  }, [initialTopicId]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        await fetchContent();
      } catch (error) {
        // Error is already handled in fetchContent
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [fetchContent]);

  // Handle initial content load and set the first topic as active
  useEffect(() => {
    if (content && content.topics?.length > 0 && !activeTopic) {
      setActiveTopic(content.topics[0].id);
    }
  }, [content, activeTopic]);

  const renderMarkdownContent = (text: string) => (
    <div
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );

  // Track the state of each code block by its index
  const [codeStates, setCodeStates] = useState<
    Record<number, { output: string; isRunning: boolean; key?: string }>
  >({});

  const runCode = useCallback(async (code: string, index: number) => {
    // Generate a unique key for this code block based on its content and index
    const blockKey = `${index}_${code.length}`;

    // Update state for this specific code block
    setCodeStates((prev) => {
      const currentState = prev[index] || { output: '', isRunning: false };
      return {
        ...prev,
        [index]: {
          ...currentState,
          isRunning: true,
          output: 'Running...',
          key: blockKey, // Add the key to track the current execution
        },
      };
    });

    try {
      const result = await new Promise<string>((resolve) => {
        try {
          const logs: string[] = [];
          const safeConsole = {
            log: (...args: unknown[]) => {
              const logMessage = args
                .map((arg) => {
                  try {
                    return typeof arg === 'object'
                      ? JSON.stringify(arg, null, 2)
                      : String(arg);
                  } catch {
                    return String(arg);
                  }
                })
                .join(' ');
              logs.push(logMessage);
              return logMessage;
            },
          };
          const executeCode = new Function(
            'console',
            `
              try {
                ${code.includes('return ') ? '' : 'return '}${code}
              } catch (e) {
                return 'Error: ' + (e instanceof Error ? e.message : String(e));
              }
            `
          );
          const executionResult = executeCode(safeConsole);
          if (logs.length > 0) {
            resolve(logs.join('\n'));
          } else if (executionResult !== undefined) {
            resolve(String(executionResult));
          } else {
            resolve('Code executed successfully (no output)');
          }
        } catch (error) {
          resolve(
            'Error: ' +
              (error instanceof Error ? error.message : 'Unknown error')
          );
        }
      });

      // Update only this code block's output if the key hasn't changed
      setCodeStates((prev) => {
        // Only update if this is still the same code block (prevent race conditions)
        if (prev[index]?.key === blockKey) {
          return {
            ...prev,
            [index]: {
              ...prev[index],
              output: result,
              isRunning: false,
            },
          };
        }
        return prev;
      });
    } catch (error) {
      setCodeStates((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          output:
            'Error: ' +
            (error instanceof Error ? error.message : 'Unknown error'),
          isRunning: false,
        },
      }));
    }
  }, []);

  const renderExamples = useCallback(
    (examples: Example[] = []) => {
      // Create a stable reference to the examples array
      return (
        <div className="space-y-6">
          {examples.map((example, index) => {
            // Get the current state for this specific code block
            const blockState = codeStates[index] || {};

            return (
              <div key={`example-${index}`} className="space-y-2">
                {example.description && (
                  <p className="text-sm text-muted-foreground">
                    {example.description}
                  </p>
                )}
                <div className="relative">
                  <JavaScriptCodeEditor
                    key={`editor-${index}`}
                    initialCode={example.code}
                    readOnly={false}
                    onRun={async (code) => runCode(code, index)}
                    className="w-full h-64"
                  />
                  {blockState.isRunning && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>
                {blockState.output && (
                  <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-muted-foreground">
                        Output:
                      </span>
                      <button
                        onClick={() => {
                          setCodeStates((prev) => ({
                            ...prev,
                            [index]: { ...prev[index], output: '' },
                          }));
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground"
                        title="Clear output"
                      >
                        Clear
                      </button>
                    </div>
                    <pre className="font-mono text-sm whitespace-pre-wrap break-words">
                      {blockState.output}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    },
    [codeStates, runCode]
  );

  // Removed unused _renderObjectives function

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading JavaScript content...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>No content available</p>
      </div>
    );
  }

  const currentTopic =
    content.topics?.find((topic) => topic.id === activeTopic) ||
    content.topics?.[0];

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden relative">
      {/* Mobile menu button */}
      <Button
        id="js-menu-button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-4 left-4 z-50 md:hidden p-3 rounded-full bg-primary text-primary-foreground shadow-lg"
        aria-label="Toggle menu"
        variant="default"
        size="icon"
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 md:hidden cursor-default"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* Sidebar */}
      <div
        id="js-sidebar"
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 border-r bg-background transition-transform duration-300 ease-in-out md:relative md:z-40',
          !sidebarOpen && '-translate-x-full md:translate-x-0 md:w-20',
          'flex flex-col h-full shadow-lg md:shadow-none',
          isMobile ? 'w-4/5 max-w-xs' : ''
        )}
      >
        <div className="flex items-center justify-between p-4 border-b h-16">
          {sidebarOpen ? (
            <h2 className="text-lg font-semibold">JavaScript Topics</h2>
          ) : (
            <div className="w-6" aria-hidden="true" />
          )}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'ml-auto transition-opacity',
              !sidebarOpen && 'opacity-0 md:opacity-100'
            )}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {content.topics?.map((topic) => (
              <div key={topic.id} className="space-y-1">
                {!sidebarOpen ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            activeTopic === topic.id ? 'secondary' : 'ghost'
                          }
                          className="justify-center px-0 w-10 h-10 rounded-full mx-auto"
                          onClick={() => {
                            setActiveTopic(topic.id);
                            setActiveSubtopic(null);
                          }}
                        >
                          <span className="text-sm font-medium">
                            {topic.name.charAt(0)}
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" sideOffset={10}>
                        <p>{topic.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Button
                    variant={activeTopic === topic.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-left"
                    onClick={() => {
                      setActiveTopic(topic.id);
                      setActiveSubtopic(null);
                    }}
                  >
                    {topic.name}
                  </Button>
                )}
                {activeTopic === topic.id && topic.subtopics && sidebarOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {topic.subtopics.map((subtopic) => (
                      <Button
                        key={subtopic.id}
                        variant={
                          activeSubtopic === subtopic.id ? 'secondary' : 'ghost'
                        }
                        size="sm"
                        className="w-full justify-start text-muted-foreground hover:text-foreground"
                        onClick={() => scrollToSubtopic(subtopic.id)}
                      >
                        {subtopic.name}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {error ? (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          ) : (
            <div className="space-y-8">
              {currentTopic && (
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {currentTopic.name}
                  </h1>
                  {currentTopic.description && (
                    <p className="text-lg text-muted-foreground mb-6">
                      {currentTopic.description}
                    </p>
                  )}

                  <div className="prose dark:prose-invert max-w-none">
                    {currentTopic.content && (
                      <div className="mb-8">
                        {renderMarkdownContent(currentTopic.content)}
                      </div>
                    )}

                    {currentTopic.subtopics?.map((subtopic) => (
                      <div
                        key={subtopic.id}
                        id={`subtopic-${subtopic.id}`}
                        className="mb-8 pt-2 -mt-2"
                      >
                        <h2 className="text-2xl font-semibold mb-4">
                          {subtopic.name}
                        </h2>
                        {subtopic.content && (
                          <div className="mb-4">
                            {renderMarkdownContent(subtopic.content)}
                          </div>
                        )}
                        {subtopic.examples && subtopic.examples.length > 0 && (
                          <div className="mt-6">
                            <h3 className="text-lg font-medium mb-3">
                              Examples
                            </h3>
                            {renderExamples(subtopic.examples)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Tabs defaultValue="resources" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-xs mb-8">
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="about">About JavaScript</TabsTrigger>
                </TabsList>

                <TabsContent value="resources" className="space-y-6">
                  <h2 className="text-2xl font-bold">Learning Resources</h2>
                  {content.recommended_resources?.length > 0 ? (
                    <div className="grid gap-4">
                      {content.recommended_resources.map(
                        (
                          resource: {
                            title: string;
                            type?: string;
                            description?: string;
                            url?: string;
                          },
                          index: number
                        ) => (
                          <Card key={index}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">
                                  {resource.title}
                                </CardTitle>
                                <span className="text-sm text-muted-foreground">
                                  {resource.type || 'Resource'}
                                </span>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {resource.description && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  {resource.description}
                                </p>
                              )}
                              <Button
                                asChild
                                variant="link"
                                className="p-0 h-auto"
                              >
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary"
                                >
                                  View Resource
                                </a>
                              </Button>
                            </CardContent>
                          </Card>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No resources available at the moment.
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="about" className="space-y-6">
                  <h2 className="text-2xl font-bold">About JavaScript</h2>
                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          What is JavaScript?
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
                          <h3 className="text-lg font-semibold mb-2">
                            Applications
                          </h3>
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
          )}
        </div>
      </div>
    </div>
  );
};

// Component that uses search params
const LearnContentWithSearchParams = () => {
  const searchParams = useSearchParams();
  const topicId = searchParams.get('topic');
  return <LearnContent initialTopicId={topicId} />;
};

export { LearnContent };
export default LearnContentWithSearchParams;
