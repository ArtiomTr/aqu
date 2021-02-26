import chalk from 'chalk';
import { prompt } from 'inquirer';

import { ejectBuild } from '../eject-utils/ejectBuild';
import { ejectLint } from '../eject-utils/ejectLint';
import { ejectTest } from '../eject-utils/ejectTest';
import { ejectWatch } from '../eject-utils/ejectWatch';
import logger from '../logger';
import { AquCommand } from '../typings';

export type EjectOptions = {
  yes?: boolean;
};

const availableCommands = ['build', 'watch', 'lint', 'test'];

const ejectCommand: AquCommand<EjectOptions> = {
  name: 'eject',
  description: '',
  options: [
    {
      flag: {
        full: 'yes',
        short: 'y',
      },
      description: 'Yes to all',
    },
  ],
  action: async ({ yes }, configs, command) => {
    let commandToEject = command.args[0];

    if (!commandToEject) {
      const result = await prompt({
        name: 'target',
        type: 'list',
        message: 'Which command to eject?',
        choices: availableCommands,
      });
      commandToEject = result.target;
    }

    switch (commandToEject) {
      case 'lint':
        await ejectLint(yes);
        break;
      case 'test':
        await ejectTest(configs, yes);
        break;
      case 'build':
        await ejectBuild(configs, yes);
        break;
      case 'watch':
        await ejectWatch(configs, yes);
        break;
      default:
        logger.fatal(
          `Command ${chalk.bold.red(
            commandToEject,
          )} is not available for eject.`,
        );
    }
  },
};

export default ejectCommand;
