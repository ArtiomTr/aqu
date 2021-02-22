import { Command } from 'commander';

import { AquCommand, AquCommandOptions, VerifiedAquOptions } from '../typings';

export const initializeCommand = (
  program: Command,
  aquCommand: AquCommand<unknown>,
  sharedOptions: Array<AquCommandOptions> = [],
  preload?: (
    options: Record<string, unknown>,
  ) => Promise<Array<VerifiedAquOptions>>,
) => {
  const command = new Command(aquCommand.name);
  command.description(aquCommand.description);

  if (aquCommand.allowUnknownOptions) {
    command.allowUnknownOption(true);
  }

  [...aquCommand.options, ...sharedOptions].forEach((commandOption) => {
    const option = command.createOption(
      `${commandOption.flag.short ? `-${commandOption.flag.short}, ` : ''}--${
        commandOption.flag.full
      } ${
        commandOption.flag.placeholder
          ? `<${commandOption.flag.placeholder}>`
          : ''
      }`,
      commandOption.description,
    );

    if (commandOption.defaultValue) {
      option.default(commandOption.defaultValue);
    }

    if (commandOption.multiple) {
      option.argParser((value, previous: unknown[]) =>
        previous ? [...previous, value] : [value],
      );
    }

    command.addOption(option);
  });

  command.action(async (options, command) => {
    if (preload) {
      aquCommand.action(options, await preload(options), command);
    } else {
      aquCommand.action(options, [], command);
    }
  });

  program.addCommand(command);
};
