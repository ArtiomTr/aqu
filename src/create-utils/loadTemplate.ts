import { join } from 'path';

import { copyTemplate } from './copyTemplate';
import { getFolderFromPackageName } from './getFolderFromPackageName';
import { getRawConfigFromCjs } from '../config/getRawConfigFromCjs';
import { templatesPath } from '../constants';
import logger from '../logger';
import { templateLoadLoop } from '../messages.json';
import { CreateOptions, TemplateInitializationOptions, TemplateScript } from '../typings';
import { appResolve } from '../utils/appResolve';
import assert from '../utils/assert';
import { insertArgs } from '../utils/insertArgs';
import { getPackageManager } from '../utils/packageManager';

export const loadTemplate = async (
	templateOptions: CreateOptions,
	githubUser: string | undefined,
	loadedTemplates: Set<string> = new Set<string>(),
) => {
	const { name, template } = templateOptions;

	const folder = getFolderFromPackageName(name);

	loadedTemplates.add(template);

	const scriptPath = join(templatesPath, template, 'aqu.template.js');

	let options: TemplateInitializationOptions = {};

	try {
		const templateScript = await getRawConfigFromCjs<TemplateScript>(scriptPath);

		options = await templateScript.initialize(await getPackageManager());

		if (options.templateFilePaths) {
			options.templateFilePaths = options.templateFilePaths.map((path) => appResolve(folder, path));
		}

		if (options.filesToMergePaths) {
			options.filesToMergePaths = options.filesToMergePaths.map((path) => appResolve(folder, path));
		}
	} catch (err) {
		logger.error(err);
	}

	if (options.extend) {
		assert(
			!loadedTemplates.has(options.extend),
			insertArgs(templateLoadLoop, {
				template,
				loop: [...Array.from(loadedTemplates), options.extend].join(' → '),
			}),
		);

		await loadTemplate({ ...templateOptions, template: options.extend }, githubUser, loadedTemplates);
	}

	await copyTemplate(join(templatesPath, template), join(process.cwd(), folder), options, {
		...templateOptions,
		...options.customArgs,
		safeName: getFolderFromPackageName(name),
		githubUser,
	});
};
