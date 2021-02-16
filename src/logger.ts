import chalk from "chalk";
import ora from "ora";

import { timeFrom } from "./utils/timeFrom";
import { name } from "../package.json";

export enum ErrorLevel {
    FATAL,
    ERROR,
}

export class Progress {
    private spinner;
    private beginPoint;

    public constructor(private readonly label: string) {
        this.spinner = ora(this.label).start();
        this.beginPoint = new Date();
    }

    stop() {
        this.spinner.succeed(this.label + " " + chalk.gray(timeFrom(this.beginPoint)));
    }
}

export interface Logger {
    error(level: ErrorLevel.ERROR, ...parts: unknown[]): void;
    error(level: ErrorLevel.FATAL, ...parts: unknown[]): never;
    warn(...parts: unknown[]): void;
    info(...parts: unknown[]): void;
    success(...parts: unknown[]): void;
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
        console.warn(chalk.yellow(`[${name}] WARNING:`), ...args);
    },
    info: (...args) => {
        console.log(chalk.gray(`[${name}]:`), ...args);
    },
    success: (...args) => {
        console.log(chalk.green(`[${name}]:`, ...args));
    },
};

export default logger;
