import { startService } from "esbuild";

import { TrwlCommand } from "./typings";
import { buildFromConfig } from "../build-utils/buildFromConfig";
import logger, { ErrorLevel } from "../logger";
import { commands } from "../messages.json";
import { deleteBuildDirs } from "../utils/deleteBuildDirs";

type BuildOptions = {};

const buildCommand: TrwlCommand<BuildOptions> = {
    name: "build",
    description: commands.build,
    options: [],
    action: async (options, config) => {
        await deleteBuildDirs(config);

        const service = await startService();

        try {
            await Promise.all(config.map((config) => buildFromConfig(config, service)));
        } catch (err) {
            logger.error(ErrorLevel.FATAL, err);
        } finally {
            service.stop();
        }
    },
};

export default buildCommand;
