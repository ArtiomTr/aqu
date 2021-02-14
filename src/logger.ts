import chalk from "chalk";

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
}

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
};

export default logger;
