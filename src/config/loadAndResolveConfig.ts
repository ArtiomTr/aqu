import { getConfigFromPackage } from './getConfigFromPackage';
import { getRawConfig } from './getRawConfig';
import { configNotFound } from '../messages.json';
import { appResolve } from '../utils/appResolve';
import assert from '../utils/assert';
import { canReadFile } from '../utils/canReadFile';
import { existsAny } from '../utils/existsAny';
import { insertArgs } from '../utils/insertArgs';

export type ResolveConfigOptions = {
	availableConfigNames: string[];
	packageJsonProp?: string;
	specifiedConfigPath?: string;
};

export const loadAndResolveConfig = async <T>({
	availableConfigNames,
	packageJsonProp,
	specifiedConfigPath,
}: ResolveConfigOptions): Promise<Array<T | undefined>> => {
	const configs: Array<Promise<T | undefined>> = [];

	if (specifiedConfigPath !== undefined) {
		specifiedConfigPath = appResolve(specifiedConfigPath);
		assert(await canReadFile(specifiedConfigPath), insertArgs(configNotFound, { path: specifiedConfigPath }));
	} else {
		specifiedConfigPath = await existsAny(availableConfigNames.map((configName) => appResolve(configName)));
	}

	if (packageJsonProp) {
		configs.push(getConfigFromPackage(packageJsonProp));
	}

	if (specifiedConfigPath !== undefined) {
		configs.push(getRawConfig(specifiedConfigPath));
	}

	return Promise.all(configs);
};
