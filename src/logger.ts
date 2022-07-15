import chalk from 'chalk';
import ora from 'ora';

import { timeFrom } from './utils/timeFrom';
import { name } from '../package.json';

export class Progress {
	private spinner;
	private beginPoint;

	public constructor(private readonly label: string) {
		this.spinner = ora(this.label).start();
		this.beginPoint = new Date();
	}

	succeed(label: string = this.label) {
		this.spinner.succeed(label + ' ' + chalk.gray(timeFrom(this.beginPoint)));
	}

	fail(label: string = this.label) {
		this.spinner.fail(label + ' ' + chalk.gray('failed'));
	}
}

export interface Logger {
	error(...parts: unknown[]): void;
	fatal(...parts: unknown[]): never;
	warn(...parts: unknown[]): void;
	info(...parts: unknown[]): void;
	success(...parts: unknown[]): void;
}

const logger: Logger = {
	error: (...args: unknown[]) => {
		console.error(chalk.red(`[${name}]`, ...args));
	},
	fatal: (...args: unknown[]) => {
		logger.error(...args);
		process.exit(1);
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
