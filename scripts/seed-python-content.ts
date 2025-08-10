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
        version: '3.11',
        key_features: [
          'Faster CPython performance improvements',
          'Exception Groups and except*',
          'Fine-grained error locations in tracebacks',
        ],
      },
      {
        version: '3.10',
        key_features: [
          'Structural Pattern Matching',
          'Parenthesized Context Managers',
        ],
      },
      {
        version: '3.9',
        key_features: [
          'Dictionary Merge Operators (|)',
          'Type Hinting Generics',
        ],
      },
      {
        version: '3.8',
        key_features: ['Walrus Operator (:=)', 'Positional-only parameters'],
      },
    ],
    compatibility_notes:
      'Code written for Python 3.7+ will generally work on newer 3.x versions with minimal changes. Check changelogs for behavioral changes in stdlib APIs and deprecations when upgrading.',
  },
  short_description:
    'Python — a high-level, interpreted language with readable syntax and a huge ecosystem. Great for web, data, automation, AI, and more.',
  applications: [
    'Web Development (Django, Flask, FastAPI)',
    'Data Science & Analysis (Pandas, NumPy, SciPy)',
    'Machine Learning (TensorFlow, PyTorch, scikit-learn)',
    'Automation & Scripting',
    'Scientific Computing',
    'Game Development (Pygame)',
    'Desktop Applications (PyQt, Tkinter)',
    'DevOps & Infrastructure tooling',
    'Embedded & IoT (MicroPython)',
  ],
  explanation: [
    'Python is a high-level, interpreted language known for clarity and ease of use.',
    'It supports multiple paradigms: procedural, object-oriented, and functional.',
    "Python standard library is extensive—'batteries included'—covering many common tasks.",
    'Dynamic typing and automatic memory management reduce boilerplate for beginners.',
  ],
  prerequisites: [
    'Basic computer literacy',
    'Comfort with using a terminal/command prompt',
    'Some experience with programming concepts helpful but not required',
  ],

  // Overall course-level learning goals and metadata
  learning_objectives: [
    'Write idiomatic Python code covering core language features.',
    'Structure, test, and document Python projects.',
    'Use popular libraries in data and web domains.',
    'Understand advanced language features: decorators, generators, async, metaclasses.',
    'Optimize and profile Python programs.',
    'Prepare for interviews and real-world engineering tasks.',
  ],

  // Best practices and common mistakes
  best_practices_and_common_mistakes: {
    common_mistakes: [
      {
        text: 'Using mutable default arguments',
        example:
          'def add_to(item, collection=[]):  # Bad\n    collection.append(item)\n    return collection',
        fix: 'def add_to(item, collection=None):\n    if collection is None:\n        collection = []\n    collection.append(item)\n    return collection',
        explanation:
          'Default argument values are evaluated once at function definition time leading to shared state between calls.',
      },
      {
        text: 'Not using virtual environments',
        explanation:
          'Installing packages globally leads to conflicting versions across projects. Use venv/virtualenv/poetry.',
        fix: 'python -m venv venv; source venv/bin/activate  # or use Poetry/Conda',
      },
      {
        text: 'Ignoring PEP 8 style guidelines',
        fix: 'Use tools like black (formatter), flake8 (lint), and isort (imports) to keep code consistent.',
      },
    ],
    best_practices: [
      {
        text: 'Write docstrings and type hints',
        example:
          'def calculate(a: int, b: int) -> int:\n    """Return sum of a and b."""\n    return a + b',
      },
      {
        text: 'Prefer context managers for resource handling',
        example: 'with open("file.txt", "r") as f:\n    data = f.read()',
      },
      {
        text: 'Write tests and run them in CI',
        example:
          'pytest for tests; run tests on PRs (GitHub Actions / GitLab CI).',
      },
    ],
  },

  related_topics: [
    {
      name: 'Django',
      description: 'High-level web framework',
      category: 'Web Development',
    },
    {
      name: 'Flask',
      description: 'Micro web framework',
      category: 'Web Development',
    },
    {
      name: 'FastAPI',
      description: 'High-performance async web framework',
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
      description: 'Plotting library',
      category: 'Data Science',
    },
    {
      name: 'PyTorch',
      description: 'ML / Deep Learning framework',
      category: 'AI/ML',
    },
    {
      name: 'AsyncIO',
      description: 'Async concurrency library',
      category: 'Concurrency',
    },
  ],

  // core course topics
  topics: [
    // 1. Getting Started
    {
      name: 'Getting Started',
      id: 'getting-started',
      slug: 'getting-started',
      difficulty: 'Beginner',
      estimated_time_hours: 2,
      description:
        'Introduction to Python, installing, tooling, and running your first programs. Includes environment setup and basic workflow.',
      learning_objectives: [
        'Install Python and set up a virtual environment',
        'Run Python scripts and use REPL and Jupyter',
        'Understand package management basics (pip)',
      ],
      content:
        'Python is a high-level interpreted language. This unit guides through installing Python, creating virtual environments, and running code in different environments (REPL, scripts, notebooks).',
      subtopics: [
        {
          name: 'Installation & Tooling',
          id: 'installation',
          content: `Install Python from python.org or package manager (apt/brew/choco). Use virtual environments for project isolation. Recommended tools: VS Code, PyCharm, pipx, Poetry.`,
          examples: [
            {
              code: '# Check Python version\npython --version\n\n# Create virtual env\npython -m venv venv\n\n# Activate (macOS/Linux)\nsource venv/bin/activate\n\n# Windows (PowerShell)\n.\\venv\\Scripts\\Activate.ps1',
              description: 'Version check and venv creation/activation',
            },
          ],
          recommended_resources: [
            {
              title: 'Official Python Downloads',
              url: 'https://www.python.org/downloads/',
              type: 'documentation',
            },
            {
              title: 'venv docs',
              url: 'https://docs.python.org/3/library/venv.html',
              type: 'documentation',
            },
          ],
          estimated_time_minutes: 30,
        },
        {
          name: 'Running Python & REPL',
          id: 'running-python',
          content:
            'Use interactive REPL (python), run scripts with `python file.py`, and use Jupyter for notebooks. Learn to use `python -m` to run modules and tools.',
          examples: [
            {
              code: '# hello.py\nprint("Hello, World!")\n\n# Run\n# python hello.py',
              description: 'Simple script execution',
            },
          ],
          estimated_time_minutes: 20,
          recommended_resources: [],
        },
        {
          name: 'First Program & Workflow',
          id: 'first-program',
          content:
            'Write a small interactive program that takes user input and prints output. Introduce the concept of unit tests and version control (git).',
          examples: [
            {
              code: `# greet.py\nname = input("What's your name? ")\nprint(f"Hello, {name}! Welcome to Python!")\n\n# Basic calc\nnum1 = float(input("Enter first number: "))\nnum2 = float(input("Enter second number: "))\nprint(f"{num1} + {num2} = {num1 + num2}")`,
              description: 'Interactive input/output script',
            },
          ],
          exercises: [
            {
              id: 'gs-1',
              title: 'Hello & Sum',
              prompt:
                'Write a script that asks the user for two numbers and prints their sum along with a greeting.',
              difficulty: 'Beginner',
            },
          ],
          estimated_time_minutes: 40,
          recommended_resources: [],
        },
      ],
      quizzes: [
        {
          id: 'q-gs`-1',
          question: 'Why use a virtual environment?',
          options: [
            'To isolate project dependencies',
            'To speed up Python execution',
            'To compile Python to native binary',
            'To encrypt Python files',
          ],
          answer_index: 0,
        },
      ],
    },

    // 2. Basic Syntax & Data Types
    {
      name: 'Basic Syntax',
      id: 'syntax',
      slug: 'syntax',
      difficulty: 'Beginner',
      estimated_time_hours: 6,
      description:
        'Core language constructs: variables, types, operators, control flow, and basic data structures.',
      learning_objectives: [
        'Know Python primitive types and containers',
        'Use operators and expressions',
        'Write conditional statements and loops',
      ],
      subtopics: [
        {
          name: 'Variables and Data Types',
          id: 'variables-types',
          content:
            'Python has integers, floats, strings, booleans, lists, tuples, sets, and dicts. Use type() to check types and convert between types with built-ins.',
          examples: [
            {
              code: `# Basic types\nname = "Alice"  # str\nage = 25         # int\nheight = 5.9     # float\nis_student = True  # bool\n\n# Containers\nskills = ["python", "pandas"]  # list\na_tuple = (1, 2)\na_set = {1,2,3}\nperson = {"name": "Alice", "age": 25}  # dict\n\n# Type check\nprint(type(name))  # <class 'str'>`,
              description: 'Common Python types and containers',
            },
          ],
          exercises: [
            {
              id: 'bs-1',
              title: 'Types hands-on',
              prompt:
                "Create variables of each basic type and print their types. Convert a string '123' to int.",
              difficulty: 'Beginner',
            },
          ],
          recommended_resources: [],
        },
        {
          name: 'Operators',
          id: 'operators',
          content:
            'Arithmetic, comparison, logical, bitwise, membership, and identity operators. Understand integer vs float division.',
          examples: [
            {
              code: `# Arithmetic\nprint(10 + 3)\nprint(10 / 3)   # float\nprint(10 // 3)  # floor\nprint(10 % 3)\n# Logical\nprint(True and False)\n# Membership\nprint("a" in "apple")`,
              description: 'Operator examples',
            },
          ],
          recommended_resources: [],
        },
        {
          name: 'Control Flow',
          id: 'control-flow',
          content:
            'if / elif / else, for loops, while loops, break/continue, and loop else clause. Understand iterables and iteration protocol.',
          examples: [
            {
              code: `# if statement\nage = 18\nif age < 13:\n    print("Child")\nelif age < 20:\n    print("Teenager")\nelse:\n    print("Adult")\n\n# for loop\nfor i in range(5):\n    print(i)\n\n# while loop\ncount = 0\nwhile count < 3:\n    print(count)\n    count += 1`,
              description: 'Control flow basics',
            },
          ],
          recommended_resources: [],
        },
        {
          name: 'Comprehensions & Iteration',
          id: 'comprehensions',
          content:
            'List/dict/set comprehensions and generator expressions to write concise transformations.',
          examples: [
            {
              code: `# List comprehension\nsquares = [x**2 for x in range(10) if x % 2 == 0]\n# Dict comprehension\nname_lengths = {name: len(name) for name in ['Alice','Bob']}\n# Generator\ngen = (x**2 for x in range(3))`,
              description: 'Comprehensions & generator example',
            },
          ],
          recommended_resources: [
            {
              title: 'Comprehensions - Real Python',
              url: 'https://realpython.com/list-comprehension-python/',
              type: 'documentation',
            },
          ],
        },
      ],
      challenges: [
        {
          id: 'fizzbuzz',
          title: 'FizzBuzz',
          description:
            'Print numbers 1–100, replacing multiples of 3 with "Fizz", multiples of 5 with "Buzz" and both with "FizzBuzz".',
          difficulty: 'Beginner',
          solution: `def fizzbuzz(n=100):\n    for i in range(1, n+1):\n        if i % 15 == 0:\n            print('FizzBuzz')\n        elif i % 3 == 0:\n            print('Fizz')\n        elif i % 5 == 0:\n            print('Buzz')\n        else:\n            print(i)`,
        },
      ],
    },

    // 3. Functions & Modules
    {
      name: 'Functions & Modules',
      id: 'functions',
      slug: 'functions',
      difficulty: 'Beginner→Intermediate',
      estimated_time_hours: 5,
      description:
        'Define functions, arguments, return values, scoping, closures, higher-order functions, and modules/packages.',
      learning_objectives: [
        'Write and document functions, use default and keyword args',
        'Understand variable scope and closures',
        'Organize code into modules and packages',
      ],
      subtopics: [
        {
          name: 'Defining Functions, args & kwargs',
          id: 'def-args',
          content:
            'def keyword, positional & keyword args, default values, *args, **kwargs, keyword-only args, and annotations (type hints).',
          examples: [
            {
              code: `def greet(name: str, /, greeting: str = "Hello", *args, **kwargs) -> str:\n    return f"{greeting}, {name}"\n\nprint(greet("Alice"))`,
              description: 'Function with default args and type annotations',
            },
          ],
          recommended_resources: [],
        },
        {
          name: 'Scope & Closures',
          id: 'scope-closures',
          content:
            'Local vs global variables, nonlocal keyword, and closures capturing variables from enclosing scopes.',
          examples: [
            {
              code: `def make_counter():\n    count = 0\n    def inc():\n        nonlocal count\n        count += 1\n        return count\n    return inc\n\nc = make_counter()\nprint(c())  # 1\nprint(c())  # 2`,
              description: 'Closure example with nonlocal',
            },
          ],
          recommended_resources: [],
        },
        {
          name: 'Modules & Packages',
          id: 'modules-packages',
          content:
            'Create modules (.py), packages (folders with __init__.py), use import and package management, and best practices for structuring projects.',
          examples: [
            {
              code: '# project/\n#   mypkg/\n#     __init__.py\n#     utils.py\n# import as\n\nfrom mypkg.utils import helper',
              description: 'Module/package layout',
            },
          ],
          recommended_resources: [],
        },
      ],
      exercises: [
        {
          id: 'fn-1',
          title: 'Memoized Fibonacci',
          prompt:
            'Write a function fibonacci(n) that uses memoization (cache) to compute nth Fibonacci number efficiently.',
          difficulty: 'Intermediate',
          hint: 'Use a dict or functools.lru_cache',
        },
      ],
      recommended_resources: [
        {
          title: 'PEP 8',
          url: 'https://peps.python.org/pep-0008/',
          type: 'documentation',
        },
      ],
    },

    // 4. Object-Oriented Programming
    {
      name: 'Object-Oriented Programming',
      id: 'oop',
      slug: 'oop',
      difficulty: 'Intermediate',

      description:
        'Classes, instances, methods, class/instance attributes, inheritance, dunder methods, composition vs inheritance, and dataclasses.',
      learning_objectives: [
        'Design classes and use inheritance responsibly',
        'Make value objects with dataclasses',
        'Understand special methods and operator overloading',
      ],
      subtopics: [
        {
          name: 'Classes & Instances',
          id: 'classes',
          content:
            'Define classes, __init__, instance methods, classmethods, staticmethods, and properties.',
          examples: [
            {
              code: `class Dog:\n    species = "Canis familiaris"\n\n    def __init__(self, name: str, age: int):\n        self.name = name\n        self.age = age\n\n    def description(self) -> str:\n        return f"{self.name} is {self.age} years old"\n\n    def speak(self, sound: str) -> str:\n        return f"{self.name} says {sound}"\n\n# Usage\nbuddy = Dog('Buddy', 3)\nprint(buddy.description())  # Buddy is 3 years old`,
              description: 'Python class example',
            },
          ],
          recommended_resources: [],
        },
        {
          name: 'Inheritance & Polymorphism',
          id: 'inheritance',
          content:
            'Subclassing, method overriding, super(), and composition. Prefer composition when appropriate.',
          examples: [
            {
              code: `class Animal:\n    def speak(self):\n        raise NotImplementedError\n\nclass Dog(Animal):\n    def speak(self):\n        return 'Woof'\n\nclass Cat(Animal):\n    def speak(self):\n        return 'Meow'\n\nfor a in [Dog(), Cat()]:\n    print(a.speak())`,
              description: 'Simple inheritance example',
            },
          ],
          recommended_resources: [],
        },
        {
          name: 'Dataclasses & NamedTuples',
          id: 'dataclasses',
          content:
            'Use dataclasses (Python 3.7+) to reduce boilerplate for data containers. NamedTuple for immutable records.',
          examples: [
            {
              code: `from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: float\n    y: float\n\np = Point(1.0, 2.0)\nprint(p)`,
              description: 'Dataclass example',
            },
          ],
          recommended_resources: [],
        },
      ],
      exercises: [
        {
          id: 'oop-1',
          title: 'Design a Bank Account class',
          prompt:
            'Create a BankAccount class with deposit, withdraw, and transfer methods. Validate negative balances and write tests.',
          difficulty: 'Intermediate',
        },
      ],
    },

    // 5. Error Handling, Logging & Testing
    {
      name: 'Error Handling, Logging & Testing',
      id: 'errors-testing',
      slug: 'errors-testing',
      difficulty: 'Intermediate',
      description:
        'Robust programs handle errors gracefully, log events, and have tests. Covers try/except/else/finally, logging module, and pytest basics.',
      subtopics: [
        {
          name: 'Exceptions & Context Managers',
          id: 'exceptions',
          content:
            'Raise and catch exceptions, create custom exceptions, and use context managers (with statement).',
          examples: [
            {
              code: `try:\n    1 / 0\nexcept ZeroDivisionError as e:\n    print('Cannot divide by zero', e)\nfinally:\n    print('Cleanup if needed')`,
              description: 'Exception handling example',
            },
          ],
          recommended_resources: [],
        },
        {
          name: 'Logging',
          id: 'logging',
          content:
            'Use the logging module instead of prints to provide configurable, leveled logging output.',
          examples: [
            {
              code: `import logging\nlogging.basicConfig(level=logging.INFO)\nlogger = logging.getLogger(__name__)\nlogger.info('This is an info message')`,
              description: 'Basic logging setup',
            },
          ],
          recommended_resources: [],
        },
        {
          name: 'Testing with pytest',
          id: 'testing',
          content:
            'Write unit tests with pytest, use fixtures, parameterized tests, and run coverage reports.',
          examples: [
            {
              code: `# test_math.py\nimport pytest\n\nfrom mylib import add\n\ndef test_add():\n    assert add(2,3) == 5`,
              description: 'Simple pytest example',
            },
          ],
          recommended_resources: [
            {
              title: 'pytest docs',
              url: 'https://docs.pytest.org/',
              type: 'documentation',
            },
          ],
        },
      ],
      exercises: [
        {
          id: 'test-1',
          title: 'Test-driven FizzBuzz',
          prompt:
            'Write tests for the FizzBuzz function first, then implement the function to satisfy tests.',
          difficulty: 'Intermediate',
        },
      ],
    },

    // 6. File I/O & Persistence
    {
      name: 'File I/O & Persistence',
      id: 'file-io',
      slug: 'file-io',
      difficulty: 'Beginner→Intermediate',
      description:
        'Read/write files, CSV, JSON, use context managers, and basic database access (SQLite).',
      subtopics: [
        {
          name: 'Text & Binary Files',
          id: 'text-binary',
          content:
            'Open files with open(...), use read/write modes, and handle encoding.',
          examples: [
            {
              code: `# Write\nwith open('out.txt', 'w', encoding='utf-8') as f:\n    f.write('Hello\\n')\n# Read\nwith open('out.txt', 'r', encoding='utf-8') as f:\n    print(f.read())`,
              description: 'File read/write example',
            },
          ],
          recommended_resources: [],
        },
        {
          name: 'JSON & CSV',
          id: 'json-csv',
          content:
            'Use the json and csv stdlib modules to serialize and parse structured data.',
          examples: [
            {
              code: `import json\n\nobj = {'name':'Alice', 'age':25}\nwith open('data.json','w') as f:\n    json.dump(obj, f)\n\nwith open('data.json') as f:\n    print(json.load(f))`,
              description: 'JSON serialization example',
            },
          ],
          recommended_resources: [],
        },
        {
          name: 'SQLite (builtin DB)',
          id: 'sqlite',
          content:
            'Use sqlite3 for small local databases and to persist structured data without external DB servers.',
          examples: [
            {
              code: `import sqlite3\nconn = sqlite3.connect('example.db')\ncur = conn.cursor()\ncur.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)')\ncur.execute('INSERT INTO users (name) VALUES (?)', ('Alice',))\nconn.commit()\nfor row in cur.execute('SELECT * FROM users'):\n    print(row)\nconn.close()`,
              description: 'SQLite example',
            },
          ],
          recommended_resources: [],
        },
      ],
      exercises: [
        {
          id: 'file-1',
          title: 'CSV to JSON',
          prompt:
            'Read a CSV file of users and write it out as a JSON array. Handle missing values.',
          difficulty: 'Intermediate',
        },
      ],
    },

    // 7. Standard Library Deep Dive
    {
      name: 'Standard Library Essentials',
      id: 'stdlib',
      slug: 'stdlib',
      difficulty: 'Intermediate',
      description:
        'Key stdlib modules you will use often: os, sys, pathlib, collections, itertools, datetime, functools, typing, subprocess, json, logging, math, random.',
      subtopics: [
        {
          name: 'os, pathlib & sys',
          id: 'os-pathlib',
          content:
            'os for environment bits, pathlib for modern path handling, and sys for interpreter-level info.',
          recommended_resources: [],
        },
        {
          name: 'collections & itertools',
          id: 'collections-itertools',
          content:
            'Useful high-performance containers (deque, defaultdict, Counter) and iterator tools (groupby, accumulate).',
          examples: [
            {
              code: `from collections import Counter\nc = Counter(['a','b','a'])\nprint(c)  # Counter({'a': 2, 'b': 1})`,
              description: 'Counter example',
            },
          ],
          recommended_resources: [],
        },
        {
          name: 'functools & itertools',
          id: 'functools-itertools',
          content:
            'lru_cache, partial, reduce, and other helpers to create efficient and compact code.',
          recommended_resources: [],
        },
      ],
      exercises: [
        {
          id: 'stdlib-1',
          title: 'Use defaultdict & Counter',
          prompt:
            'Given a list of words, use Counter to find top 3 most common words and defaultdict to group words by length.',
          difficulty: 'Intermediate',
        },
      ],
    },

    // 8. Concurrency & Async
    {
      name: 'Concurrency & Async',
      id: 'concurrency',
      slug: 'concurrency',
      difficulty: 'Advanced',
      description:
        'Threads vs processes vs async: understand GIL, when each model is appropriate, asyncio basics, and common concurrency utilities.',
      subtopics: [
        {
          name: 'Threading & Multiprocessing',
          id: 'threads-processes',
          content:
            'Use threading for I/O-bound tasks, multiprocessing for CPU-bound tasks. Beware of GIL with threads.',
          recommended_resources: [],
        },
        {
          name: 'AsyncIO',
          id: 'asyncio',
          content:
            'async/await syntax, event loop, tasks, and common patterns used in frameworks like FastAPI.',
          examples: [
            {
              code: `import asyncio\n\nasync def say_after(delay, what):\n    await asyncio.sleep(delay)\n    print(what)\n\nasync def main():\n    await asyncio.gather(say_after(1, 'hello'), say_after(2, 'world'))\n\nasyncio.run(main())`,
              description: 'Basic asyncio example',
            },
          ],
          recommended_resources: [],
        },
      ],
      exercises: [
        {
          id: 'con-1',
          title: 'Async Web Requests',
          prompt:
            'Use aiohttp or httpx (async) to fetch data from multiple URLs concurrently and measure speedup vs synchronous requests.',
          difficulty: 'Advanced',
        },
      ],
      recommended_resources: [
        {
          title: 'AsyncIO docs',
          url: 'https://docs.python.org/3/library/asyncio.html',
          type: 'documentation',
        },
      ],
    },

    // 9. Web Development Essentials
    {
      name: 'Web Development',
      id: 'web',
      slug: 'web-development',
      difficulty: 'Intermediate',
      description:
        'Build backend services and APIs with Flask, Django, and FastAPI. Learn routing, templating, auth, and deploying web apps.',
      subtopics: [
        {
          name: 'Flask basics',
          id: 'flask',
          content:
            'Lightweight micro-framework ideal for learning. Handles routing, templating, and extensions.',
          examples: [
            {
              code: `from flask import Flask\napp = Flask(__name__)\n\n@app.route('/')\ndef index():\n    return 'Hello from Flask!'\n\n# Run: FLASK_APP=app.py flask run`,
              description: 'Minimal Flask app',
            },
          ],
          recommended_resources: [],
        },
        {
          name: 'FastAPI & Async APIs',
          id: 'fastapi',
          content:
            'FastAPI for modern, type-hinted, fast APIs (built on Starlette). Automatic docs via OpenAPI/Swagger.',
          examples: [
            {
              code: `from fastapi import FastAPI\napp = FastAPI()\n\n@app.get('/items/{item_id}')\ndef read_item(item_id: int):\n    return {'item_id': item_id}`,
              description: 'Simple FastAPI endpoint',
            },
          ],
          recommended_resources: [],
        },
        {
          name: 'Django Overview',
          id: 'django',
          content:
            'Batteries-included framework with ORM, admin, auth, and templating. Good for full-featured apps with less wiring.',
          recommended_resources: [],
        },
      ],
      projects: [
        {
          id: 'web-1',
          title: 'ToDo App',
          description:
            'Create a CRUD ToDo app with FastAPI or Flask, persistence with SQLite or Postgres, and deploy to a cloud provider.',
          difficulty: 'Intermediate',
        },
      ],
      recommended_resources: [
        {
          title: 'FastAPI docs',
          url: 'https://fastapi.tiangolo.com/',
          type: 'documentation',
        },
        {
          title: 'Flask docs',
          url: 'https://flask.palletsprojects.com/',
          type: 'documentation',
        },
      ],
    },

    // 10. Data Science + ML intro
    {
      name: 'Data Science & Machine Learning (Intro)',
      id: 'data-ml',
      slug: 'data-ml',
      difficulty: 'Intermediate→Advanced',
      description:
        'Intro to NumPy, Pandas, visualization, scikit-learn basics, and a short ML workflow (dataset, preprocessing, modeling, evaluation).',
      subtopics: [
        {
          name: 'NumPy basics',
          id: 'numpy',
          content:
            'N-dimensional arrays and vectorized operations — foundational for scientific computing.',
          examples: [
            {
              code: `import numpy as np\narr = np.array([1,2,3])\nprint(arr.mean())`,
              description: 'NumPy example',
            },
          ],
          recommended_resources: [],
        },
        {
          name: 'Pandas for data analysis',
          id: 'pandas',
          content:
            'DataFrames for tabular data, indexing, grouping, merging, and basic ETL operations.',
          examples: [
            {
              code: `import pandas as pd\ndf = pd.DataFrame({'a':[1,2], 'b':[3,4]})\nprint(df.describe())`,
              description: 'Pandas example',
            },
          ],
          recommended_resources: [],
        },
        {
          name: 'Visualization',
          id: 'viz',
          content:
            'Matplotlib/Seaborn for plotting exploratory visuals; best practices for readable charts.',
          recommended_resources: [],
        },
        {
          name: 'scikit-learn basics',
          id: 'sklearn',
          content:
            'Classic ML pipeline: split data, create model, fit, predict, and evaluate with metrics.',
          recommended_resources: [],
        },
      ],
      projects: [
        {
          id: 'ds-1',
          title: 'Titanic Data Analysis',
          description:
            'Load Kaggle Titanic dataset, clean features, do EDA, train a classifier, and evaluate results.',
          difficulty: 'Intermediate',
        },
      ],
      recommended_resources: [
        {
          title: 'Pandas docs',
          url: 'https://pandas.pydata.org/',
          type: 'documentation',
        },
        {
          title: 'scikit-learn',
          url: 'https://scikit-learn.org/',
          type: 'documentation',
        },
      ],
    },

    // 11. Advanced Python
    {
      name: 'Advanced Python',
      id: 'advanced',
      slug: 'advanced',
      difficulty: 'Advanced',
      description:
        'Dive into decorators, generators, context managers, metaclasses, descriptors, typing, and performance optimization.',
      subtopics: [
        {
          name: 'Generators & Iterators',
          id: 'generators',
          content:
            'Iterators protocol (__iter__/__next__), yield, generator expressions, and streaming data processing.',
          examples: [
            {
              code: `def count_up_to(n):\n    i = 0\n    while i < n:\n        yield i\n        i += 1\n\nfor x in count_up_to(3):\n    print(x)`,
              description: 'Generator example',
            },
          ],
          recommended_resources: [],
        },
        {
          name: 'Decorators & Context Managers',
          id: 'decorators',
          content:
            "Create reusable function wrappers with decorators; write custom context managers with 'with' and contextlib.",
          examples: [
            {
              code: `import time\n\ndef timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        print("Time: {time.time()-start:.4f}s")\n        return result\n    return wrapper\n\n@timer\ndef work():\n    sum(range(100000))\n\nwork()`,
              description: 'Simple timing decorator',
            },
          ],
          recommended_resources: [],
        },
        {
          name: 'Typing & Protocols',
          id: 'typing',
          content:
            'Static typing with the typing module, Protocols (structural typing), and mypy for type checking.',
          recommended_resources: [],
        },
        {
          name: 'Metaprogramming: Metaclasses & Descriptors',
          id: 'metaclasses',
          content:
            'Advanced patterns for controlling class creation and attribute access; use sparingly.',
          recommended_resources: [],
        },
        {
          name: 'Profiling & Optimization',
          id: 'profiling',
          content:
            'Measure performance with cProfile, timeit, and optimize hotspots (algorithmic improvements, vectorization, caching).',
          recommended_resources: [],
        },
      ],
      exercises: [
        {
          id: 'adv-1',
          title: 'Create a decorator with parameters',
          prompt:
            'Write a decorator that retries a function call up to N times with an optional delay.',
          difficulty: 'Advanced',
        },
      ],
      recommended_resources: [
        {
          title: 'Fluent Python',
          url: 'https://www.oreilly.com/library/view/fluent-python/9781491946237/',
          type: 'documentation',
        },
      ],
    },

    // 12. Packaging, CI/CD & Deployment
    {
      name: 'Packaging & Deployment',
      id: 'packaging',
      slug: 'packaging-deploy',
      difficulty: 'Intermediate',
      description:
        'Package projects (setuptools/poetry), publish to PyPI, Dockerize apps, and create CI pipelines.',
      subtopics: [
        {
          name: 'Packaging & Virtual Environments',
          id: 'packaging-env',
          content:
            'Use pyproject.toml + Poetry for modern package management, or setup.cfg/setup.py with setuptools. Pin dependencies and create reproducible builds.',
          recommended_resources: [],
        },
        {
          name: 'Containers & Deployment',
          id: 'containers',
          content:
            'Build Docker images, push to a registry, and deploy web apps to services (Heroku, Render, AWS, GCP).',
          recommended_resources: [],
        },
        {
          name: 'CI/CD basics',
          id: 'cicd',
          content:
            'Run tests, linters, and publish artifacts using GitHub Actions or similar.',
          recommended_resources: [],
        },
      ],
      projects: [
        {
          title: 'Deploy a REST API',
          description:
            'Dockerize a simple FastAPI application, create a Dockerfile, push to Docker Hub, and deploy to a cloud provider.',
          id: '',
          difficulty: 'Advanced',
        },
      ],
    },

    // 13. Security & Best Practices
    {
      name: 'Security & Best Practices',
      id: 'security',
      slug: 'security',
      difficulty: 'Intermediate',
      description:
        'Secure secrets, avoid common vulnerabilities (injection, unsafe deserialization), and follow secure coding practices.',
      subtopics: [
        {
          name: 'Secrets & Credentials',
          id: 'secrets',
          content:
            'Never commit secrets. Use environment variables, vaults, or cloud secret managers. Rotate credentials regularly.',
          recommended_resources: [],
        },
        {
          name: 'Web Security Basics',
          id: 'web-security',
          content:
            'Sanitize inputs, use parameterized queries, validate user data, and use secure cookies/headers.',
          recommended_resources: [],
        },
      ],
    },

    // 14. Interview Prep & Algorithms in Python
    {
      name: 'Interview Prep & Algorithms',
      id: 'interview-prep',
      slug: 'interview-prep',
      difficulty: 'Intermediate→Advanced',
      estimated_time_hours: 8,
      description:
        'Common algorithms and patterns in Python: arrays, strings, hashmaps, sliding window, two pointers, recursion/backtracking, dynamic programming, graph basics, and implementing data structures.',
      subtopics: [
        {
          name: 'Common Algorithm Patterns',
          id: 'algo-patterns',
          content:
            'Sliding window, two pointers, divide & conquer, greedy, and dynamic programming with Pythonic implementations.',
          recommended_resources: [],
        },
        {
          name: 'Problem solving practice',
          id: 'practice',
          content:
            'Practice problems with explanations; implement both brute-force and optimized solutions using Python idioms.',
          recommended_resources: [],
        },
      ],
      recommended_resources: [
        {
          title: 'LeetCode',
          url: 'https://leetcode.com/',
          type: 'documentation',
        },
      ],
    },

    // 15. Capstone Projects & Real-world Applications
    {
      name: 'Capstone & Projects',
      id: 'capstone',
      slug: 'capstone-projects',
      difficulty: 'Intermediate→Advanced',
      description:
        'End-to-end projects that combine multiple skills: web app with auth + DB, data pipeline + dashboard, ML model + deployment.',
      projects: [
        {
          id: 'cap-1',
          title: 'Full-Stack Notes App',
          description:
            'Backend in FastAPI, frontend in React/Next, authentication, persistence (Postgres), and Docker deployment.',
          difficulty: 'Advanced',
        },
        {
          id: 'cap-2',
          title: 'Data Pipeline & Dashboard',
          description:
            'Ingest CSV/HTTP data, transform with Pandas, store in DB, and create a plotly/dash dashboard. Schedule jobs with cron or Airflow.',
          difficulty: 'Advanced',
        },
        {
          id: 'cap-3',
          title: 'ML Model Productionization',
          description:
            'Train a model, create inference endpoints, containerize, and add monitoring for model drift.',
          difficulty: 'Advanced',
        },
      ],
    },
  ], // end topics

  // Examples array (teachable snippets)
  examples: [
    {
      code: `# List comprehension\nsquares = [x**2 for x in range(10)]\neven_squares = [x**2 for x in range(10) if x % 2 == 0]\nprint(even_squares)`,
      description: 'List comprehensions for concise list creation',
      language: 'python',
    },
    {
      code: `# File I/O\nwith open("example.txt", "w", encoding="utf-8") as f:\n    f.write("Hello, World!")\n\nwith open("example.txt", "r", encoding="utf-8") as f:\n    print(f.read())`,
      description: 'File writing and reading using context manager',
      language: 'python',
    },
    {
      code: `# Simple decorator\nimport time\n\ndef timer(func):\n    def wrapper(*args, **kwargs):\n        s = time.time()\n        res = func(*args, **kwargs)\n        print(f'Time: {time.time()-s:.4f}s')\n        return res\n    return wrapper\n\n@timer\ndef work():\n    sum(range(1000000))\n\nwork()`,
      description: 'Timing decorator example',
      language: 'python',
    },
  ],

  // Challenges & exercises across course
  challenges: [
    {
      id: 'fibonacci-challenge',
      title: 'Fibonacci Sequence',
      description: 'Return nth Fibonacci number (0-indexed).',
      difficulty: 'Beginner',
      example: `def fibonacci(n):\n    # implement\n    pass`,
      solution: `def fibonacci(n):\n    if n <= 0:\n        return 0\n    elif n == 1:\n        return 1\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b`,
      testCases: [
        { input: '0', output: '0' },
        { input: '1', output: '1' },
        { input: '10', output: '55' },
      ],
    },
    {
      id: 'palindrome-challenge',
      title: 'Palindrome Checker',
      description:
        'Check if a string is palindrome (ignore non-alphanumeric & case).',
      difficulty: 'Beginner',
      solution: `def is_palindrome(s):\n    s = ''.join(c.lower() for c in s if c.isalnum())\n    return s == s[::-1]`,
    },
  ],

  // Resources: books, docs, courses, websites
  resources: [
    {
      id: 'python-docs',
      title: 'Python Official Documentation',
      url: 'https://docs.python.org/3/',
      type: 'documentation',
      author: 'Python Software Foundation',
      description:
        'Comprehensive official reference and library documentation.',
    },
    {
      id: 'python-crash-course',
      title: 'Python Crash Course (book)',
      url: 'https://nostarch.com/pythoncrashcourse2e',
      type: 'book',
      author: 'Eric Matthes',
      description: 'Hands-on, project-based beginner book.',
    },
    {
      id: 'fluent-python',
      title: 'Fluent Python (book)',
      url: 'https://www.oreilly.com/library/view/fluent-python/9781491946237/',
      type: 'book',
      author: 'Luciano Ramalho',
      description: 'Deep dive into Pythonic idioms and advanced topics.',
    },
    {
      id: 'real-python',
      title: 'Real Python articles',
      url: 'https://realpython.com/',
      type: 'article',
      author: 'Real Python Team',
    },
    {
      id: 'fastapi',
      title: 'FastAPI tutorial',
      url: 'https://fastapi.tiangolo.com/',
      type: 'documentation',
    },
    {
      id: 'pandas',
      title: 'Pandas documentation',
      url: 'https://pandas.pydata.org/docs/',
      type: 'documentation',
    },
  ],

  // learning path (time estimates and milestones)
  learning_path: {
    beginner: {
      timeline_weeks: 2,
      milestones: [
        'Setup & Hello World',
        'Basic Syntax',
        'Functions',
        'Small projects & tests',
      ],
      recommended_topics: [
        'getting-started',
        'syntax',
        'functions',
        'file-io',
        'errors-testing',
      ],
    },
    intermediate: {
      timeline_weeks: 6,
      milestones: [
        'OOP & Modules',
        'Web basics',
        'Data basics',
        'More projects',
      ],
      recommended_topics: [
        'oop',
        'web-development',
        'data-ml',
        'stdlib',
        'packaging-deploy',
      ],
    },
    advanced: {
      timeline_weeks: 8,
      milestones: [
        'Async & Concurrency',
        'Advanced Python',
        'Profiling',
        'Capstone',
      ],
      recommended_topics: [
        'concurrency',
        'advanced',
        'capstone',
        'interview-prep',
      ],
    },
  },

  // projects & capstones summarized
  project_ideas: [
    {
      title: 'URL Shortener',
      description:
        'Build a URL shortener with FastAPI, SQLite, and a simple React frontend',
      technologies: ['FastAPI', 'SQLite', 'Docker'],
      difficulty: 'Intermediate',
    },
    {
      title: 'Chatbot with NLP',
      description:
        'Create a simple chatbot using NLP libraries and host it behind an API',
      technologies: ['spaCy', 'FastAPI'],
      difficulty: 'Advanced',
    },
  ],

  performance_tips: [
    {
      tip: 'Use sets for membership testing',
      explanation: 'O(1) complexity vs O(n) for lists',
      example: { before: 'if x in [1,2,3]:', after: 'if x in {1,2,3}:' },
    },
    {
      tip: 'Profile before optimizing',
      explanation:
        'Use cProfile/timeit to identify hotspots rather than guessing',
    },
    {
      tip: 'Use vectorized operations for numeric data',
      explanation:
        'NumPy/Pandas vectorized ops are considerably faster than Python loops',
    },
  ],

  interview_prep: {
    questions: [
      {
        question: "Explain Python's GIL",
        answer:
          'Global Interpreter Lock (GIL) is a mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecodes at once in CPython. It simplifies memory management but limits CPU-bound multi-threaded performance; use multiprocessing or native extensions for parallel CPU work.',
      },
      {
        question: 'Difference between list and tuple',
        answer:
          'Lists are mutable and dynamic; tuples are immutable and can be used as keys in dicts if their elements are hashable.',
      },
    ],
    coding_problems: [
      {
        problem: 'LRU Cache',
        solution:
          'Use collections.OrderedDict or functools.lru_cache decorator for functions.',
      },
      {
        problem: 'Two-sum',
        solution: 'Use a hashmap to achieve O(n) time complexity.',
      },
    ],
    mock_interview_plan: {
      duration_hours: 20,
      focus: [
        'Data Structures',
        'System Design (backend basics)',
        'Pythonic implementations',
        'Behavioral prep',
      ],
    },
  },

  cheatsheet: {
    List_Operations: {
      Create: 'lst = [1, 2, 3]',
      Slice: 'lst[start:stop:step]',
      Comprehension: '[x*2 for x in lst if x > 1]',
      Common: 'append, extend, insert, pop, remove, sort, reverse',
    },
    String_Formatting: {
      fstring: 'f"Hello, {name}"',
      format: '"Hello {}".format(name)',
      percent: '"%s" % name',
    },
    Common_Commands: {
      run_script: 'python script.py',
      install_package: 'pip install package',
      run_tests: 'pytest -q',
    },
  },

  meta: {
    last_updated: new Date().toISOString(),
    authors: ['Curriculum Team'],
    suggested_tools: [
      'VS Code',
      'Poetry',
      'pytest',
      'black',
      'flake8',
      'mypy',
      'Docker',
    ],
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
