import chalk from 'chalk';

import { createLicense } from './createLicense';
import { getFolderFromPackageName } from './getFolderFromPackageName';
import { installDependencies } from './installDependencies';
import { loadTemplate } from './loadTemplate';
import { verifyCreateOptions } from './verifyCreateOptions';
import { showSkippedStep } from '../build-utils/showSkippedStep';
import logger, { Progress } from '../logger';
import { steps } from '../messages.json';
import { CreateOptions } from '../typings';
import { appResolve } from '../utils/appResolve';
import { insertArgs } from '../utils/insertArgs';

export const createFromConfig = async (
	options: CreateOptions,
	githubUser: string | undefined,
	availableLicenses: string[],
	availableTemplates: string[],
) => {
	await verifyCreateOptions(options, availableLicenses, availableTemplates);

	console.log();

	const creationProgress = new Progress(
		insertArgs(steps.creating, {
			package: chalk.bold.cyan(options.name),
			template: chalk.cyan(options.template),
		}),
	);

	try {
		await loadTemplate(options, githubUser);
		await createLicense(options.license, appResolve(getFolderFromPackageName(options.name), 'LICENSE'), options.author);
		creationProgress.succeed(
			insertArgs(steps.creationSuccess, {
				package: chalk.bold.green(options.name),
			}),
		);
	} catch (err) {
		creationProgress.fail(
			insertArgs(steps.creationFail, {
				package: chalk.bold.red(options.name),
			}),
		);
		showSkippedStep(steps.skipInstallDeps);
		logger.fatal(err);
	}

	const installProgress = new Progress(steps.installingDeps);

	try {
		await installDependencies(getFolderFromPackageName(options.name));
		installProgress.succeed(steps.installDepsSuccess);
	} catch (err) {
		installProgress.fail(steps.installDepsFail);
		logger.fatal(err);
	}

	console.log(
		insertArgs(steps.creationFinalize, {
			package: chalk.bold.cyan(options.name),
		}),
	);

	console.log();
};
