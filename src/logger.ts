import chalk from "chalk";
import createProgressEstimator from "progress-estimator";

import { ensureFolder } from "./utils/ensureFolder";
import { PROGRESS_CACHE } from "./constants";
import { name } from "../package.json";

export enum ErrorLevel {
    FATAL,
    ERROR,
}

interface Logger {
    error(level: ErrorLevel.ERROR, ...parts: unknown[]): void;
    error(level: ErrorLevel.FATAL, ...parts: unknown[]): never;
    warn(...parts: unknown[]): void;
    info(...parts: unknown[]): void;
    progress<T>(promise: Promise<T>, label: string): Promise<T>;
}

let estimator: createProgressEstimator.ProgressEstimator | undefined = undefined;

const logger: Logger = {
    error: (level: ErrorLevel, ...args: unknown[]): never => {
        console.error(chalk.red(`[${name}]`, ...args));
        if (level === ErrorLevel.FATAL) {
            return process.exit(1);
        }
        return void 0 as never;
    },
    warn: (...args) => {
        console.warn(chalk.yellow(`[${name}] WARNING:`, ...args));
    },
    info: (...args) => {
        console.log(`[${name}]:`, ...args);
    },
    progress: async (promise, label) => {
        if (!estimator) {
            await ensureFolder(PROGRESS_CACHE);

            estimator = createProgressEstimator({
                storagePath: PROGRESS_CACHE,
            });
        }

        return estimator(promise, label);
    },
};

export default logger;
