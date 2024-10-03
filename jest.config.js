/** @type {import('jest').Config} */
const nextJest = require('next/jest');
const createJestConfig = nextJest({
  dir: './', // Next.js app directory
});

const customJestConfig = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Handle CSS modules
  },
};

module.exports = createJestConfig(customJestConfig);
