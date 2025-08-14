'use client';

import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';

import { PythonCodeEditor } from '@/components/common/PythonCodeEditor';
import { Content } from '@/components/specific/LearnContent/Content';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { getPythonContent } from '@/services/pythonService';
import type { LanguageContent } from '@/types/content';

interface LearnContentInnerProps {
  initialTopicId?: string | null;
  initialSubtopicId?: string | null;
  children?: React.ReactNode;
}

// These props are passed from the URL but not currently used
const LearnContentInner = ({
  // These props are intentionally unused for now
  // They're kept for future implementation
  initialTopicId: _initialTopicId = null,
  initialSubtopicId: _initialSubtopicId = null,
}: LearnContentInnerProps) => {
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
      const sidebar = document.getElementById('python-sidebar');
      const menuButton = document.getElementById('python-menu-button');
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
    const element = document.getElementById(`subtopic-${subtopicId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.scrollBy(0, -20);
    }
  }, []);

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

  useEffect(() => {
    if (activeSubtopic) {
      const element = document.getElementById(`subtopic-${activeSubtopic}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.scrollBy(0, -20);
      }
    }
  }, [activeSubtopic, activeTopic]);

  const currentTopic = content?.topics?.find(
    (topic) => topic.id === activeTopic
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!content || !currentTopic) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <div>No content available</div>
      </div>
    );
  }

  const _renderMarkdownContent = (content: string) => (
    <div
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );

  const renderExamples = (
    examples: { code: string; description?: string }[]
  ) => (
    <div className="space-y-6">
      {examples.map((example, idx) => (
        <div key={idx} className="space-y-2">
          {example.description && (
            <p className="text-sm text-muted-foreground">
              {example.description}
            </p>
          )}
          <PythonCodeEditor
            initialCode={example.code}
            readOnly
            className="rounded-lg overflow-hidden border"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile menu button */}
      <button
        type="button"
        className={cn(
          'fixed left-4 top-4 z-50 rounded-md p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden',
          isMobile && sidebarOpen && 'hidden'
        )}
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>

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
        id="python-sidebar"
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 border-r bg-background transition-transform duration-300 ease-in-out md:relative md:z-40',
          !sidebarOpen && '-translate-x-full md:translate-x-0 md:w-20',
          'flex flex-col h-full shadow-lg md:shadow-none',
          isMobile ? 'w-4/5 max-w-xs' : ''
        )}
      >
        <div className="flex items-center justify-between p-4 border-b h-16">
          {sidebarOpen ? (
            <h2 className="text-lg font-semibold">Python Topics</h2>
          ) : (
            <div className="w-6" /> // Spacer for alignment
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

      {/* Main Content */}
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
                  onTopicClick={(topicId) => {
                    setActiveTopic(topicId);
                    setActiveSubtopic(null);
                  }}
                  onSubtopicClick={(subtopicId) => {
                    setActiveSubtopic(subtopicId);
                    scrollToSubtopic(subtopicId);
                  }}
                  renderExamples={renderExamples}
                />
              )}
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
  return (
    <LearnContentInner
      initialTopicId={initialTopicId}
      initialSubtopicId={initialSubtopicId}
    />
  );
}
