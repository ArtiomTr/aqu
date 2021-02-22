import flatten from 'lodash/flatten';

import { getAquOptionsFromPackage } from './getAquOptionsFromPackage';
import { getDefaultAquConfig } from './getDefaultAquConfig';
import { loadAndResolveConfig } from './loadAndResolveConfig';
import { CONFIG_NAMES } from '../constants';
import { AquOptions, RawAquOptions } from '../typings';
import { deepMerge } from '../utils/deepMerge';

export const loadAndResolveAquConfig = async (
  configPath?: string,
): Promise<Array<AquOptions> | undefined> => {
  const rawConfigs = await loadAndResolveConfig<RawAquOptions>({
    availableConfigNames: CONFIG_NAMES,
    specifiedConfigPath: configPath,
    packageJsonProp: 'aqu',
  });

  const configs = flatten(rawConfigs).filter(Boolean);

  const standardConfigs = await Promise.all([
    getDefaultAquConfig(),
    getAquOptionsFromPackage(),
  ]);

  if (configs.length > 0) {
    return configs.map((config) => deepMerge(...standardConfigs, config));
  }

  return [deepMerge(standardConfigs)];
};
