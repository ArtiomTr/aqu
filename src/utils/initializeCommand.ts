import { Command } from "commander";

import { TrwlCommand, TrwlCommandOptions } from "../commands/typings";
import type { VerifiedTrwlOptions } from "../typings";

export const initializeCommand = (
    program: Command,
    trwlCommand: TrwlCommand<unknown>,
    sharedOptions: Array<TrwlCommandOptions> = [],
    preload?: (options: Record<string, unknown>) => Promise<Array<VerifiedTrwlOptions>>
) => {
    const command = new Command(trwlCommand.name);
    command.description(trwlCommand.description).allowUnknownOption(true);

    [...trwlCommand.options, ...sharedOptions].forEach((commandOption) => {
        const option = command.createOption(
            `${commandOption.flag.short ? `-${commandOption.flag.short}, ` : ""}--${commandOption.flag.full} ${
                commandOption.flag.placeholder ? `<${commandOption.flag.placeholder}>` : ""
            }`,
            commandOption.description
        );

        if (commandOption.defaultValue) {
            option.default(commandOption.defaultValue);
        }

        if (commandOption.multiple) {
            option.argParser((value, previous: unknown[]) =>
                previous ? [...previous, ...value.split(",")] : value.split(",")
            );
        }

        command.addOption(option);
    });

    command.action(async (options) => {
        if (preload) {
            trwlCommand.action(options, await preload(options));
        } else {
            trwlCommand.action(options, []);
        }
    });

    program.addCommand(command);
};
