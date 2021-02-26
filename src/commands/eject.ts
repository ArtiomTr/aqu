import chalk from 'chalk';
import { prompt } from 'inquirer';

import { availableForEjectCommands } from '../constants';
import { ejectBuild } from '../eject-utils/ejectBuild';
import { ejectLint } from '../eject-utils/ejectLint';
import { ejectTest } from '../eject-utils/ejectTest';
import { ejectWatch } from '../eject-utils/ejectWatch';
import logger from '../logger';
import {
  cannotEject,
  commands,
  options,
  pickCommandToEject,
} from '../messages.json';
import { AquCommand } from '../typings';
import { insertArgs } from '../utils/insertArgs';

export type EjectOptions = {
  yes?: boolean;
};

const ejectCommand: AquCommand<EjectOptions> = {
  name: 'eject',
  description: commands.eject,
  options: [
    {
      flag: {
        full: 'yes',
        short: 'y',
      },
      description: options.yes,
    },
  ],
  action: async ({ yes }, configs, command) => {
    let commandToEject = command.args[0];

    if (!commandToEject) {
      const result = await prompt({
        name: 'target',
        type: 'list',
        message: pickCommandToEject,
        choices: availableForEjectCommands,
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
          insertArgs(cannotEject, {
            command: chalk.bold.red(commandToEject),
          }),
        );
    }
  },
};

export default ejectCommand;
