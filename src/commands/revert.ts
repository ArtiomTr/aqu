import chalk from 'chalk';
import { prompt } from 'inquirer';

import { availableForEjectCommands } from '../constants';
import logger from '../logger';
import { cannotRevert, commands, options, pickCommandToRevert } from '../messages.json';
import { revertBuild } from '../revert-utils/revertBuild';
import { revertLint } from '../revert-utils/revertLint';
import { revertTest } from '../revert-utils/revertTest';
import { revertWatch } from '../revert-utils/revertWatch';
import { AquCommand } from '../typings';
import { insertArgs } from '../utils/insertArgs';

type RevertOptions = {
    yes?: boolean;
};

const revertCommand: AquCommand<RevertOptions> = {
    name: 'revert',
    description: commands.revert,
    options: [
        {
            flag: {
                full: 'yes',
                short: 'y',
            },
            description: options.yes,
        },
    ],
    action: async ({ yes }, _, command) => {
        let commandToRevert = command.args[0];

        if (!commandToRevert) {
            const result = await prompt({
                name: 'target',
                type: 'list',
                message: pickCommandToRevert,
                choices: availableForEjectCommands,
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
                    insertArgs(cannotRevert, {
                        command: chalk.bold.red(commandToRevert),
                    }),
                );
        }
    },
};

export default revertCommand;
