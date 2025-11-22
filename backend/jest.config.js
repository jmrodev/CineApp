module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: [], // If you have any setup files that run before each test file
  globalTeardown: './jest.globalTeardown.js',
  testMatch: [
    "**/__tests__/**/*.js?(x)",
    "**/?(*.)+(spec|test).js?(x)"
  ],
  // Ensure tests run sequentially to avoid database conflicts
  // runInBand: true,
};
