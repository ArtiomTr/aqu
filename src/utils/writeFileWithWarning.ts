import chalk from 'chalk';
import { prompt } from 'inquirer';

import { appResolve } from './appResolve';
import { canReadFile } from './canReadFile';
import { insertArgs } from './insertArgs';
import { safeWriteFile } from './safeWriteFile';
import { fileExistsWarning } from '../messages.json';

export const writeFileWithWarning = async (filename: string, content: string, skipWarning?: boolean) => {
	const path = appResolve(filename);
	if (!skipWarning && (await canReadFile(path))) {
		const result = await prompt({
			name: 'continue',
			message: insertArgs(fileExistsWarning, {
				path: chalk.bold.yellow(filename),
			}),
			type: 'confirm',
		});

		if (!result.continue) {
			process.exit(0);
		}
	}

	await safeWriteFile(path, content);
};
