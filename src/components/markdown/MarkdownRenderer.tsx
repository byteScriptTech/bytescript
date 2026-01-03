'use client';

import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  children: string;
  className?: string;
}

const components: Components = {
  h1: ({ children, ...props }) => (
    <h1 className="text-2xl font-bold mt-6 mb-4" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-xl font-semibold mt-5 mb-3" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-lg font-medium mt-4 mb-2" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-4 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  code: ({
    inline,
    className,
    children,
    ...props
  }: {
    node?: any;
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  }) => {
    // Extract language from className if needed in the future
    // const _match = /lang-(\w+)/.exec(className || '');
    return !inline ? (
      <div className="bg-gray-800 text-gray-100 rounded-lg p-4 overflow-x-auto my-4">
        <pre>
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    ) : (
      <code
        className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 px-1.5 py-0.5 rounded text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    );
  },
  table: (props) => (
    <div className="overflow-x-auto my-4">
      <table
        className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
        {...props}
      />
    </div>
  ),
  th: (props) => (
    <th
      className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),
  tr: (props) => (
    <tr
      className="bg-white dark:bg-gray-900 even:bg-gray-50 dark:even:bg-gray-800"
      {...props}
    />
  ),
} as const;

export function MarkdownRenderer({
  children,
  className = '',
}: MarkdownRendererProps) {
  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
