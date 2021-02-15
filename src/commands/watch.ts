import chalk from "chalk";
import chokidar, { WatchOptions as ChokidarWatchOptions } from "chokidar";
import { startService } from "esbuild";

import { buildFromConfig } from "../build-utils/buildFromConfig";
import logger, { ErrorLevel } from "../logger";
import {
    commands,
    compilationFailed,
    compilationStart,
    compilationSuccess,
    options,
    watchIdle,
} from "../messages.json";
import { TrwlCommand } from "../typings";
import { clearConsole } from "../utils/clearConsole";
import { deepMerge } from "../utils/deepMerge";
import { deleteBuildDirs } from "../utils/deleteBuildDirs";
import { getInputDirs } from "../utils/getInputDirs";
import { gracefulShutdown } from "../utils/gracefulShutdown";

export type WatchOptions = {
    watchdir: string[];
    ignore: string[];
    Nosym: boolean;
};

export const watchCommand: TrwlCommand<WatchOptions> = {
    name: "watch",
    description: commands.watch,
    options: [
        {
            flag: {
                short: "wd",
                full: "watchdir",
                placeholder: "path",
            },
            multiple: true,
            description: options.watchdir,
        },
        {
            flag: {
                full: "nosym",
            },
            description: options.nosym,
        },
        {
            flag: {
                short: "i",
                full: "ignore",
                placeholder: "path",
            },
            description: options.ignore,
            multiple: true,
        },
    ],
    action: async (options, configs) => {
        await deleteBuildDirs(configs);

        let dirs: string[] = [];

        if (options.watchdir) {
            dirs = options.watchdir;
        } else {
            dirs = getInputDirs(configs);
        }

        const service = await startService();

        const mergedWatchOptions = deepMerge<ChokidarWatchOptions>(
            [
                {
                    followSymlinks: options.Nosym,
                    ignored: options.ignore,
                },
                ...configs.map((config) => config.watchOptions),
            ].filter(Boolean)
        );

        const watcher = chokidar.watch(dirs, mergedWatchOptions);

        gracefulShutdown(() => {
            service.stop();
            watcher.close();
        });

        let isBuilding = false;

        watcher.on("all", async () => {
            if (!isBuilding) {
                isBuilding = true;

                clearConsole();

                try {
                    console.log("\n", chalk.cyan(compilationStart), "\n");

                    await Promise.all(configs.map((config) => buildFromConfig(config, service)));

                    clearConsole();

                    console.log("\n", chalk.bold.green(compilationSuccess), "\n");

                    console.log(chalk.gray(watchIdle), "\n");
                } catch (err) {
                    console.log("\n", chalk.bold.red(compilationFailed), "\n");
                    logger.error(ErrorLevel.ERROR, err);
                } finally {
                    isBuilding = false;
                }
            }
        });
    },
};
