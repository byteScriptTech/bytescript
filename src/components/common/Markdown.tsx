'use client';

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownProps {
  content?: string;
}

export default function Markdown({ content }: MarkdownProps) {
  if (!content) return null;
  const contentString = typeof content === 'string' ? content : '';

  return (
    <div className="prose max-w-none">
      {contentString.split('\n').map((line, index) => {
        if (line.trim().startsWith('```')) {
          const language = line.slice(3).trim();
          const code = content
            .split('\n')
            .slice(index + 1)
            .find((line) => !line.trim().startsWith('```'));

          if (code) {
            return (
              <SyntaxHighlighter
                key={index}
                language={language}
                style={atomDark}
                className="rounded-lg p-4"
              >
                {code}
              </SyntaxHighlighter>
            );
          }
        }
        return <p key={index}>{line}</p>;
      })}
    </div>
  );
}
