/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // changed from 'jest-environment-jsdom'

  roots: ['<rootDir>/src'],

  // Only run actual test files, not manual test scripts
  testMatch: [
    '**/__tests__/**/*.test.{ts,tsx,js,jsx}',
    '**/*.test.{ts,tsx,js,jsx}',
    '**/*.spec.{ts,tsx,js,jsx}'
  ],

  // Ignore manual test files, HTML files, and browser scripts
  testPathIgnorePatterns: [
    '/node_modules/',
    '\\.html$',
    'browser-.*\\.js$',
    'test-.*\\.js$',
    'verify-.*\\.js$',
    'debug-.*\\.js$',
    'final-.*\\.js$'
  ],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  globals: {
    'ts-jest': {
      tsconfig: {
        esModuleInterop: true,
      },
    },
  },

  setupFiles: ["<rootDir>/jest.setup.ts"],
};