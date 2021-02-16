import { Config as JestConfig } from "@jest/types";
import { run } from "jest";

import { createJestConfig } from "../config/createJestConfig";
import { loadAndResolveConfig } from "../config/loadAndResolveConfig";
import { CONFIG_EXTENSIONS } from "../constants";
import { commands } from "../messages.json";
import { TrwlCommand } from "../typings";
import { deepMerge } from "../utils/deepMerge";

const availableJestConfigNames = [
    ...CONFIG_EXTENSIONS.map((ext) => `jest.config.${ext}`),
    ...CONFIG_EXTENSIONS.map((ext) => `.jestrc.${ext}`),
    ".jestrc",
];

const testCommand: TrwlCommand<{}> = {
    name: "test",
    description: commands.test,
    options: [],
    allowUnknownOptions: true,
    action: async (_, configs, command) => {
        const defaultConfig = createJestConfig(configs);

        const jestConfigFiles = await loadAndResolveConfig<JestConfig.InitialOptions>({
            availableConfigNames: availableJestConfigNames,
            packageJsonProp: "jest",
        });

        const jestConfig = deepMerge(defaultConfig, ...configs.map((config) => config.jestOptions), ...jestConfigFiles);

        const argv = command.args;

        argv.push("--config", JSON.stringify(jestConfig));

        run(argv);
    },
};

export default testCommand;
