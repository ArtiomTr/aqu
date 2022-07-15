import { resolve } from 'path';

import execa from 'execa';
import { pathExists } from 'fs-extra';

import { getPackageManager } from '../utils/packageManager';

export const installDependencies = async (name: string) => {
	await execa(await getPackageManager(), ['install'], {
		cwd: resolve(process.cwd(), name),
	});

	const exampleFolder = resolve(process.cwd(), name, 'example');

	if (await pathExists(exampleFolder)) {
		await execa(await getPackageManager(), ['install'], {
			cwd: exampleFolder,
		});
	}
};
