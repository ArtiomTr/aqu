import { platform } from 'os';
import { resolve } from 'path';

import { access } from 'fs-extra';

import { gracefulShutdown } from './gracefulShutdown';
import logger from '../logger';

export const runWithESBuildBinaryContext = async <T>(run: () => Promise<T>) => {
  const automaticSearch = platform() === 'win32';

  if (automaticSearch) {
    let binaryPath: string | undefined = undefined;

    try {
      const testBinaryPath = resolve(
        __dirname,
        '..',
        '..',
        'esbuild',
        'esbuild.exe',
      );

      await access(testBinaryPath);

      binaryPath = testBinaryPath;
    } catch {
      /** do nothing */
    }

    try {
      const testBinaryPath = resolve(
        __dirname,
        '..',
        'node_modules',
        'esbuild',
        'esbuild.exe',
      );

      await access(testBinaryPath);

      binaryPath = testBinaryPath;
    } catch {
      /** do nothing */
    }

    if (!binaryPath) {
      logger.fatal('No binary for esbuild found');
    }

    const previousPath = process.env.ESBUILD_BINARY_PATH;

    const cleanup = gracefulShutdown(() => {
      process.env.ESBUILD_BINARY_PATH = previousPath;
    });

    process.env.ESBUILD_BINARY_PATH = binaryPath;

    const result = await run();

    process.env.ESBUILD_BINARY_PATH = previousPath;

    cleanup();

    return result;
  } else {
    return await run();
  }
};
