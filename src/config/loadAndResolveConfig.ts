import { join, resolve } from 'path';

import { getConfigFromPackage } from './getConfigFromPackage';
import { getRawConfig } from './getRawConfig';
import { configNotFound } from '../messages.json';
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
    specifiedConfigPath = resolve(specifiedConfigPath);
    assert(
      await canReadFile(specifiedConfigPath),
      insertArgs(configNotFound, { path: specifiedConfigPath }),
    );
  } else {
    specifiedConfigPath = await existsAny(
      availableConfigNames.map((configName) => join(process.cwd(), configName)),
    );
  }

  if (packageJsonProp) {
    configs.push(getConfigFromPackage(packageJsonProp));
  }

  if (specifiedConfigPath !== undefined) {
    configs.push(getRawConfig(specifiedConfigPath));
  }

  return Promise.all(configs);
};
