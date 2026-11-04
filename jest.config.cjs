module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  transform: {},
  collectCoverageFrom: [
    'modules/store.js',
    'modules/ui.js',
    'modules/analytics.js',
    'modules/csv.js',
    'app.js',
    '!**/node_modules/**',
  ],
};
