# Bytescript

Bytescript is a learning and practice platform for competitive programming, data structures, and JavaScript development — with interactive visualizations, collaborative peer-programming, and an AI assistant to help you learn and solve problems faster.

## Key Features (priority-ordered)

- **Competitive Programming Patterns:** Practice curated patterns and templates that most contest problems fall into. Each pattern includes explanations, common pitfalls, and typical problem variations.
- **Problem Solving Questions:** A large catalog of practice problems with difficulty tags, editorial solutions, and testcases for hands-on solving.
- **Data Structures Learning + Visualizations:** Learn core data structures with interactive visualizations, step-through animations, and related practice problems that reinforce concepts.
- **Comprehensive JavaScript Learning:** A full learning path for JavaScript — from fundamentals to advanced topics — with reading material, examples, and exercises for every topic.
- **Peer-Programming (Real-time):** Code collaboratively with friends or teammates using the peer-programming feature. Includes group voice calls so participants can talk while coding together.
- **AI Assistant:** An integrated AI helper to assist with problem-solving, explain concepts, suggest hints, and improve learning workflows.

## Technical specification

- **Frontend:** Next.js + React + TypeScript. Uses Tailwind CSS for styling and modern components for the learning UI and editor.
- **Editor & Collaboration:** Embedded code editor (Monaco/CodeMirror style) with real-time synchronization for peer-programming. Real-time communication powered by WebSockets (or similar real-time layer) and in-app group voice via a WebRTC-based solution.
- **Backend & Services:** Split across three cooperating services:
  - **Firebase:** Auth, Firestore, and lightweight serverless functions for user data, configuration, and realtime metadata.
  - **bytescript-rtc (Node.js):** Real-time collaboration and signaling service for editor sync, WebSocket/RTM handling, and WebRTC voice/group-call signaling.
  - **bytescript-ai (Python):** AI assistant backend that manages LLM requests, prompt orchestration, caching, and policy/rate controls.
  - Admin utilities for seeding content, curating problems, and managing learning material across services.
- **Code Execution & Sandboxing:** Dedicated execution services for JavaScript, Python, and other runtimes (isolated sandboxes) to run and test user code safely.
- **AI Integration:** Secure API integration with a configurable LLM service to power the AI assistant, subject to privacy and rate limits.
- **Testing & CI:** Jest for unit and integration tests. CI pipeline for linting, tests, and builds.
- **Security & Privacy:** Authentication, role-based access for admin content, and safeguards on executing user-submitted code. Follow best practices for secrets and tokens (never commit them to the repo).

## Architecture overview

- Client (Next.js) handles UI, visualizations, editor, and real-time collaboration UI.
- Backend services serve problem data, run code in sandboxes, and handle analytics and progress tracking.
- Real-time layer (WebSocket/RTM) coordinates collaborative editing and voice session signaling.
- AI assistant sits behind an API gateway with request/response logging and rate limiting.

## Local development

Install dependencies and run the app locally:

```bash
npm install
npm run dev
```

Run tests:

```bash
npm run test
```

Adjust environment variables (Firebase, AI keys, sandbox endpoints) via local `.env` following the project docs.

## Content & Contributions

- Contribution workflow: Fork → branch → PR with clear description and tests where relevant.
- Report bugs or request features via the repository Issues.
- Maintain clear editorial guidelines for problems and learning content (format, testcases, solutions, tags).
- Suggest creating `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md` if not present.

## Collaboration and community

- Open for contributions: code, problem sets, editors, and localization.
- Invite educators and competitive programmers to curate patterns and canonical solutions.
- Potential collaboration areas: creating official learning tracks, adding more language runtimes for the sandbox, improving AI-assisted tutoring, and accessibility/UX improvements for visualizations.

## Roadmap (suggested)

- Expand pattern library and canonical explanations.
- Add more language runtimes and richer sandbox metrics.
- Improve AI assistant capabilities (code critique, automated hint generation, plagiarism-aware feedback).
- Add analytics dashboards for learners and educators.

