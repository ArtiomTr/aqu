import { Command } from 'commander';

import buildCommand from './commands/build';
import createCommand from './commands/create';
import lintCommand from './commands/lint';
import testCommand from './commands/test';
import { watchCommand } from './commands/watch';
import { loadConfigFromArguments } from './config/loadConfigFromArguments';
import { initializeCommand } from './utils/initializeCommand';
import { options } from './messages.json';
import { AquCommand, AquCommandOptions } from './typings';
import { description, name, version } from '../package.json';

const main = async () => {
  const program = new Command(name).description(description).version(version);

  const sharedOptions: Array<AquCommandOptions> = [
    {
      flag: {
        full: 'config',
        short: 'c',
        placeholder: 'path',
      },
      description: options.config,
    },
  ];
  const commandsRequiringConfig = [
    buildCommand,
    watchCommand,
    testCommand,
    lintCommand,
  ];
  const commandsWithoutConfig = [createCommand];

  commandsRequiringConfig.forEach((command) =>
    initializeCommand(
      program as Command,
      command as AquCommand<unknown>,
      sharedOptions,
      loadConfigFromArguments,
    ),
  );

  commandsWithoutConfig.forEach((command) =>
    initializeCommand(program as Command, command as AquCommand<unknown>),
  );

  program.parse(process.argv);
};

main();
