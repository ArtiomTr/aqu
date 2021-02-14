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
    command.description(trwlCommand.description);

    [...trwlCommand.options, ...sharedOptions].forEach((commandOption) =>
        command.option(
            `-${commandOption.flag.short}, --${commandOption.flag.full} ${
                commandOption.flag.placeholder ? `<${commandOption.flag.placeholder}>` : ""
            }`,
            commandOption.description,
            commandOption.defaultValue
        )
    );

    command.action(async (options) => {
        if (preload) {
            trwlCommand.action(options, await preload(options));
        } else {
            trwlCommand.action(options, []);
        }
    });

    program.addCommand(command);
};
