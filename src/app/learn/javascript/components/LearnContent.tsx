'use client';

import { CheckCircle2, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { JavaScriptCodeEditor } from '@/components/common/JavaScriptCodeEditor';
import { Content } from '@/components/specific/LearnContent/Content';
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

interface LearnContentInnerProps {
  initialTopicId?: string | null;
  initialSubtopicId?: string | null;
  children?: ReactNode;
}

const LearnContentInner: FC<LearnContentInnerProps> = ({
  initialTopicId: _initialTopicId = null,
  initialSubtopicId: _initialSubtopicId = null,
}) => {
  // Use refs to store the initial values to avoid re-running effects
  const initialTopicId = useRef(_initialTopicId);
  const initialSubtopicId = useRef(_initialSubtopicId);
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

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const scrollToSubtopic = useCallback(
    (subtopicId: string) => {
      setActiveSubtopic(subtopicId);
      const params = new URLSearchParams(searchParams.toString());
      params.set('subtopic', subtopicId);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });

      // Use a small timeout to ensure the DOM is updated
      const timer = setTimeout(() => {
        const element = document.getElementById(`subtopic-${subtopicId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.scrollBy(0, -20);
        }
      }, 100);

      return () => clearTimeout(timer);
    },
    [pathname, router, searchParams, setActiveSubtopic]
  );

  const fetchContent = useCallback(async () => {
    try {
      const data = await getJavascriptContent();
      setContent(data);
      if (data?.topics?.length) {
        setActiveTopic(data.topics[0].id);
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
  }, []);

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

  // Handle initial content load and set the active topic/subtopic from URL params
  useEffect(() => {
    if (!content?.topics?.length) return;
    console.log(content, 'content');
    // If we have an initial topic ID from URL, use it
    if (initialTopicId.current) {
      const topicExists = content.topics.some(
        (topic: { id: string }) => topic.id === initialTopicId.current
      );

      if (topicExists) {
        // Only update if the topic is different from current active topic
        if (activeTopic !== initialTopicId.current) {
          setActiveTopic(initialTopicId.current);
        }

        // If we also have a subtopic ID, set it and scroll to it
        if (initialSubtopicId.current) {
          setActiveSubtopic(initialSubtopicId.current);
          // Small delay to ensure the DOM is updated
          const timer = setTimeout(() => {
            const element = document.getElementById(
              `subtopic-${initialSubtopicId.current}`
            );
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              window.scrollBy(0, -20); // Small offset for header
            }
          }, 300);
          return () => clearTimeout(timer);
        }
        return;
      }
    }

    // Fallback to first topic if no valid topic ID in URL
    if (!activeTopic && content.topics.length > 0) {
      setActiveTopic(content.topics[0].id);
    }
  }, [content, activeTopic, scrollToSubtopic]);

  const _renderMarkdownContent = (text: string) => (
    <div
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );

  const renderExamples = useCallback((examples: Example[] = []) => {
    if (!examples || examples.length === 0) {
      return null;
    }

    return (
      <div className="space-y-6">
        {examples.map((example, index) => (
          <div key={`example-${index}`} className="space-y-2">
            {example.description && (
              <p className="text-sm text-muted-foreground">
                {example.description}
              </p>
            )}
            <div className="w-full min-h-[300px] overflow-visible">
              <JavaScriptCodeEditor
                initialCode={example.code}
                readOnly={false}
                className="w-full"
                showRunButton={true}
                showOutput={true}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }, []);

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

  if (!content) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                <Content
                  topicId={activeTopic || ''}
                  subtopicId={activeSubtopic || ''}
                  content={currentTopic}
                  renderExamples={renderExamples}
                />
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

// This is the inner component that doesn't use useSearchParams directly
export default function LearnContent({
  initialTopicId = null,
  initialSubtopicId = null,
}: {
  initialTopicId?: string | null;
  initialSubtopicId?: string | null;
}) {
  // Rest of the component implementation
  console.log(initialTopicId, initialSubtopicId);
  return (
    <LearnContentInner
      initialTopicId={initialTopicId}
      initialSubtopicId={initialSubtopicId}
    />
  );
}
