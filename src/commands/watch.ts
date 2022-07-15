import chalk from 'chalk';
import chokidar, { WatchOptions as ChokidarWatchOptions } from 'chokidar';

import { buildFromConfig } from '../build-utils/buildFromConfig';
import logger from '../logger';
import {
    commands,
    compilationFailed,
    compilationStart,
    compilationSuccess,
    options,
    watchIdle,
} from '../messages.json';
import { AquCommand } from '../typings';
import { clearConsole } from '../utils/clearConsole';
import { deepMerge } from '../utils/deepMerge';
import { deleteBuildDirs } from '../utils/deleteBuildDirs';
import { getInputDirs } from '../utils/getInputDirs';
import { gracefulShutdown } from '../utils/gracefulShutdown';

export type WatchOptions = {
    watchdir: string[];
    ignore: string[];
    Nosym: boolean;
    NoCleanup: boolean;
};

export const watchCommand: AquCommand<WatchOptions> = {
    name: 'watch',
    description: commands.watch,
    options: [
        {
            flag: {
                short: 'wd',
                full: 'watchdir',
                placeholder: 'path',
            },
            multiple: true,
            description: options.watchdir,
        },
        {
            flag: {
                full: 'nosym',
            },
            description: options.nosym,
        },
        {
            flag: {
                short: 'i',
                full: 'ignore',
                placeholder: 'path',
            },
            description: options.ignore,
            multiple: true,
        },
        {
            flag: {
                full: 'no-cleanup',
            },
            description: options.noCleanup,
        },
    ],
    action: async (options, configs) => {
        if (!options.NoCleanup) {
            await deleteBuildDirs(configs);
        }
        let dirs: string[] = [];

        if (options.watchdir) {
            dirs = options.watchdir;
        } else {
            dirs = getInputDirs(configs);
        }

        const mergedWatchOptions = deepMerge<ChokidarWatchOptions>(
            [
                {
                    followSymlinks: options.Nosym,
                    ignored: options.ignore,
                },
                ...configs.map((config) => config.watchOptions),
            ].filter(Boolean),
        );

        const watcher = chokidar.watch(dirs, mergedWatchOptions);

        gracefulShutdown(() => {
            watcher.close();
        });

        let isBuilding = false;

        watcher.on('all', async () => {
            if (!isBuilding) {
                isBuilding = true;

                clearConsole();

                try {
                    console.log('\n', chalk.cyan(compilationStart), '\n');

                    await Promise.all(configs.map((config) => buildFromConfig(config)));

                    clearConsole();

                    console.log('\n', chalk.bold.green(compilationSuccess), '\n');

                    console.log(chalk.gray(watchIdle), '\n');
                } catch (err) {
                    console.log('\n', chalk.bold.red(compilationFailed), '\n');
                    logger.error(err);
                } finally {
                    isBuilding = false;
                }
            }
        });
    },
};