## License

See the repository license. If none, consider adding an OSI-approved license (MIT/Apache-2.0) and a `CONTRIBUTING.md`.

---

If you'd like, I can: add a `CONTRIBUTING.md`, generate a short `CODE_OF_CONDUCT.md`, or update docs to include environment variable templates and run scripts.

## Features

- **Interactive Code Editor**: Write and execute JavaScript directly in your browser
- **Real-time Execution**: See results immediately with our browser-based runtime
- **Safe Sandbox**: All code runs securely in your browser with no server-side execution
- **Console Output**: View `console.log` and other console methods in real-time
- **Error Handling**: Get clear error messages for syntax and runtime errors
- **Execution Time**: See how long your code takes to run
- Next.js 14 for modern web development
- TypeScript for static type checking
- Docker for local development and containerization
- ESLint and Prettier for code linting and formatting
- Jest for unit and integration testing
- Environment configuration using .env files
- Deployed to Vercel for production
- Firebase authentication for user login and registration

## Project Structure

```bash
.
├── .dockerignore
├── .eslintrc.json
├── .gitignore
├── .env.local
├── Dockerfile.dev
├── docker-compose.yml
├── jest.config.js
├── next.config.js
├── package.json
├── src/
│  ├── app/
│  │  ├── admin/
│  │  │  ├── dsa/
│  │  │  ├── javascript/
│  │  │  ├── nodejs/
│  │  │  ├── python/
│  │  │  └── problems/
│  │  ├── competitive-programming/
│  │  │  ├── patterns/
│  │  │  └── problems/
│  │  ├── dashboard/
│  │  ├── editor/
│  │  ├── interview/
│  │  ├── learn/
│  │  │  ├── data-structures/
│  │  │  ├── javascript/
│  │  │  ├── nodejs/
│  │  │  └── python/
│  │  ├── practice/
│  │  ├── peer-programming/
│  │  ├── customtest/
│  │  ├── community/
│  │  ├── settings/
│  │  ├── login/
│  │  └── globals.css
│  ├── components/
│  ├── context/
│  ├── services/
│  ├── lib/
│  ├── pages/    # (if present) legacy/Next.js pages
│  └── styles/
└── tsconfig.json
```

## Requirements

Node.js (version 18.x or higher)
Docker (for containerized development)
Firebase (for authentication)
Setup

## Clone the repository:

```bash
git clone https://github.com/yourusername/bytescript.tech.git
cd bytescript.tech
```

Install dependencies:

If you're not using Docker, you can install dependencies locally:

```bash
npm install
```

## Set up environment variables:

Create a .env.local file in the root directory to store environment variables such as Firebase keys. Here’s a sample:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
```

## Start the development server:

Running the Project with Docker
You can run the app locally using Docker with a pre-configured Docker Compose setup.

Build and start the app in development mode:

```bash
docker-compose up --build
```

This will start the app using the Dockerfile.dev configuration on port 3000.

### Stopping the Docker containers:

When you're done, you can stop the containers with:

```bash
docker-compose down
```

### If you want to run the project locally without Docker:

```bash
npm run dev
```

This will start the development server on `http://localhost:3000`

## Testing

We have implemented Jest for testing. You can run the test suite with the following command:

```bash
npm test
```

This will run all unit and integration tests located in the src/tests directory.

## Building for Production

To build the project for production, you can use the following command:

```bash
 npm run build
```

This will generate an optimized build of the application in the .next directory.

## Linting and Formatting

We have configured ESLint and Prettier for maintaining code quality.

### To lint your code:

```bash
npm run lint
```

To format your code:

```bash
npm run format
```

Contributing
Feel free to contribute to this project. You can open an issue or submit a pull request. Make sure to follow the code of conduct and use meaningful commit messages.

License
This project is licensed under the MIT License.
