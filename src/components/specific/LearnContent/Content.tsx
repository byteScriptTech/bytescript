import React, { useEffect } from 'react';

import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';

interface _Subtopic {
  id: string;
  name: string;
  content?: string;
  content_md?: string; // Markdown content
  examples?: any[];
}

interface ContentProps {
  topicId: string;
  subtopicId: string;
  content: any; // TODO: Replace 'any' with proper type
  onTopicClick?: (topicId: string) => void;
  onSubtopicClick?: (subtopicId: string) => void;
  renderExamples: (examples: any[]) => React.ReactNode;
}

export const Content: React.FC<ContentProps> = ({
  subtopicId: _subtopicId,
  content: currentTopic,
  renderExamples,
}) => {
  // Scroll to the active subtopic when it changes
  useEffect(() => {
    if (_subtopicId) {
      const element = document.getElementById(`subtopic-${_subtopicId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [_subtopicId]);

  if (!currentTopic) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {currentTopic.name}
        </h1>
      </div>

      <div className="w-full">
        {currentTopic.content && (
          <div className="mb-10">
            {currentTopic.content ? (
              <MarkdownRenderer className="prose dark:prose-invert max-w-none">
                {currentTopic.content}
              </MarkdownRenderer>
            ) : null}
          </div>
        )}

        {currentTopic.subtopics?.map((subtopic: _Subtopic) => (
          <div
            key={subtopic.id}
            id={`subtopic-${subtopic.id}`}
            className="mb-12 scroll-mt-20"
          >
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-border">
              {subtopic.name}
            </h2>
            {subtopic.content && (
              <div className="mb-6 prose-p:leading-relaxed">
                {subtopic.content_md ? (
                  <MarkdownRenderer>{subtopic.content_md}</MarkdownRenderer>
                ) : subtopic.content ? (
                  <div
                    className="prose-p:mb-4 last:prose-p:mb-0"
                    dangerouslySetInnerHTML={{ __html: subtopic.content }}
                  />
                ) : null}
              </div>
            )}
            {subtopic.examples && subtopic.examples.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Examples
                </h3>
                <div className="space-y-6">
                  {renderExamples(subtopic.examples)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(Content);
