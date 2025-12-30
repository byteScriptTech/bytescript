'use client';

import dynamic from 'next/dynamic';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { JavaScriptCodeEditor } from '@/components/common/CodeEditor';
import CollapsibleSidebar from '@/components/common/CollapsibleSidebar';
import { FloatingMenuButton } from '@/components/common/FloatingMenuButton/FloatingMenuButton';
import { Content } from '@/components/specific/LearnContent/Content';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/utils';
import { useGetJavascriptContentQuery } from '@/store/slices/javascriptSlice';
import type { LanguageContent } from '@/types/content';

const DraggableCircle = dynamic(
  () =>
    import('@/components/ui/DraggableCircle').then(
      (mod) => mod.DraggableCircle
    ),
  { ssr: false }
);

const DraggableEditor = dynamic(
  () =>
    import('@/components/editor/DraggableEditor').then(
      (mod) => mod.DraggableEditor
    ),
  { ssr: false, loading: () => <div className="w-full h-full bg-background" /> }
);

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

  // Redux hook for JavaScript content
  const javascriptContentQuery = useGetJavascriptContentQuery();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const isMobile = useIsMobile();

  // Auto-open sidebar on desktop
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  }, [isMobile]);

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
      const params = new URLSearchParams(searchParams?.toString() ?? '');
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

  const scrollToExercises = useCallback(() => {
    const exercisesSection = document.getElementById('exercises-section');
    if (exercisesSection) {
      exercisesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.scrollBy(0, -20);
      setActiveSubtopic(null);
    }
  }, []);

  useEffect(() => {
    const isLoading = javascriptContentQuery.isLoading;
    const hasData = !!javascriptContentQuery.data;
    const hasError = !!javascriptContentQuery.error;

    setLoading(isLoading);

    if (hasError) {
      const errorMessage =
        javascriptContentQuery.error instanceof Error
          ? javascriptContentQuery.error.message
          : 'Failed to load JavaScript content';
      setError(`Error: ${errorMessage}. Please try again later.`);
    }

    // Set content when data is available
    if (hasData) {
      setContent(javascriptContentQuery.data || null);
      if (javascriptContentQuery.data?.topics?.length) {
        setActiveTopic(javascriptContentQuery.data.topics[0].id);
      }
    } else if (!isLoading && !hasError) {
      // No data and not loading - set content to null to show "No content available"
      setContent(null);
    }
  }, [
    javascriptContentQuery.isLoading,
    javascriptContentQuery.data,
    javascriptContentQuery.error,
  ]);

  // Update loading and error states from Redux
  useEffect(() => {
    setLoading(javascriptContentQuery.isLoading);
    if (javascriptContentQuery.error) {
      const errorMessage =
        javascriptContentQuery.error instanceof Error
          ? javascriptContentQuery.error.message
          : 'Failed to load JavaScript content';
      setError(`Error: ${errorMessage}. Please try again later.`);
    }
  }, [javascriptContentQuery.isLoading, javascriptContentQuery.error]);

  // Handle initial content load and set the active topic/subtopic from URL params
  useEffect(() => {
    if (!content?.topics?.length) return;
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
                height="300px"
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

      <FloatingMenuButton
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <DraggableCircle onClick={() => setShowEditor(true)} />

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
      <CollapsibleSidebar
        defaultOpen={sidebarOpen}
        isMobile={isMobile}
        header="JavaScript Topics"
        className={cn(
          isMobile ? 'w-4/5 max-w-xs' : '',
          isMobile && 'fixed z-50',
          isMobile && !sidebarOpen && '-translate-x-full',
          isMobile && 'transition-transform duration-300 ease-in-out'
        )}
        items={content.topics?.map((topic) => ({
          id: topic.id,
          name: topic.name,
          isActive: activeTopic === topic.id,
          onClick: () => {
            setActiveTopic(topic.id);
            setActiveSubtopic(null);
          },
          children: [
            ...(topic.subtopics?.map((subtopic) => ({
              id: subtopic.id,
              name: subtopic.name,
              isActive: activeSubtopic === subtopic.id,
              onClick: () => {
                scrollToSubtopic(subtopic.id);
                if (isMobile) {
                  setSidebarOpen(false);
                }
              },
            })) || []),
            ...(topic.exercises?.length
              ? [
                  {
                    id: `exercises-${topic.id}`,
                    name: `Exercises (${topic.exercises.length})`,
                    onClick: () => {
                      scrollToExercises();
                      if (isMobile) {
                        setSidebarOpen(false);
                      }
                    },
                  },
                ]
              : []),
          ],
        }))}
        activeItemId={activeTopic}
        activeChildId={activeSubtopic}
        collapsible={!isMobile}
      />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 h-[calc(100vh-64px)]">
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
            </div>
          )}
        </div>
      </div>

      {showEditor && (
        <div className="fixed z-50">
          <DraggableEditor
            defaultPosition={{ x: 100, y: 100 }}
            defaultSize={{ width: 800, height: 500 }}
            onClose={() => setShowEditor(false)}
            defaultEditorType="javascript"
            hideTabs={true}
            showAlgorithm={false}
          />
        </div>
      )}
    </div>
  );
};

export default function LearnContent({
  initialTopicId = null,
  initialSubtopicId = null,
}: {
  initialTopicId?: string | null;
  initialSubtopicId?: string | null;
}) {
  return (
    <LearnContentInner
      initialTopicId={initialTopicId}
      initialSubtopicId={initialSubtopicId}
    />
  );
}
