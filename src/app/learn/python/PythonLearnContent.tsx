'use client';

import { Lightbulb } from 'lucide-react';
import React, { useState } from 'react';

// Dummy data for Python topics
const pythonTopics = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    completed: true,
    difficulty: 'Beginner',
    prerequisites: [],
  },
  {
    id: 'syntax',
    title: 'Basic Syntax',
    completed: true,
    difficulty: 'Beginner',
    prerequisites: ['getting-started'],
  },
  {
    id: 'variables',
    title: 'Variables and Types',
    completed: true,
    difficulty: 'Beginner',
    prerequisites: ['syntax'],
  },
  {
    id: 'operators',
    title: 'Operators',
    completed: false,
    difficulty: 'Beginner',
    prerequisites: ['variables'],
  },
  {
    id: 'control-flow',
    title: 'Control Flow',
    completed: false,
    difficulty: 'Beginner',
    prerequisites: ['operators'],
  },
  {
    id: 'functions',
    title: 'Functions',
    completed: false,
    difficulty: 'Intermediate',
    prerequisites: ['control-flow'],
  },
  {
    id: 'data-structures',
    title: 'Data Structures',
    completed: false,
    difficulty: 'Intermediate',
    prerequisites: ['functions'],
  },
  {
    id: 'modules',
    title: 'Modules and Packages',
    completed: false,
    difficulty: 'Intermediate',
    prerequisites: ['data-structures'],
  },
  {
    id: 'file-handling',
    title: 'File Handling',
    completed: false,
    difficulty: 'Intermediate',
    prerequisites: ['modules'],
  },
  {
    id: 'exceptions',
    title: 'Exception Handling',
    completed: false,
    difficulty: 'Intermediate',
    prerequisites: ['file-handling'],
  },
];

