import { Config as JestConfig } from "@jest/types";
import { run } from "jest";

import { TrwlCommand } from "./typings";
import { createJestConfig } from "../config/createJestConfig";
import { loadAndResolveConfig } from "../config/loadAndResolveConfig";
import { CONFIG_EXTENSIONS } from "../constants";
import { deepMerge } from "../utils/deepMerge";
import { getRestArgv } from "../utils/getRestArgv";

const availableJestConfigNames = [
    ...CONFIG_EXTENSIONS.map((ext) => `jest.config.${ext}`),
    ...CONFIG_EXTENSIONS.map((ext) => `.jestrc.${ext}`),
    ".jestrc",
];

const testCommand: TrwlCommand<{}> = {
    name: "test",
    description: "Run jest",
    options: [],
    action: async (_, configs) => {
        const defaultConfig = createJestConfig(configs);

        const jestConfigFiles = await loadAndResolveConfig<JestConfig.InitialOptions>({
            availableConfigNames: availableJestConfigNames,
            packageJsonProp: "jest",
        });

        const jestConfig = deepMerge(defaultConfig, ...jestConfigFiles);

        const argv = getRestArgv();

        argv.push("--config", JSON.stringify(jestConfig));

        run(argv);
    },
};

export default testCommand;
