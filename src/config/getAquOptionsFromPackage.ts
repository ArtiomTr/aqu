import { readFile } from 'fs';

import logger from '../logger';
import { packageNotFound } from '../messages.json';
import { AquOptions } from '../typings';
import { appResolve } from '../utils/appResolve';

export const getAquOptionsFromPackage = async (): Promise<AquOptions | undefined> => {
	const packageJsonPath = appResolve('package.json');

	return new Promise((resolve) => {
		readFile(packageJsonPath, async (err, data) => {
			if (err) {
				logger.warn(packageNotFound);
				resolve(undefined);
			} else {
				const appPackage = JSON.parse(data.toString());

				resolve({
					input: appPackage.source,
					name: appPackage.name,
				});
			}
		});
	});
};
