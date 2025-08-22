import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { AnswerSection } from './types';

interface QuestionCardProps {
  id: string;
  question: string;
  answerArray: AnswerSection[];
  defaultOpen?: boolean;
}

const renderAnswerSection = (section: AnswerSection, index: number) => {
  console.log('section', section);
  // Handle text content
  if (section.type === 'text') {
    if (typeof section.content === 'string') {
      return (
        <div
          key={`text-${index}`}
          className="prose prose-gray dark:prose-invert max-w-none mb-6 text-gray-700 dark:text-gray-300 leading-7 mt-2"
        >
          <p className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border-l-4 shadow-sm">
            {section.content}
          </p>
        </div>
      );
    }
    // Handle array of strings
    if (Array.isArray(section.content)) {
      return (
        <div key={`text-array-${index}`} className="space-y-3 my-4">
          {section.content.map((text, i) => (
            <div key={i} className="relative pl-6">
              <span className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-2">
                {text}
              </p>
            </div>
          ))}
        </div>
      );
    }
  }
  if (Array.isArray(section.content)) {
    return (
      <div key={`text-array-${index}`} className="space-y-3 my-4">
        {section.content.map((text, i) => (
          <div key={i} className="relative pl-6">
            <span className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-2">
              {text}
            </p>
          </div>
        ))}
      </div>
    );
  }

  // Handle code content
  if (section.type === 'code') {
    // Handle object with language and code properties
    if (
      typeof section.content === 'object' &&
      section.content !== null &&
      'language' in section.content &&
      'code' in section.content
    ) {
      const { language, code } = section.content;
      return (
        <div key={`code-${index}`} className="my-4 rounded-md overflow-hidden">
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            showLineNumbers
            customStyle={{
              margin: 0,
              borderRadius: '0.375rem',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );
    }

    // Handle string content (fallback for backward compatibility)
    if (typeof section.content === 'string') {
      return (
        <div key={`code-${index}`} className="my-4 rounded-md overflow-hidden">
          <SyntaxHighlighter
            language="text"
            style={vscDarkPlus}
            showLineNumbers
            customStyle={{
              margin: 0,
              borderRadius: '0.375rem',
            }}
          >
            {section.content}
          </SyntaxHighlighter>
        </div>
      );
    }
  }

  // Fallback for any other content type
  console.warn('Unsupported answer section type:', section);
  return null;
};

export function QuestionCard({
  question,
  answerArray,
  defaultOpen = false,
}: QuestionCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <Card className="overflow-hidden">
      <CardHeader
        className="p-4 hover:bg-accent/50 cursor-pointer transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{question}</CardTitle>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="p-4 pt-0 border-t">
          <div className="prose dark:prose-invert max-w-none">
            {answerArray.map((section, index) => (
              <div key={`section-${index}`}>
                {renderAnswerSection(section, index)}
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
