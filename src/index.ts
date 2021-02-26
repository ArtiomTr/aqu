import { Command } from 'commander';

import buildCommand from './commands/build';
import createCommand from './commands/create';
import ejectCommand from './commands/eject';
import lintCommand from './commands/lint';
import revertCommand from './commands/revert';
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
    {
      flag: {
        full: 'name',
        short: 'n',
        placeholder: 'name',
      },
      description: options.name,
    },
    {
      flag: {
        full: 'input',
        short: 'i',
        placeholder: 'paths',
      },
      description: options.input,
      multiple: true,
    },
    {
      flag: {
        full: 'outdir',
        short: 'oD',
        placeholder: 'path',
      },
      description: options.outdir,
    },
    {
      flag: {
        full: 'outfile',
        short: 'oF',
        placeholder: 'path',
      },
      description: options.outfile,
    },
    {
      flag: {
        full: 'format',
        short: 'fmt',
        placeholder: 'types',
      },
      description: options.format,
      multiple: true,
    },
    {
      flag: {
        full: 'cjsMode',
        short: 'cM',
        placeholder: 'mode',
      },
      description: options.cjsMode,
    },
    {
      flag: {
        full: 'declaration',
        short: 'dts',
        placeholder: 'mode',
      },
      description: options.declaration,
    },
    {
      flag: {
        full: 'tsconfig',
        short: 'tC',
        placeholder: 'path',
      },
      description: options.tsconfig,
    },
    {
      flag: {
        full: 'incremental',
        short: 'inc',
      },
      description: options.incremental,
    },
    {
      flag: {
        full: 'noExternal',
        short: 'nE',
      },
      description: options.noExternal,
    },
  ];
  const commandsRequiringConfig = [
    buildCommand,
    watchCommand,
    testCommand,
    lintCommand,
    ejectCommand,
    revertCommand,
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
