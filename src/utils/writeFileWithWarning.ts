import chalk from 'chalk';
import { prompt } from 'inquirer';

import { appResolve } from './appResolve';
import { canReadFile } from './canReadFile';
import { safeWriteFile } from './safeWriteFile';

export const writeFileWithWarning = async (
  filename: string,
  content: string,
  skipWarning?: boolean,
) => {
  const path = appResolve(filename);
  if (!skipWarning && (await canReadFile(path))) {
    const result = await prompt({
      name: 'continue',
      message: `File ${chalk.bold.cyan(
        filename,
      )} already exists. Do you want to override it?`,
      type: 'confirm',
    });

    if (!result.continue) {
      process.exit(0);
    }
  }

  await safeWriteFile(path, content);
};
