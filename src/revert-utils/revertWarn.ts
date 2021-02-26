import chalk from 'chalk';
import { prompt } from 'inquirer';

export const revertWarn = async (
  command: string,
  packageScript: string,
  files: string[],
): Promise<boolean> => {
  const result = await prompt({
    type: 'confirm',
    message: `Reverting ${chalk.bold.cyan(command)} will revert ${chalk.yellow(
      packageScript,
    )} script in package.json and delete these files: ${chalk.yellow(
      files.join(', '),
    )}. Continue?`,
    name: 'confirm',
  });

  return result.confirm;
};