// Dummy content for each topic
const topicContent: Record<string, any> = {
  'getting-started': {
    title: 'Getting Started with Python',
    description:
      'Learn the basics of Python programming language and write your first program.',
    learningObjectives: [
      'Understand what Python is and its key features',
      'Set up Python development environment',
      'Write and run your first Python program',
    ],
    prerequisites: [],
    difficulty: 'Beginner',
    timeToComplete: 15, // minutes
    sections: [
      {
        type: 'text',
        title: 'What is Python?',
        content:
          'Python is a high-level, interpreted programming language known for its readability and versatility. It supports multiple programming paradigms including procedural, object-oriented, and functional programming.',
        keyPoints: [
          'Created by Guido van Rossum and first released in 1991',
          'Emphasizes code readability with its notable use of significant whitespace',
          'Has a large standard library and active community',
        ],
      },
      {
        type: 'code',
        title: 'Your First Python Program',
        content: 'print("Hello, World!")',
        language: 'python',
        explanation:
          'This simple program prints "Hello, World!" to the console. The print() function is used to output text to the standard output device.',
      },
      {
        type: 'exercise',
        title: 'Try It Yourself',
        task: 'Modify the program to print your name instead of "World"',
        solution: 'print("Hello, [Your Name]!")',
        hint: 'Just replace "World" with your name inside the quotes',
      },
      {
        type: 'tip',
        content:
          'Python uses indentation to define code blocks, so be consistent with your spacing!',
        importance: 'high',
      },
      {
        type: 'resources',
        title: 'Additional Resources',
        items: [
          {
            type: 'documentation',
            title: 'Official Python Documentation',
            url: 'https://docs.python.org/3/tutorial/index.html',
          },
          {
            type: 'video',
            title: 'Python for Beginners',
            url: 'https://www.youtube.com/watch?v=YYXdXT2l-Gg',
          },
          {
            type: 'article',
            title: 'Why Python is a Great First Language',
            url: 'https://www.python.org/about/gettingstarted/',
          },
        ],
      },
      {
        type: 'quiz',
        question:
          'What is the correct way to print "Hello, World!" in Python 3?',
        options: [
          'print "Hello, World!"',
          'print(Hello, World!)',
          'print("Hello, World!")',
          'echo "Hello, World!"',
        ],
        correctAnswer: 2,
        explanation:
          'In Python 3, print is a function and requires parentheses. The text to be printed must be enclosed in quotes.',
      },
    ],
    commonMistakes: [
      'Forgetting to use parentheses with print() in Python 3',
      'Using inconsistent indentation',
      'Mixing tabs and spaces for indentation',
    ],
  },
  syntax: {
    title: 'Basic Python Syntax',
    description:
      'Learn the fundamental syntax rules of Python programming language.',
    learningObjectives: [
      'Understand Python indentation rules',
      'Learn Python comments and docstrings',
      'Master Python naming conventions',
    ],
    prerequisites: ['getting-started'],
    difficulty: 'Beginner',
    timeToComplete: 20,
    sections: [
      {
        type: 'text',
        title: 'Indentation',
        content:
          'Python uses indentation to indicate blocks of code. The number of spaces is up to you, but it must be consistent throughout the block.',
        keyPoints: [
          'Standard indentation is 4 spaces per level',
          'Never mix tabs and spaces',
          'Code blocks are defined by their indentation',
        ],
      },
      {
        type: 'code',
        title: 'Example of Indentation',
        content:
          'if 5 > 2:\n    print("Five is greater than two!")\n    print("This is inside the if block")\nprint("This is outside the if block")',
        language: 'python',
        explanation:
          'The code inside the if block is indented. The last print statement is not part of the if block.',
      },
      {
        type: 'text',
        title: 'Comments and Docstrings',
        content:
          'Comments start with # and are used to explain code. Docstrings are string literals that appear right after the definition of a function, method, class, or module.',
      },
      {
        type: 'code',
        title: 'Comments Example',
        content:
          '# This is a single-line comment\n\n"""\nThis is a multi-line\ndocstring.\n"""\n\ndef example():\n    """This is a function docstring."""\n    pass',
        language: 'python',
      },
      {
        type: 'exercise',
        title: 'Practice Exercise',
        task: 'Write a Python program that checks if a number is even or odd. Add appropriate comments.',
        solution:
          '# Check if a number is even or odd\nnumber = 10\nif number % 2 == 0:\n    print(f"{number} is even")\nelse:\n    print(f"{number} is odd")',
        hint: 'Use the modulo operator % to check for even/odd',
      },
      {
        type: 'quiz',
        question:
          'What happens if you mix tabs and spaces for indentation in Python?',
        options: [
          'It works fine',
          'It causes a SyntaxError',
          'It works but is not recommended',
          'It causes a runtime error',
        ],
        correctAnswer: 1,
        explanation:
          'Mixing tabs and spaces for indentation raises a TabError in Python 3.',
      },
    ],
    commonMistakes: [
      'Inconsistent indentation',
      'Mixing tabs and spaces',
      'Forgetting the colon (:) after control flow statements',
    ],
  },
  variables: {
    title: 'Variables and Data Types',
    description:
      'Learn about variables and the different data types available in Python.',
    learningObjectives: [
      'Understand how to create and use variables',
      'Learn about Python data types',
      'Understand type conversion',
      'Learn about variable scope',
    ],
    prerequisites: ['syntax'],
    difficulty: 'Beginner',
    timeToComplete: 25,
    sections: [
      {
        type: 'text',
        title: 'Variables',
        content:
          "Variables are created when you assign a value to them. Python is dynamically typed, so you don't need to declare the type.",
        keyPoints: [
          'Variables are created when first assigned a value',
          'Variables must be assigned before being referenced',
          'Variable names are case-sensitive',
          'Python uses dynamic typing (type is associated with values, not variables)',
        ],
      },
      {
        type: 'code',
        title: 'Variable Examples',
        content:
          '# String (text)\nname = "John Doe"\n\n# Integer (whole number)\nage = 25\n\n# Float (decimal number)\nheight = 5.9\n\n# Boolean (True/False)\nis_student = True\n\n# List (ordered, mutable)\nnumbers = [1, 2, 3, 4, 5]\n\n# Tuple (ordered, immutable)\ncoordinates = (10.0, 20.0)\n\n# Dictionary (key-value pairs)\nperson = {\n    "name": "Alice",\n    "age": 30,\n    "is_employed": True\n}\n\n# Set (unordered, unique elements)\nunique_numbers = {1, 2, 3, 3, 4}  # {1, 2, 3, 4}',
        language: 'python',
        explanation:
          'Python supports various data types including numbers, strings, booleans, lists, tuples, dictionaries, and sets.',
      },
      {
        type: 'text',
        title: 'Type Conversion',
        content:
          'You can convert between different data types using type conversion functions like int(), float(), str(), etc.',
      },
      {
        type: 'code',
        title: 'Type Conversion Examples',
        content:
          '# Convert string to integer\nnum_str = "123"\nnum_int = int(num_str)\n\n# Convert integer to string\nnum = 456\nnum_str = str(num)\n\n# Convert to float\npi = 3.14\npi_str = str(pi)\n\n# Convert to boolean\ntruthy = bool(1)  # True\nfalsy = bool(0)   # False',
        language: 'python',
      },
      {
        type: 'exercise',
        title: 'Practice Exercise',
        task: 'Create variables to store your name, age, and height. Then print them in a formatted string like: "My name is [name], I am [age] years old and [height] meters tall."',
        solution:
          'name = "John"\nage = 25\nheight = 1.75\nprint(f"My name is {name}, I am {age} years old and {height} meters tall.")',
        hint: 'Use f-strings for string formatting',
      },
      {
        type: 'warning',
        content:
          'Be careful with variable names! Python has some reserved keywords that cannot be used as variable names (e.g., if, else, while, for, etc.)',
        importance: 'high',
      },
      {
        type: 'resources',
        title: 'Additional Resources',
        items: [
          {
            type: 'documentation',
            title: 'Python Data Types',
            url: 'https://docs.python.org/3/library/stdtypes.html',
          },
          {
            type: 'article',
            title: 'Python Variables and Data Types',
            url: 'https://www.w3schools.com/python/python_variables.asp',
          },
        ],
      },
      {
        type: 'quiz',
        question: 'Which of the following is a valid variable name in Python?',
        options: ['2things', 'my-variable', 'my_variable', 'global'],
        correctAnswer: 2,
        explanation:
          'Variable names cannot start with a number, cannot contain hyphens, and cannot be Python keywords. Only my_variable is valid.',
      },
    ],
    commonMistakes: [
      'Using Python keywords as variable names',
      'Forgetting that variable names are case-sensitive',
      'Trying to use a variable before assigning a value to it',
    ],
  },
};

const PythonLearnContent = () => {
  const [activeTopic, setActiveTopic] = useState('getting-started');
  const content = topicContent[activeTopic] || topicContent['getting-started'];

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border overflow-y-auto bg-card">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Python Topics</h2>
          <div className="space-y-2">
            {pythonTopics.map((topic) => (
              <div
                key={topic.id}
                className={`p-2 rounded-md cursor-pointer transition-colors ${
                  activeTopic === topic.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => setActiveTopic(topic.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveTopic(topic.id);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center justify-between">
                  <span>{topic.title}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {topic.difficulty}
                    </span>
                  </div>
                </div>
                {topic.prerequisites.length > 0 && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Requires: {topic.prerequisites.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
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
