'use client';

import { Menu } from 'lucide-react';
import React, { useEffect, useState, useCallback, useMemo } from 'react';

import CollapsibleSidebar from '@/components/common/CollapsibleSidebar/CollapsibleSidebar';
import { PythonCodeEditor } from '@/components/common/PythonCodeEditor';
import { Content } from '@/components/specific/LearnContent/Content';
import { cn } from '@/lib/utils';
import { getPythonContent } from '@/services/pythonService';
import type { LanguageContent } from '@/types/content';
import type { SidebarItem } from '@/types/practice';

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
  const [_activeItemId, setActiveItemId] = useState<string | null>(null);

  // Check if mobile view on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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

  const sidebarItems = useMemo<SidebarItem[]>(() => {
    if (!content?.topics) return [];

    return content.topics.map((topic) => ({
      id: topic.id,
      name: topic.name,
      isActive: activeTopic === topic.id,
      onClick: () => {
        setActiveTopic(topic.id);
        setActiveSubtopic(null);
        if (isMobile) setSidebarOpen(false);
      },
      children: topic.subtopics?.map((subtopic) => ({
        id: subtopic.id || `${topic.id}-${subtopic.id}`,
        name: subtopic.name || 'Untitled',
        isActive: activeSubtopic === subtopic.id,
        onClick: () => {
          setActiveTopic(topic.id);
          setActiveSubtopic(subtopic.id);
          scrollToSubtopic(subtopic.id);
          if (isMobile) setSidebarOpen(false);
        },
      })),
    }));
  }, [content?.topics, activeTopic, activeSubtopic, isMobile]);

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
          <div className="h-96 min-h-[24rem]">
            <PythonCodeEditor
              initialCode={example.code}
              readOnly
              showAlgorithm={false}
              className="h-full rounded-lg overflow-hidden border"
            />
          </div>
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

      <CollapsibleSidebar
        items={sidebarItems}
        header="Python Topics"
        defaultOpen={true}
        isMobile={isMobile}
        collapsible={true}
        activeItemId={activeTopic}
        activeChildId={activeSubtopic}
        onItemClick={(item) => {
          setActiveItemId(item.id);
          if (item.onClick) item.onClick();
        }}
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 border-r bg-background transition-transform duration-300 ease-in-out md:relative md:z-40',
          !sidebarOpen && '-translate-x-full md:translate-x-0 md:w-20',
          isMobile ? 'w-4/5 max-w-xs' : ''
        )}
      />

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
