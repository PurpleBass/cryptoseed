/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  roots: ['<rootDir>/src'],
  testMatch: [
    '**/src/__tests__/**/*.test.ts'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    'encryptionWasmOnly\\.test\\.ts$', // Exclude pure WASM tests (can't mock properly in Node.js)
    'encryptionV3\\.test\\.ts$', // Exclude V3 processing tests (use WASM-only import)
    'browser-.*\\.js$' // Exclude browser test scripts
  ],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
      },
    }],
  },

  setupFiles: ["<rootDir>/jest.setup.ts"],
};
