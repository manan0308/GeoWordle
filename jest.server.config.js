module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/server'],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'server/**/*.js',
    '!server/**/*.test.js',
  ],
  coverageDirectory: 'coverage/server',
  verbose: true,
};
