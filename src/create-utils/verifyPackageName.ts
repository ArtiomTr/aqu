import chalk from 'chalk';
import { pathExists } from 'fs-extra';
import { string, ValidationError } from 'yup';

import { getFolderFromPackageName } from './getFolderFromPackageName';
import { folderAlreadyExists, packageNameInvalid, packageNameNotSpecified } from '../messages.json';
import { appResolve } from '../utils/appResolve';
import { insertArgs } from '../utils/insertArgs';

export const verifyPackageName = (name: string | undefined): Promise<boolean | ValidationError> =>
	string()
		.required(packageNameNotSpecified)
		.matches(
			/^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/,
			insertArgs(packageNameInvalid, { name: chalk.bold.red('${value}') }),
		)
		.test((value, { createError }) =>
			pathExists(appResolve(getFolderFromPackageName(value!))).then((exists) =>
				exists
					? createError({
							message: insertArgs(folderAlreadyExists, {
								path: chalk.bold.red(value),
							}),
					  })
					: true,
			),
		)
		.validate(name ?? '')
		.then(() => true)
		.catch((err) => err);
