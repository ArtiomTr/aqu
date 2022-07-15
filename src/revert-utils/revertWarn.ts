import chalk from 'chalk';
import { prompt } from 'inquirer';

import { revertWarning } from '../messages.json';
import { insertArgs } from '../utils/insertArgs';

export const revertWarn = async (command: string, packageScript: string, files: string[]): Promise<boolean> => {
	const result = await prompt({
		type: 'confirm',
		message: insertArgs(revertWarning, {
			script: chalk.bold.cyan(command),
			packageScript: chalk.yellow(packageScript),
			files: chalk.yellow(files.join(', ')),
		}),
		name: 'confirm',
	});

	return result.confirm;
};
