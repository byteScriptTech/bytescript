# byteScript

bytescript.tech is a platform for developers who are passionate about learning programming, starting with JavaScript and soon expanding to TypeScript and Python. Whether you're just beginning or looking to sharpen your skills, we've designed the platform to guide you through a step-by-step journey. Each concept is presented with real-life examples, practical best practices, and lessons from common mistakes—so you can learn from others' experiences. You’ll also find an interactive code editor right in your browser, so you can practice and experiment without needing extra tools. Plus, with our wide range of coding challenges and a personalized dashboard to track your progress, you’ll stay motivated as you grow your skills and become a more confident programmer.

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
│ ├── app/
│ │ ├── dashboard/
│ │ └── login/
│ ├── components/
│ ├── pages/
│ ├── styles/
│ └── tests/
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
