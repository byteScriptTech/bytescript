// seed-javascript-content.ts
import admin from 'firebase-admin';

import { LanguageContent } from '../src/types/content';

// Replace with your service account path or import method
const serviceAccount = require('../deneb-88a71-firebase-adminsdk-3z447-5d0122f45c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://deneb-88a71.firebaseio.com',
});

const db = admin.firestore();

export const javascriptContent: LanguageContent = {
  id: 'js-2025-08',
  name: 'JavaScript',
  tag: 'programming-language',
  version_info: {
    current_version: 'ES2025',
    version_history: [
      {
        version: 'ES2025',
        key_features: [
          'Object and collection utilities (Object.groupBy, Map/Set helpers)',
          'RegExp improvements (v flag, enhanced Unicode support)',
          'New iterator / global Iterator utilities and Set methods',
          'Other standard library enhancements',
        ],
        notes:
          'ECMAScript 2025 standardizes a set of small-yet-useful runtime APIs and regex/Unicode improvements.',
      },
      {
        version: 'ES2024',
        key_features: [
          'Object.groupBy / Map.groupBy',
          'String isWellFormed / toWellFormed',
          'Promise.withResolvers and low-level additions',
        ],
      },
      {
        version: 'ES2022',
        key_features: [
          'Top-level await',
          'Class fields and private methods',
          'Error cause property (Error.cause)',
        ],
      },
    ],
    compatibility_notes:
      'Modern browsers and Node.js releases support most ES2022+ features. For older browsers/environments, transpile with Babel or TypeScript and use polyfills where necessary.',
  },
  short_description:
    'JavaScript — a versatile, high-level language for web and server development. Used for interactive UIs, backend services (Node.js), mobile, desktop apps, CLIs, and more.',
  applications: [
    'Frontend Web (React, Vue, Angular, Svelte)',
    'Backend / APIs (Node.js, Deno, Bun, Fastify, Express)',
    'Full-stack frameworks (Next.js, Remix, Nuxt)',
    'Mobile (React Native, Ionic, Capacitor)',
    'Desktop (Electron, Tauri)',
    'CLIs and Developer Tools',
    'Realtime apps & WebSockets',
  ],
  explanation: [
    'JavaScript follows the ECMAScript standard and is multi-paradigm (imperative, functional, OOP).',
    'It runs in browsers and on server runtimes like Node.js; it has a massive ecosystem (npm).',
    'It uses an event-loop model for concurrency and has async primitives (Promise, async/await).',
  ],
  prerequisites: [
    'HTML & CSS basics',
    'Understanding of fundamental programming concepts (variables, control flow, functions)',
    'A code editor (VS Code recommended) and a modern browser (Chrome/Firefox/Edge)',
  ],
  learning_objectives: [
    'Master JavaScript fundamentals and ES6+ syntax',
    'Write asynchronous code confidently (callbacks → Promises → async/await)',
    'Manipulate the DOM and understand browser runtime APIs',
    'Use Node.js for server-side development and tooling',
    'Understand modern build tools, bundlers, and package managers',
    'Write tests, lint and format code, and set up CI for JS projects',
    'Practice building real projects and deploy them',
  ],
  best_practices_and_common_mistakes: {
    common_mistakes: [
      {
        text: 'Using var instead of let/const',
        example: 'var count = 1; // function-scoped — surprising hoisting',
        fix: "Use let for reassignment, const for values that don't change.",
        explanation:
          'Prefer block-scoped declarations (let/const). const signals intent and reduces bugs.',
      },
      {
        text: 'Not handling errors in async code',
        example: `async function load() {
  const res = await fetch('/data'); // could reject
  const data = await res.json(); // could throw
  return data;
}`,
        fix: `// Handle errors with try/catch
async function load() {
  try {
    const res = await fetch('/data');
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (error) {
    console.error('Failed to load:', error);
    // Handle or rethrow
  }
}`,
        explanation:
          'Always handle network and parsing errors. Uncaught Promise rejections can crash processes in Node versions/configurations.',
      },
      {
        text: 'Mutating shared objects or arrays unexpectedly',
        example: `const a = [1,2]; const b = a; b.push(3); // a is mutated`,
        fix: 'Use spread or functional methods to avoid accidental mutation: const b = [...a, 3];',
        explanation:
          'In JavaScript, objects and arrays are passed by reference. Be explicit about mutations to avoid bugs.',
      },
    ],
    best_practices: [],
  },
  topics: [
    {
      id: 'js-001-getting-started',
      name: 'Getting Started',
      slug: 'getting-started',
      difficulty: 'Beginner',
      description: 'Overview, setup, and first programs',
      subtopics: [
        {
          id: 'js-001-what-is-js',
          name: 'What is JavaScript?',
          content:
            'History, where it runs (browser, Node.js), and what ECMAScript means.',
          examples: [
            {
              code: "console.log('Hello, JavaScript!');",
              description: 'Shows how to output text to the console',
            },
          ],
          recommended_resources: [],
        },
        {
          id: 'js-002-tools-and-editor',
          name: 'Tools and Editor Setup',
          content:
            'Install Node.js (LTS), VS Code, and basic extensions (ESLint, Prettier, EditorConfig, TypeScript).',
          recommended_resources: [],
        },
        {
          id: 'js-003-running-js',
          name: 'Running JavaScript',
          content:
            'Run in browser console, via <script> tags, or with Node.js (`node file.js`).',
          examples: [
            {
              code: `// Run with Node.js
// node index.js
console.log('node running')`,
              description: 'Node.js script',
            },
          ],
          recommended_resources: [],
        },
      ],
    },

    {
      id: 'js-002-variables-types',
      name: 'Variables & Types',
      slug: 'variables-types',
      difficulty: 'Beginner',
      description: 'Primitive vs reference types, coercion, and useful helpers',
      subtopics: [
        {
          id: 'js-001-primitives-references',
          name: 'Primitives and References',
          content:
            'string, number, bigint, boolean, undefined, null, symbol; arrays & objects are reference types.',
          recommended_resources: [],
        },
        {
          id: 'js-002-type-conversion',
          name: 'Type Conversion & Coercion',
          content:
            'Explicit conversions (Number(), String(), Boolean()), and pitfalls of implicit coercion.',
          examples: [
            {
              code: `'' + 1 // '1' (string concatenation)
'5' - 2 // 3 (numeric conversion)
Boolean('') // false (falsy value)`,
              description: 'Demonstrates JavaScript type coercion rules',
            },
          ],
          recommended_resources: [],
        },
      ],
    },

    {
      id: 'js-003-functions-scope',
      name: 'Functions & Scope',
      slug: 'functions-scope',
      difficulty: 'Beginner',
      description: 'Declarations, expressions, closures, and hoisting',
      subtopics: [
        {
          id: 'js-001-function-forms',
          name: 'Function Forms',
          content:
            'Function declarations, expressions, arrow functions, and `this` differences.',
          examples: [
            {
              code: `// Regular function has its own 'this' context
const person = {
  name: 'A',
  greet: function() { 
    return this.name; // 'this' refers to the person object
  },
  // Arrow function inherits 'this' from the surrounding scope
  greetArrow: () => this.name // 'this' is not bound to person
};`,
              description:
                'Demonstrates how "this" works differently in regular vs arrow functions',
            },
          ],
          recommended_resources: [],
        },
        {
          id: 'js-002-closures',
          name: 'Closures',
          content:
            'Functions that remember lexical scope — foundation for modules and private state.',
          examples: [
            {
              code: `function makeCounter() {
  let count = 0; // Local variable in makeCounter's scope
  
  // The returned function forms a closure over 'count'
  return () => ++count; // Can still access 'count' after makeCounter finishes
}

const c = makeCounter();
c(); // Returns 1
c(); // Returns 2 - maintains its own private 'count' variable`,
              description:
                'Demonstrates how closures maintain access to their lexical environment',
            },
          ],
          recommended_resources: [],
        },
      ],
    },

    {
      id: 'js-004-objects-arrays',
      name: 'Objects & Arrays',
      slug: 'objects-arrays',
      difficulty: 'Beginner',
      description: 'Working idiomatically with collections and objects',
      subtopics: [
        {
          id: 'js-001-object-patterns',
          name: 'Object patterns',
          content:
            'Object literals, property shorthand, computed properties, and `Object` helpers.',
          recommended_resources: [],
        },
        {
          id: 'js-002-array-utilities',
          name: 'Array utilities',
          content:
            'map/filter/reduce/find/flat/flatMap/at, plus iteration best practices and immutability.',
          recommended_resources: [],
        },
      ],
    },

    {
      id: 'js-005-dom-browser',
      name: 'DOM & Browser APIs',
      slug: 'dom-browser',
      difficulty: 'Beginner → Intermediate',
      description:
        'Selecting elements, events, forms, fetch, Storage, and common browser APIs',
      subtopics: [
        {
          id: 'js-001-selecting-dom',
          name: 'Selecting & Updating DOM',
          content:
            'querySelector, event listeners, delegation, dataset, forms, and accessibility basics (a11y).',
          recommended_resources: [],
        },
        {
          id: 'js-002-fetch-xhr',
          name: 'Fetch & XHR',
          content:
            'fetch API, response lifecycle, handling JSON, and aborting requests with AbortController.',
          examples: [
            {
              code: `async function get() {
  // Create a new AbortController
  const controller = new AbortController();
  
  // Set a timeout to abort the request after 5 seconds
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  try {
    // Pass the signal to fetch
    const res = await fetch('/api', { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request was aborted');
    }
    throw error;
  }
}`,
              description:
                'Shows how to cancel fetch requests using AbortController',
            },
          ],
          recommended_resources: [],
        },
      ],
    },

    {
      id: 'js-006-async-js',
      name: 'Asynchronous JavaScript',
      slug: 'async-javascript',
      difficulty: 'Intermediate',
      description: 'Callbacks → Promises → async/await; concurrency patterns',
      subtopics: [
        {
          id: 'js-001-promises-basics',
          name: 'Promises basics',
          content: 'Creating, chaining, and error handling with Promises.',
          recommended_resources: [],
        },
        {
          id: 'js-002-async-await',
          name: 'Async/Await',
          content:
            'Syntactic sugar over Promises; always handle errors with try/catch or top-level handlers.',
          recommended_resources: [],
        },
        {
          id: 'js-003-concurrency-patterns',
          name: 'Concurrency patterns',
          content:
            'Promise.all/any/race/allSettled and using queues/workers for throttling.',
          recommended_resources: [],
        },
      ],
    },

    {
      id: 'js-007-modern-js',
      name: 'Modern JavaScript (ES6+ & Beyond)',
      slug: 'modern-javascript',
      difficulty: 'Intermediate',
      description:
        'ES6 features and later additions (destructuring, modules, classes, optional chaining, nullish coalescing).',
      subtopics: [
        {
          id: 'js-001-modules',
          name: 'Modules',
          content:
            'ES Modules (import/export), default vs named exports, and bundler/Node differences.',
          recommended_resources: [],
        },
        {
          id: 'js-002-new-standard-library',
          name: 'New Standard Library APIs',
          content:
            'Examples: Array.at(), Object.groupBy (ES2024+), String.isWellFormed, RegExp v flag improvements.',
          recommended_resources: [],
        },
      ],
    },

    {
      id: 'js-008-tooling-build',
      name: 'Tooling & Build',
      slug: 'tooling-build',
      difficulty: 'Intermediate',
      description:
        'Package managers, bundlers, transpilers, and task runners you’ll use daily',
      subtopics: [
        {
          id: 'js-001-package-managers',
          name: 'Package Managers',
          content: 'npm, yarn, pnpm — choosing and using lockfiles.',
          recommended_resources: [],
        },
        {
          id: 'js-002-bundlers-dev-servers',
          name: 'Bundlers and dev servers',
          content:
            'Vite (recommended for modern apps), Webpack (configurable legacy projects), Rollup for libraries.',
          recommended_resources: [],
        },
        {
          id: 'js-003-transpilation-polyfills',
          name: 'Transpilation & Polyfills',
          content:
            'Babel and TypeScript for syntax transformation; core-js / polyfills for missing APIs.',
          recommended_resources: [],
        },
      ],
    },

    {
      id: 'js-009-testing-linting',
      name: 'Testing, Linting & Formatting',
      slug: 'testing-linting',
      difficulty: 'Intermediate',
      description: 'Unit tests, integration, E2E, linters and formatters',
      subtopics: [
        {
          id: 'js-001-testing-frameworks',
          name: 'Testing frameworks',
          content:
            'Jest, Vitest, Mocha + Chai; Playwright or Cypress for E2E tests.',
          recommended_resources: [],
        },
        {
          id: 'js-002-linting-formatting',
          name: 'Linting & formatting',
          content:
            'ESLint rulesets, Prettier for formatting, and integrating in CI.',
          recommended_resources: [],
        },
      ],
    },

    {
      id: 'js-010-node-backend',
      name: 'Node.js & Backend',
      slug: 'node-backend',
      difficulty: 'Intermediate → Advanced',
      description:
        'Create servers, work with file system, streams, child processes and deploy Node apps.',
      subtopics: [
        {
          id: 'js-001-http-servers',
          name: 'HTTP servers & frameworks',
          content:
            'Express, Fastify, and higher-level frameworks (Next.js API routes).',
          recommended_resources: [],
        },
        {
          id: 'js-002-databases-persistence',
          name: 'Databases & persistence',
          content: 'Using ORMs/clients: Prisma, Sequelize, MongoDB drivers.',
          recommended_resources: [],
        },
      ],
    },

    {
      id: 'js-011-typescript',
      name: 'TypeScript & Typing JavaScript',
      slug: 'typescript',
      difficulty: 'Intermediate',
      description:
        'Add types for better DX and maintainability. When to adopt TS and migration tips.',
    },

    {
      id: 'js-012-security-performance',
      name: 'Security & Performance',
      slug: 'security-performance',
      difficulty: 'Intermediate → Advanced',
      description:
        'CSP, XSS/CSRF basics, performance budgeting, code-splitting, lazy-loading, and profiling.',
    },
  ],

  examples: [
    {
      code: `// DOM Counter (vanilla)
// HTML: <button id="counter">Click me: 0</button>

// Get reference to the button
const btn = document.getElementById('counter');
let n = 0;

// Add click event listener
btn.addEventListener('click', () => {
  n++; // Increment counter
  btn.textContent = \`Click me: \${n}\`; // Update button text
});`,
      description: 'Button increments a counter displayed on the page',
    },
    {
      code: `/**
 * Fetches user data from JSONPlaceholder API
 * @param {number} id - The user ID to fetch
 * @returns {Promise<object|null>} User data or null if request fails
 */
async function fetchUser(id) {
  try {
    const response = await fetch(
      \`https://jsonplaceholder.typicode.com/users/\${id}\`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    // Optionally re-throw or handle the error as needed
    return null;
  }
}`,
      description: 'Robust function to fetch user data with error handling',
    },
  ],

  exercises: [
    {
      id: 'js-exr-001-todo',
      title: 'Beginner — Build a To-Do',
      difficulty: 'Beginner',
      description:
        'Create a small to-do app with add/remove/mark-done, persist to localStorage, and use DOM manipulation.',
      hints: [
        'Store tasks as an array of objects: { id, text, done }',
        'Render list from state and re-render on changes',
      ],
    },
    {
      id: 'js-exr-002-fetch',
      title: 'Intermediate — Fetch + Render',
      difficulty: 'Intermediate',
      description:
        'Fetch a list of posts from a public API and implement client-side search and pagination.',
      hints: ['Use fetch and cache results; implement debounced search'],
    },
    {
      id: 'js-exr-003-spa-router',
      title: 'Advanced — Mini SPA Router',
      difficulty: 'Advanced',
      description:
        'Build a tiny client router using the History API, with route params and lazy-loading of views.',
      hints: [
        'Use history.pushState and popstate events; map routes to loader functions',
      ],
    },
  ],

  project_ideas: [
    {
      id: 'js-proj-001-kanban',
      title: 'Personal Notes App (Fullstack)',
      description:
        'Frontend with React + Vite, backend with Node.js/Express + Prisma + Postgres. Implement auth (JWT) and search.',
    },
    {
      id: 'js-proj-002-realtime-chat',
      title: 'Realtime Chat',
      description:
        'Use WebSockets / Socket.io for real-time messaging; optionally add presence and typing indicators.',
    },
    {
      id: 'js-proj-003-open-source',
      title: 'Open-source Library',
      description:
        'Create a small utility library (e.g., formatters or collection helpers), publish to npm with CI and tests.',
    },
  ],

  performance_tips: [
    {
      id: 'js-pt-001-reflow',
      tip: 'Minimize reflows',
      explanation:
        'Batch DOM updates, use DocumentFragment when inserting many nodes, and avoid changing layout-triggering properties repeatedly.',
    },
    {
      id: 'js-pt-002-code-splitting',
      tip: 'Use code-splitting',
      explanation:
        'Split large bundles and lazy-load routes/components to reduce initial load time.',
    },
  ],

  resources: [
    {
      id: 'js-res-001-mdn',
      title: 'MDN Web Docs (JavaScript)',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      type: 'documentation',
      description: 'Comprehensive JavaScript documentation by Mozilla',
    },
    {
      id: 'js-res-002-ecma',
      title: 'ECMAScript Language Specification (ECMA-262)',
      url: 'https://262.ecma-international.org/',
      type: 'documentation',
      description: 'The official ECMAScript language specification',
    },
    {
      id: 'js-res-003-node',
      title: 'Node.js Official Documentation',
      url: 'https://nodejs.org/',
      type: 'documentation',
      description: 'Official Node.js documentation and API reference',
    },
    {
      id: 'js-res-004-vite',
      title: 'Vite Documentation',
      url: 'https://vitejs.dev/',
      type: 'documentation',
      description: 'Next generation frontend tooling',
    },
    {
      id: 'js-res-005-typescript',
      title: 'TypeScript Documentation',
      url: 'https://www.typescriptlang.org/',
      type: 'documentation',
      description: 'JavaScript with syntax for types',
    },
  ],
  related_topics: [],
  challenges: [],
};

async function seedJavascriptContent() {
  try {
    const docRef = db.collection('languages').doc('javascript');
    await docRef.set(javascriptContent);
    console.log('JavaScript content seeded successfully!');
  } catch (error) {
    console.error('Error seeding JavaScript content:', error);
  } finally {
    process.exit(0);
  }
}

seedJavascriptContent();

export default javascriptContent;
