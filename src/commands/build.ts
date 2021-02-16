import { startService } from "esbuild";

import { buildFromConfig } from "../build-utils/buildFromConfig";
import logger from "../logger";
import { commands } from "../messages.json";
import { TrwlCommand } from "../typings";
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
            logger.fatal(err);
        } finally {
            service.stop();
        }
    },
};

export default buildCommand;
