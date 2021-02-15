import { parse } from "path";

import uniq from "lodash/uniq";
import chalk from "chalk";
import chokidar, { WatchOptions as ChokidarWatchOptions } from "chokidar";
import { startService } from "esbuild";

import { TrwlCommand } from "./typings";
import { buildFromConfig } from "../buildFromConfig";
import logger, { ErrorLevel } from "../logger";
import { clearConsole } from "../utils/clearConsole";
import { deepMerge } from "../utils/deepMerge";
import { deleteBuildDirs } from "../utils/deleteBuildDirs";
import { gracefulShutdown } from "../utils/gracefulShutdown";

export type WatchOptions = {
    dir: string[];
    ignore: string[];
    Nosym: boolean;
};

export const watchCommand: TrwlCommand<WatchOptions> = {
    name: "watch",
    description: "Watch project",
    options: [
        {
            flag: {
                short: "d",
                full: "dir",
                placeholder: "path",
            },
            multiple: true,
            description: "specify custom watch dir.",
        },
        {
            flag: {
                full: "nosym",
            },
            description: "do not follow symlinks",
        },
        {
            flag: {
                short: "i",
                full: "ignore",
                placeholder: "path",
            },
            description: "ignore paths",
            multiple: true,
        },
    ],
    action: async (options, configs) => {
        await deleteBuildDirs(configs);

        const folders: string[] = [];

        if (options.dir) {
            folders.push(...options.dir);
        } else {
            configs.forEach(({ input }) => folders.push(...input.map((entry) => parse(entry).dir)));
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

        const watcher = chokidar.watch(uniq(folders), mergedWatchOptions);

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
                    console.log(chalk.cyan("\nCompilation started.\n"));

                    await Promise.all(configs.map((config) => buildFromConfig(config, service)));

                    clearConsole();

                    console.log("\n", chalk.bold.green("Successfully compiled!"), "\n");

                    console.log("⌚", chalk.gray("Waiting for changes..."), "\n");
                } catch (err) {
                    console.log("\n", chalk.bold.red("Errors during compilation"), "\n");
                    logger.error(ErrorLevel.ERROR, err);
                } finally {
                    isBuilding = false;
                }
            }
        });
    },
};
