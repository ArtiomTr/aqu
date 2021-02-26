import chalk from 'chalk';
import { prompt } from 'inquirer';

import logger from '../logger';
import { revertBuild } from '../revert-utils/revertBuild';
import { revertLint } from '../revert-utils/revertLint';
import { revertTest } from '../revert-utils/revertTest';
import { revertWatch } from '../revert-utils/revertWatch';
import { AquCommand } from '../typings';

type RevertOptions = {
  yes?: boolean;
};

const availableCommands = ['build', 'watch', 'lint', 'test'];

const revertCommand: AquCommand<RevertOptions> = {
  name: 'revert',
  description: '',
  options: [
    {
      flag: {
        full: 'yes',
        short: 'y',
      },
      description: 'Skip all',
    },
  ],
  action: async ({ yes }, configs, command) => {
    let commandToRevert = command.args[0];

    if (!commandToRevert) {
      const result = await prompt({
        name: 'target',
        type: 'list',
        message: 'Which command to revert?',
        choices: availableCommands,
      });
      commandToRevert = result.target;
    }

    switch (commandToRevert) {
      case 'test':
        await revertTest(yes);
        break;
      case 'lint':
        await revertLint(yes);
        break;
      case 'build':
        await revertBuild(yes);
        break;
      case 'watch':
        await revertWatch(yes);
        break;
      default:
        logger.fatal(
          `Cannot revert ${chalk.bold.red(commandToRevert)} command.`,
        );
    }
  },
};

export default revertCommand;
