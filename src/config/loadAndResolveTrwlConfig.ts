import flatten from "lodash/flatten";

import { getDefaultTrwlConfig } from "./getDefaultTrwlConfig";
import { getTrwlOptionsFromPackage } from "./getTrwlOptionsFromPackage";
import { loadAndResolveConfig } from "./loadAndResolveConfig";
import { CONFIG_NAMES } from "../constants";
import { RawTrwlOptions, TrwlOptions } from "../typings";
import { deepMerge } from "../utils/deepMerge";

export const loadAndResolveTrwlConfig = async (configPath?: string): Promise<Array<TrwlOptions> | undefined> => {
    const rawConfigs = await loadAndResolveConfig<RawTrwlOptions>({
        availableConfigNames: CONFIG_NAMES,
        specifiedConfigPath: configPath,
        packageJsonProp: "trwl",
    });

    const configs = flatten(rawConfigs);

    const standardConfigs = await Promise.all([getDefaultTrwlConfig(), getTrwlOptionsFromPackage()]);

    if (configs.filter(Boolean).length > 0) {
        return configs.map((config) => deepMerge(...standardConfigs, config));
    }

    return [deepMerge(standardConfigs)];
};
