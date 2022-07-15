import { relative } from 'path';

import { ESLint, Linter } from 'eslint';

import { createEslintConfig } from '../config/createEslintConfig';
import { loadAndResolveConfig } from '../config/loadAndResolveConfig';
import { CONFIG_EXTENSIONS } from '../constants';
import logger from '../logger';
import {
	commands,
	lintSuccess,
	maxWarningsError,
	noLintDirsSpecifiedError,
	notNumberError,
	options,
} from '../messages.json';
import { AquCommand } from '../typings';
import assert from '../utils/assert';
import { deepMerge } from '../utils/deepMerge';
import { getInputDirs } from '../utils/getInputDirs';
import { insertArgs } from '../utils/insertArgs';
import { safeWriteFile } from '../utils/safeWriteFile';

const availableConfigNames = [...CONFIG_EXTENSIONS.map((ext) => `.eslintrc.${ext}`), '.eslintrc'];

export type LintOptions = {
	maxWarnings: string;
	ignorePattern: string[];
	cacheLocation: string;
	reportFile: string;
	Fix: boolean;
	FixDryRun: boolean;
	Cache: boolean;
};

const lintCommand: AquCommand<LintOptions> = {
	name: 'lint',
	description: commands.lint,
	options: [
		{
			flag: {
				full: 'max-warnings',
				placeholder: 'count',
			},
			description: options.maxWarnings,
		},
		{
			flag: {
				full: 'fix',
			},
			description: options.fix,
		},
		{
			flag: {
				full: 'fix-dry-run',
			},
			description: options.fixDryRun,
		},
		{
			flag: {
				full: 'cache',
			},
			description: options.cache,
		},
		{
			flag: {
				full: 'cache-location',
				placeholder: 'path',
			},
			description: options.cacheLocation,
		},
		{
			flag: {
				full: 'report-file',
				placeholder: 'path',
			},
			description: options.reportFile,
		},
	],
	action: async (options, configs, command) => {
		let maxWarnings = Infinity;

		if (options.maxWarnings) {
			maxWarnings = parseInt(options.maxWarnings);

			assert(
				!Number.isNaN(maxWarnings),
				insertArgs(notNumberError, {
					value: options.maxWarnings,
					name: 'maxWarnings',
				}),
			);
		}

		const defaultConfig = await createEslintConfig();

		const providedConfigs = await loadAndResolveConfig<Linter.Config>({
			availableConfigNames,
			packageJsonProp: 'eslint',
		});

		const eslintConfig = deepMerge(defaultConfig, ...providedConfigs);

		let dirs = command.args;

		if (!dirs || dirs.length === 0) {
			const defaultDirs = getInputDirs(configs).map((dir) => relative(process.cwd(), dir));
			defaultDirs.push('test');

			logger.warn(
				insertArgs(noLintDirsSpecifiedError, {
					dirs: defaultDirs.join(' '),
				}),
			);

			dirs = defaultDirs;
		}

		const eslintInstance = new ESLint({
			baseConfig: eslintConfig,
			fix: options.Fix || options.FixDryRun,
			errorOnUnmatchedPattern: false,
			extensions: ['.ts', '.tsx', '.cjs', '.mjs', '.js', '.jsx', '.json'],
			cache: options.Cache,
			cacheLocation: options.cacheLocation,
		});

		const report = await eslintInstance.lintFiles(dirs);

		if (options.Fix && !options.FixDryRun) {
			await ESLint.outputFixes(report);
		}

		if (report.some((result) => result.messages.length > 0)) {
			logger.info((await eslintInstance.loadFormatter()).format(report));
		} else {
			logger.success(lintSuccess);
		}

		if (options.reportFile) {
			await safeWriteFile(options.reportFile, (await eslintInstance.loadFormatter('json')).format(report));
		}

		const errorCount = report.reduce((acc, cur) => acc + cur.errorCount, 0);
		const warningCount = report.reduce((acc, cur) => acc + cur.warningCount, 0);

		if (errorCount > 0) {
			process.exit(1);
		} else if (warningCount > maxWarnings) {
			logger.fatal(insertArgs(maxWarningsError, { warningCount, maxWarnings }));
		}
	},
};

export default lintCommand;
