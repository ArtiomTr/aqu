import { join, resolve } from "path";

import { getDefaultConfig } from "./getDefaultConfig";
import { getRawConfig } from "./getRawConfig";
import { resolveConfig } from "./resolveConfig";
import { tryGetConfigFromPackage } from "./tryGetConfigFromPackage";
import { CONFIG_EXTENSIONS } from "../constants";
import { configNotFound } from "../messages.json";
import { TrwlOptions } from "../typings";
import assert from "../utils/assert";
import { canReadFile } from "../utils/canReadFile";
import { deepMerge } from "../utils/deepMerge";
import { existsFileWithExtension } from "../utils/existsFileWithExtension";
import { insertArgs } from "../utils/insertArgs";

export const loadAndResolveConfig = async (configPath?: string): Promise<Array<TrwlOptions> | undefined> => {
    if (configPath !== undefined) {
        configPath = resolve(configPath);
        assert(await canReadFile(configPath), insertArgs(configNotFound, { path: configPath }));
    } else {
        configPath = await existsFileWithExtension(join(process.cwd(), "trwl.config"), CONFIG_EXTENSIONS);
    }

    const configFromPackage = await tryGetConfigFromPackage();
    const defaultConfig = await getDefaultConfig();

    if (configPath !== undefined) {
        const resolvedConfigs = resolveConfig(await getRawConfig(configPath));
        return resolvedConfigs.map(
            (config) => deepMerge([defaultConfig, configFromPackage!, config].filter(Boolean)) as TrwlOptions
        );
    }

    if (configFromPackage === undefined) {
        return [defaultConfig as TrwlOptions];
    }

    return [deepMerge(defaultConfig, configFromPackage) as TrwlOptions];
};
