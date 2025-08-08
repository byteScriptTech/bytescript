'use client';

import { Code, Lightbulb, ChevronRight, CheckCircle } from 'lucide-react';
import React, { useState } from 'react';

// Dummy data for Python topics
const pythonTopics = [
  { id: 'getting-started', title: 'Getting Started', completed: true },
  { id: 'syntax', title: 'Basic Syntax', completed: true },
  { id: 'variables', title: 'Variables and Types', completed: true },
  { id: 'operators', title: 'Operators', completed: false },
  { id: 'control-flow', title: 'Control Flow', completed: false },
  { id: 'functions', title: 'Functions', completed: false },
  { id: 'data-structures', title: 'Data Structures', completed: false },
  { id: 'modules', title: 'Modules and Packages', completed: false },
  { id: 'file-handling', title: 'File Handling', completed: false },
  { id: 'exceptions', title: 'Exception Handling', completed: false },
];

// Dummy content for each topic
const topicContent: Record<string, any> = {
  'getting-started': {
    title: 'Getting Started with Python',
    sections: [
      {
        type: 'text',
        title: 'What is Python?',
        content:
          'Python is a high-level, interpreted programming language known for its readability and versatility. It supports multiple programming paradigms including procedural, object-oriented, and functional programming.',
      },
      {
        type: 'code',
        title: 'Your First Python Program',
        content: 'print("Hello, World!")',
        language: 'python',
      },
      {
        type: 'tip',
        content:
          'Python uses indentation to define code blocks, so be consistent with your spacing!',
      },
    ],
  },
  syntax: {
    title: 'Basic Python Syntax',
    sections: [
      {
        type: 'text',
        title: 'Indentation',
        content:
          'Python uses indentation to indicate blocks of code. The number of spaces is up to you, but it must be consistent throughout the block.',
      },
      {
        type: 'code',
        title: 'Example of Indentation',
        content: 'if 5 > 2:\n    print("Five is greater than two!")',
        language: 'python',
      },
    ],
  },
  variables: {
    title: 'Variables and Data Types',
    sections: [
      {
        type: 'text',
        title: 'Variables',
        content:
          "Variables are created when you assign a value to them. Python is dynamically typed, so you don't need to declare the type.",
      },
      {
        type: 'code',
        title: 'Variable Examples',
        content:
          '# String\n        x = "Hello"\n        # Integer\n        y = 5\n        # Float\n        z = 3.14\n        # Boolean\n        a = True\n        # List\n        b = [1, 2, 3]\n        # Dictionary\n        c = {"name": "John", "age": 30}',
        language: 'python',
      },
    ],
  },
};

const PythonLearnContent = () => {
  const [activeTopic, setActiveTopic] = useState('getting-started');
  const content = topicContent[activeTopic] || topicContent['getting-started'];

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card overflow-y-auto">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground flex items-center">
            <Code className="w-5 h-5 mr-2 text-blue-500" />
            Python Tutorial
          </h2>
        </div>
        <nav className="p-2">
          <ul>
            {pythonTopics.map((topic) => (
              <li key={topic.id} className="mb-1">
                <button
                  onClick={() => setActiveTopic(topic.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium ${
                    activeTopic === topic.id
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground hover:bg-accent/50'
                  }`}
                >
                  <div className="flex items-center">
                    {topic.completed ? (
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 mr-2 border rounded-full border-muted-foreground" />
                    )}
                    {topic.title}
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            {content.title}
          </h1>

          {content.sections.map((section: any, index: number) => (
            <div key={index} className="mb-8">
              {section.type === 'text' && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    {section.title}
                  </h2>
                  <p className="text-foreground/90 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              )}

              {section.type === 'code' && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {section.title}
                  </h3>
                  <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm font-mono text-foreground">
                      <code>{section.content}</code>
                    </pre>
                  </div>
                </div>
              )}

              {section.type === 'tip' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-md mb-6">
                  <div className="flex">
                    <Lightbulb className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <span className="font-semibold">Tip:</span>{' '}
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex justify-between">
              <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                ← Previous
              </button>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
                Next Topic →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonLearnContent;
