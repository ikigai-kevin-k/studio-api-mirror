/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['**/*.(t|j)s'],

  // The directory where Jest should output its coverage files
  coverageDirectory: '<rootDir>/../coverage',

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'index.ts',
    '<rootDir>/app.ts',
    '<rootDir>/db/migrations/',
    '.*\\.module\\.ts$',
    '.*\\.enum\\.ts$',
    '.*\\.dto\\.ts$',
    '.*\\.interface\\.ts$',
    '.*\\.types\\.ts$',
    '.*\\.entity\\.ts$',
    '.*\\mod\\.ts$',
  ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'babel',

  // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    global: {
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: ['node_modules', '<rootDir>/..'],

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'ts', 'node'],

  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',

  // The root directory that Jest should scan for tests and modules within
  rootDir: 'src',

  // The regexp pattern or array of patterns that Jest uses to detect test files
  testRegex: ['.*\\.spec\\.ts$'],
};

export default config;
