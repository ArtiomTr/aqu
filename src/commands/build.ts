import { resolve } from "path";

import uniq from "lodash/uniq";
import { startService } from "esbuild";
import rimraf from "rimraf";

import { TrwlCommand } from "./typings";
import { buildFromConfig } from "../buildFromConfig";
import logger, { ErrorLevel } from "../logger";

type BuildOptions = {};

const buildCommand: TrwlCommand<BuildOptions> = {
    name: "build",
    description: "Build project",
    options: [],
    action: async (options, config) => {
        const folders = uniq(config.map((value) => resolve(value.outdir)));

        await Promise.all(
            folders.map(
                (folder) =>
                    new Promise<void>((resolve) =>
                        rimraf(folder, (error) => {
                            if (error) {
                                logger.error(ErrorLevel.ERROR, error);
                            }
                            resolve();
                        })
                    )
            )
        );

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
