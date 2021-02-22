import chalk from 'chalk';

import { skipped } from '../messages.json';

export const showSkippedStep = (label: string) =>
  console.log(chalk.yellow('↓'), label, chalk.gray(skipped));
