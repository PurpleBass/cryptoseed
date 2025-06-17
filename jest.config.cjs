/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // changed from 'jest-environment-jsdom'

  roots: ['<rootDir>/src'],

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