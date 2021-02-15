import { Command } from "commander";

import buildCommand from "./commands/build";
import { TrwlCommand, TrwlCommandOptions } from "./commands/typings";
import { watchCommand } from "./commands/watch";
import { loadConfigFromArguments } from "./config/loadConfigFromArguments";
import { initializeCommand } from "./utils/initializeCommand";
import { description, name, version } from "../package.json";

const main = async () => {
    const program = new Command(name).description(description).version(version);

    const sharedOptions: Array<TrwlCommandOptions> = [
        {
            flag: {
                full: "config",
                short: "c",
                placeholder: "path",
            },
            description: "path to configuration",
        },
    ];
    const commandsRequiringConfig = [buildCommand, watchCommand];

    commandsRequiringConfig.forEach((command) =>
        initializeCommand(program as Command, command as TrwlCommand<unknown>, sharedOptions, loadConfigFromArguments)
    );

    program.parse(process.argv);
};

main();
