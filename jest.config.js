/** @type {import('jest').Config} */
const nextJest = require('next/jest');
const createJestConfig = nextJest({
  dir: './', // Next.js app directory
});

const customJestConfig = {
  preset: 'ts-jest', // Use ts-jest preset
  testEnvironment: 'jsdom', // Set the test environment to jsdom for testing React components
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Optional: set up testing library configurations
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Handle CSS modules
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@firebase)', // Transform @firebase module to support ES modules
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Use ts-jest for TypeScript files
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/.next/'],
};

module.exports = createJestConfig(customJestConfig);
