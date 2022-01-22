export const runWithESBuildBinaryContext = async <T>(run: () => Promise<T>) => {
  // TODO: maybe fix this
  // const automaticSearch = platform() === 'win32';

  // if (automaticSearch) {
  //   let binaryPath: string | undefined = undefined;

  //   try {
  //     const testBinaryPath = resolve(
  //       __dirname,
  //       '..',
  //       '..',
  //       'esbuild',
  //       'bin',
  //       'esbuild',
  //     );

  //     await access(testBinaryPath);

  //     binaryPath = testBinaryPath;
  //   } catch {
  //     /** do nothing */
  //   }

  //   try {
  //     const testBinaryPath = resolve(
  //       __dirname,
  //       '..',
  //       'node_modules',
  //       'esbuild',
  //       'bin',
  //       'esbuild',
  //     );

  //     await access(testBinaryPath);

  //     binaryPath = testBinaryPath;
  //   } catch {
  //     /** do nothing */
  //   }

  //   if (!binaryPath) {
  //     logger.fatal('No binary for esbuild found');
  //   }

  //   const previousPath = process.env.ESBUILD_BINARY_PATH;

  //   const cleanup = gracefulShutdown(() => {
  //     process.env.ESBUILD_BINARY_PATH = previousPath;
  //   });

  //   process.env.ESBUILD_BINARY_PATH = binaryPath;

  //   const result = await run();

  //   process.env.ESBUILD_BINARY_PATH = previousPath;

  //   cleanup();

  //   return result;
  // } else {
  return await run();
  // }
};
