import { Config } from '@jest/types';

import { VerifiedAquOptions } from '../typings';
import { getInputDirs } from '../utils/getInputDirs';

/** Taken and modified from tsdx. @see https://github.com/formium/tsdx/blob/master/src/createJestConfig.ts */
export const createJestConfig = (
  configs: VerifiedAquOptions[],
): Partial<Config.InitialOptions> => ({
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|cjs|jsx)$'"],
  rootDir: process.cwd(),
  preset: 'ts-jest/presets/js-with-babel',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'cjs',
    'mjs',
    'json',
    'node',
  ],
  collectCoverageFrom: getInputDirs(configs).map(
    (dir) => `${dir}/**/*.{ts,tsx,js,jsx,cjs,mjs}`,
  ),
  testMatch: ['<rootDir>/**/*.(spec|test).{ts,tsx,js,jsx,cjs,mjs}'],
  testURL: 'http://localhost',
  watchPlugins: [
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname'),
  ],
});
