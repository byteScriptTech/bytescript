import admin from 'firebase-admin';

import { LanguageContent } from '../src/types/content';

const serviceAccount = require('../deneb-88a71-firebase-adminsdk-3z447-5d0122f45c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://deneb-88a71.firebaseio.com',
});

const db = admin.firestore();

export const pythonContent: LanguageContent = {
  id: 'python',
  name: 'Python',
  tag: 'programming-language',
  version_info: {
    current_version: '3.11',
    version_history: [
      {
        version: '3.10',
        key_features: [
          'Structural Pattern Matching',
          'Parenthesized Context Managers',
        ],
      },
      {
        version: '3.9',
        key_features: ['Dictionary Merge Operators', 'Type Hinting Generics'],
      },
      {
        version: '3.8',
        key_features: ['Walrus Operator', 'Positional-Only Parameters'],
      },
    ],
    compatibility_notes:
      'Code written for Python 3.7+ will generally work with newer versions with minimal changes.',
  },
  applications: [
    'Web Development (Django, Flask)',
    'Data Science & Analysis (Pandas, NumPy)',
    'Machine Learning (TensorFlow, PyTorch)',
    'Automation & Scripting',
    'Scientific Computing',
    'Game Development (Pygame)',
    'Desktop Applications (PyQt, Tkinter)',
  ],
  explanation: [
    'Python is a high-level, interpreted programming language known for its simplicity and readability.',
    'It supports multiple programming paradigms including procedural, object-oriented, and functional programming.',
    'Python has a "batteries included" philosophy with a comprehensive standard library.',
    'Dynamic typing and automatic memory management make it beginner-friendly.',
  ],
  best_practices_and_common_mistakes: {
    common_mistakes: [
      {
        text: 'Using mutable default arguments',
        example:
          'def add_to(item, collection=[]):  # Bad\n    collection.append(item)\n    return collection',
        fix: 'def add_to(item, collection=None):  # Good\n    if collection is None:\n        collection = []\n    collection.append(item)\n    return collection',
      },
      {
        text: 'Not using virtual environments',
        explanation: 'Leads to dependency conflicts between projects',
      },
      {
        text: 'Ignoring PEP 8 style guidelines',
        fix: 'Use tools like flake8 or black for consistent formatting',
      },
    ],
    best_practices: [
      {
        text: 'Write docstrings following PEP 257',
        example:
          'def calculate(a, b):\n    """Return sum of a and b.\n    \n    Args:\n        a (int): First number\n        b (int): Second number\n    \n    Returns:\n        int: Sum of the inputs\n    """',
      },
      {
        text: 'Use context managers for resource handling',
        example: 'with open("file.txt") as f:\n    content = f.read()',
      },
      {
        text: 'Prefer list comprehensions over loops for simple transformations',
        example: '[x.upper() for x in names if x.startswith("a")]',
      },
    ],
  },
  related_topics: [
    {
      name: 'Django',
      description: 'High-level Python web framework',
      category: 'Web Development',
    },
    {
      name: 'Flask',
      description: 'Micro web framework',
      category: 'Web Development',
    },
    {
      name: 'Pandas',
      description: 'Data analysis library',
      category: 'Data Science',
    },
    {
      name: 'NumPy',
      description: 'Numerical computing',
      category: 'Data Science',
    },
    {
      name: 'Matplotlib',
      description: 'Data visualization',
      category: 'Data Science',
    },
    {
      name: 'PyTorch',
      description: 'Machine learning framework',
      category: 'AI/ML',
    },
  ],
  topics: [
    {
      name: 'Getting Started',
      id: 'getting-started',
      slug: 'getting-started',
      description:
        'Introduction to Python programming language and setting up the development environment.',
      content:
        'Python is a high-level, interpreted programming language known for its simplicity and readability. This section will help you set up your development environment and write your first Python program.',
      subtopics: [
        {
          name: 'Installation',
          content: `Python can be installed from python.org or via package managers like apt, brew, or chocolatey. It's recommended to use a virtual environment for project isolation.

## Installation Steps:
1. Download and install Python from python.org
2. Verify installation by running \`python --version\` in terminal
3. Create a virtual environment: \`python -m venv venv\`
4. Activate the virtual environment:
   - Windows: \`.\\venv\\Scripts\\activate\`
   - Unix/MacOS: \`source venv/bin/activate\``,
          examples: [
            {
              code: '# Check installed version\npython --version\n\n# Create a virtual environment\npython -m venv venv\n\n# Activate virtual environment (Windows)\n# .\\venv\\Scripts\\activate\n\n# Activate virtual environment (macOS/Linux)\n# source venv/bin/activate',
              description: 'Python version check and virtual environment setup',
            },
          ],
        },
        {
          name: 'Running Python',
          content:
            'Python code can be executed in several ways:\n1. Interactive shell (REPL)\n2. Script files (.py)\n3. Jupyter notebooks\n4. IDEs like VS Code, PyCharm',
          examples: [
            {
              code: '# hello.py\nprint("Hello, World!")\n\n# Run from terminal\n# python hello.py',
              description: 'Simple Python script execution',
            },
          ],
        },
        {
          name: 'Your First Program',
          content:
            'Learn to write and run a simple Python program that takes user input and produces output.',
          examples: [
            {
              code: '# Get user input\nname = input(\'What\\\'s your name? \')\n\n# Process and display output\nprint(f"Hello, {name}! Welcome to Python!")\n\n# Basic math\nnum1 = float(input("Enter first number: "))\nnum2 = float(input("Enter second number: "))\nprint(f"{num1} + {num2} = {num1 + num2}")',
              description: 'Interactive input and output',
            },
          ],
        },
      ],
      challenges: undefined,
    },
    {
      name: 'Basic Syntax',
      id: 'syntax',
      slug: 'syntax',
      description:
        'Learn Python syntax, variables, data types, and basic operations.',
      content:
        'Python uses indentation for code blocks and has a simple, readable syntax. This section covers the fundamental building blocks of Python programming including variables, data types, operators, and control flow.',
      subtopics: [
        {
          name: 'Variables and Data Types',
          content:
            "Python is dynamically typed, meaning you don't need to declare variable types explicitly. Common data types include integers, floats, strings, booleans, lists, tuples, sets, and dictionaries.",
          examples: [
            {
              code: '# Variables and basic data types\nname = "Alice"           # String\nage = 25                 # Integer\nheight = 5.9            # Float\nis_student = true       # Boolean\nskills = ["Python", "Data Analysis"]  # List\ncoordinates = [10, 20]  # Tuple as array for JSON compatibility\nunique_numbers = [1, 2, 3]  # Set as array for JSON compatibility\nperson = {              # Dictionary\n  "name": "Alice",\n  "age": 25,\n  "skills": ["Python", "Data Analysis"]\n}\n\n# Type checking\nprint(type(name))      # <class \'str\'>\nprint(type(age))       # <class \'int\'>\nprint(type(height))    # <class \'float\'>\nprint(type(is_student)) # <class \'bool\'>',
              description: 'Variables and data types in Python',
            },
          ],
        },
        {
          name: 'Operators',
          content:
            'Python supports various operators for performing operations on variables and values.',
          examples: [
            {
              code: '# Arithmetic operators\nprint(10 + 3)   # Addition: 13\nprint(10 - 3)   # Subtraction: 7\nprint(10 * 3)   # Multiplication: 30\nprint(10 / 3)   # Division: 3.333...\nprint(10 // 3)  # Floor division: 3\nprint(10 % 3)   # Modulus: 1\nprint(10 ** 3)  # Exponentiation: 1000\n\n# Comparison operators\nprint(10 > 3)   # True\nprint(10 == 3)  # False\nprint(10 != 3)  # True\n\n# Logical operators\nprint(True and False)  # False\nprint(True or False)   # True\nprint(not True)        # False\n\n# Membership operators\nprint("a" in "apple")  # True\nprint(4 not in [1,2,3]) # True',
              description: 'Python operators',
            },
          ],
        },
        {
          name: 'Control Flow',
          content:
            'Control the flow of your program with if-elif-else statements and loops.',
          examples: [
            {
              code: '# If-elif-else\nage = 18\nif age < 13:\n    print("Child")\nelif age < 20:\n    print("Teenager")\nelse:\n    print("Adult")\n\n# For loop\nfor i in range(5):\n    print(i)  # 0 1 2 3 4\n\n# While loop\ncount = 0\nwhile count < 3:\n    print(f"Count: {count}")\n    count += 1\n\n# Break and continue\nfor num in range(5):\n    if num == 2:\n        continue  # Skip this iteration\n    if num == 4:\n        break     # Exit loop\n    print(num)',
              description: 'Control flow in Python',
            },
          ],
        },
      ],
      challenges: undefined,
    },
    {
      name: 'Functions',
      id: 'functions',
      slug: 'functions',
      description:
        'Learn to create and use functions, handle parameters, and understand scope.',
      content:
        'Functions are reusable blocks of code that perform a specific task. They help in organizing code and making it more modular. Python functions support various parameter types, return values, and have their own scope.',
      subtopics: [
        {
          name: 'Defining and Calling Functions',
          content:
            'Functions are defined using the def keyword and called using parentheses.',
          examples: [
            {
              code: '# Define a function\ndef greet(name):\n    """Return a greeting message."""\n    return f"Hello, {name}!"\n\n# Call the function\nmessage = greet("Alice")\nprint(message)  # Hello, Alice!\n\n# Function with default parameters\ndef power(base, exponent=2):\n    return base ** exponent\n\nprint(power(3))      # 9 (uses default exponent=2)\nprint(power(3, 3))   # 27',
              description: 'Basic function definition and calling',
            },
          ],
        },
      ],
      challenges: undefined,
    },
    {
      name: 'Object-Oriented Programming',
      id: 'oop',
      slug: 'oop',
      description:
        'Master classes, objects, inheritance, and polymorphism in Python.',
      content:
        'Python supports object-oriented programming with classes and objects. OOP helps in creating reusable code and modeling real-world entities through classes and objects, inheritance, and polymorphism.',
      subtopics: [
        {
          name: 'Classes and Objects',
          content:
            'Classes are blueprints for creating objects with attributes and methods.',
          examples: [
            {
              code: 'class Dog {\n  // Class attribute\n  static species = "Canis familiaris"\n  \n  // Instance properties\n  name: string\n  age: number\n  \n  // Constructor\n  constructor(name: string, age: number) {\n    this.name = name\n    this.age = age\n  }\n  \n  // Instance method\n  description(): string {\n    return `${this.name} is ${this.age} years old`\n  }\n  \n  // Another instance method\n  speak(sound: string): string {\n    return `${this.name} says ${sound}`\n  }\n}\n\n// Create instances of Dog\nconst dog1 = new Dog("Buddy", 3)\nconst dog2 = new Dog("Lucy", 5)\n\n// Access attributes and methods\nconsole.log(dog1.name)  // Buddy\nconsole.log(dog2.age)   // 5\nconsole.log(dog1.description())  // Buddy is 3 years old\nconsole.log(dog2.speak("Woof!"))  // Lucy says Woof!\n\n// Access class attribute\nconsole.log(`All dogs are ${Dog.species}`)  // All dogs are Canis familiaris',
              description: 'Basic class definition and usage',
            },
          ],
        },
      ],
      challenges: undefined,
    },
    {
      name: 'Advanced Concepts',
      id: 'advanced',
      slug: 'advanced',
      description:
        'Explore advanced Python features like decorators, generators, and context managers.',
      subtopics: [
        {
          name: 'Decorators',
          content: 'Functions that modify the behavior of other functions.',
          examples: [
            {
              code: 'def timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        end = time.time()\n        print(f"Time: {end-start} seconds")\n        return result\n    return wrapper\n\n@timer\ndef long_running_function():\n    time.sleep(2)',
              description: 'Decorator to measure function execution time',
            },
          ],
        },
      ],
      challenges: undefined,
    },
  ],
  introduction: {
    text: 'Python is a versatile language used across industries for its readability and extensive ecosystem.',
    key_concepts: [
      'Interpreted language with dynamic typing',
      'Duck typing ("If it walks like a duck...")',
      'Significant whitespace (indentation matters)',
      'Everything is an object',
    ],
    objective: [
      'Master Python syntax and idioms',
      "Understand Python's object model",
      "Learn to leverage Python's standard library",
      'Develop problem-solving skills with Python',
    ],
    real_world_use_cases: [
      "Instagram's backend (Django)",
      "Netflix's data analysis (Pandas)",
      'NASA scientific computing',
      "Spotify's recommendation systems",
    ],
    prerequisites: [
      'Basic computer literacy',
      'Understanding of programming concepts (variables, loops, functions)',
    ],
  },
  examples: [
    {
      code: '# List comprehension\nsquares = [x**2 for x in range(10)]\neven_squares = [x**2 for x in range(10) if x % 2 == 0]\nprint(squares)      # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]\nprint(even_squares) # [0, 4, 16, 36, 64]',
      description: 'List comprehension examples for creating lists concisely',
      language: 'python',
    },
    {
      code: '# Dictionary comprehension\nnames = ["Alice", "Bob", "Charlie"]\nname_lengths = {name: len(name) for name in names}\nprint(name_lengths)  # {"Alice": 5, "Bob": 3, "Charlie": 7}',
      description: 'Dictionary comprehension example',
      language: 'python',
    },
    {
      code: '# Using zip to combine lists\nnames = ["Alice", "Bob", "Charlie"]\nscores = [85, 92, 78]\nfor name, score in zip(names, scores):\n    print(f"{name} scored {score}")',
      description: 'Combining lists with zip',
      language: 'python',
    },
    {
      code: '# Using enumerate with for loops\nfruits = ["apple", "banana", "cherry"]\nfor index, fruit in enumerate(fruits, start=1):\n    print(f"{index}. {fruit}")',
      description: 'Using enumerate for index and value in loops',
      language: 'python',
    },
    {
      code: '# Working with files\nwith open("example.txt", "w") as file:\n    file.write("Hello, World!\\nThis is a test file.")\n\nwith open("example.txt", "r") as file:\n    content = file.read()\n    print(content)',
      description: 'File I/O operations',
      language: 'python',
    },
    {
      code: '# Context manager\nwith open("data.txt") as file:\n    content = file.read()',
      description: 'Properly handle file resources',
    },
  ],
  challenges: [
    {
      id: 'fibonacci-challenge',
      title: 'Fibonacci Sequence',
      description: 'Write a function that returns the nth Fibonacci number.',
      difficulty: 'Beginner',
      example: `def fibonacci(n):
    # Your code here
    pass

# Test cases
print(fibonacci(0))  # Should return 0
print(fibonacci(1))  # Should return 1
print(fibonacci(5))  # Should return 5
print(fibonacci(10)) # Should return 55`,
      solution: `def fibonacci(n):
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b`,
      requirements: [
        'Handle n = 0 and n = 1 as base cases',
        'Use iteration to calculate Fibonacci numbers',
        'Ensure O(n) time complexity',
      ],
      testCases: [
        { input: '0', output: '0' },
        { input: '1', output: '1' },
        { input: '5', output: '5' },
        { input: '10', output: '55' },
      ],
    },
    {
      id: 'palindrome-challenge',
      title: 'Palindrome Checker',
      description: 'Write a function that checks if a string is a palindrome.',
      difficulty: 'Beginner',
      example: `def is_palindrome(s):
    # Your code here
    pass

# Test cases
print(is_palindrome("racecar"))  # True
print(is_palindrome("hello"))    # False
print(is_palindrome("A man a plan a canal Panama"))  # True`,
      solution: `def is_palindrome(s):
    s = "".join(c.lower() for c in s if c.isalnum())
    return s == s[::-1]`,
      requirements: [
        'Ignore case when checking for palindromes',
        'Ignore non-alphanumeric characters',
        'Return a boolean value',
      ],
      testCases: [
        { input: '"racecar"', output: 'True' },
        { input: '"hello"', output: 'False' },
        { input: '"A man a plan a canal Panama"', output: 'True' },
      ],
    },
    {
      id: 'reverse-string-challenge',
      title: 'String Reversal',
      description: 'Implement a function to reverse a string',
      difficulty: 'Beginner',
      example: `def reverse_string(s):
    # Your code here
    pass

# Test cases
print(reverse_string("hello"))  # Should return "olleh"
print(reverse_string("Python"))  # Should return "nohtyP"
print(reverse_string(""))  # Should return ""`,
      solution: 'def reverse_string(s):\n    return s[::-1]',
      requirements: [
        'Do not use built-in reverse functions',
        'Handle empty string edge case',
        'Return the reversed string',
      ],
      testCases: [
        { input: '"hello"', output: '"olleh"' },
        { input: '"Python"', output: '"nohtyP"' },
        { input: '""', output: '""' },
      ],
    },
  ],
  resources: [
    {
      id: 'python-crash-course',
      title: 'Python Crash Course',
      url: 'https://nostarch.com/pythoncrashcourse2e',
      type: 'book',
      author: 'Eric Matthes',
      description: 'A hands-on, project-based introduction to programming',
    },
    {
      id: 'fluent-python',
      title: 'Fluent Python',
      url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/',
      type: 'book',
      author: 'Luciano Ramalho',
      description: 'Clear, concise, and effective programming',
    },
    {
      id: 'python-for-everybody',
      title: 'Python for Everybody',
      url: 'https://www.coursera.org/specializations/python',
      type: 'course',
      author: 'University of Michigan',
      description: 'Beginner-friendly introduction to Python programming',
    },
  ],
  learning_path: {
    beginner: ['Syntax → Control Flow → Functions → Lists/Dicts'],
    intermediate: ['OOP → Modules → File I/O → Error Handling'],
    advanced: ['Decorators → Generators → Concurrency → Metaclasses'],
  },
  project_ideas: [
    {
      title: 'URL Shortener',
      description: 'Create a service that shortens long URLs',
      technologies: ['Flask', 'SQLite'],
      difficulty: 'Intermediate',
    },
  ],
  performance_tips: [
    {
      tip: 'Use sets for membership testing',
      explanation: 'O(1) complexity vs O(n) for lists',
      example: {
        before: 'if x in [1, 2, 3, 4, 5]:',
        after: 'if x in {1, 2, 3, 4, 5}:',
      },
    },
  ],
  interview_prep: {
    questions: [
      {
        question: "Explain Python's GIL",
        answer:
          'The Global Interpreter Lock allows only one thread to execute Python bytecode at a time...',
      },
    ],
    coding_problems: [
      {
        problem: 'Implement a LRU Cache',
        solution: 'Use OrderedDict from collections',
      },
    ],
  },
  cheatsheet: {
    'List Operations': {
      Create: 'lst = [1, 2, 3]',
      Slice: 'lst[start:stop:step]',
      Comprehension: '[x*2 for x in lst if x > 1]',
    },
  },
};

async function seedPythonContent() {
  try {
    console.log('Seeding Python content...');

    const existingDoc = await db.collection('languages').doc('python').get();

    if (existingDoc.exists) {
      console.log('Updating existing Python content...');
      await db.collection('languages').doc('python').update(pythonContent);
    } else {
      console.log('Creating new Python content...');
      await db.collection('languages').doc('python').set(pythonContent);
    }

    console.log('Python content seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Python content:', error);
    process.exit(1);
  }
}

seedPythonContent();
