import { join, resolve } from "path";

import { getRawConfig } from "./getRawConfig";
import { resolveConfig } from "./resolveConfig";
import { CONFIG_EXTENSIONS } from "../constants";
import { TrwlOptions } from "../typings";
import assert from "../utils/assert";
import { canReadFile } from "../utils/canReadFile";
import { existsAny } from "../utils/existsAny";

export const loadAndResolveConfig = async (configPath?: string): Promise<Array<TrwlOptions> | undefined> => {
    if (configPath !== undefined) {
        configPath = resolve(configPath);
        assert(await canReadFile(configPath), `Cannot read config at path ${configPath}`);
    } else {
        const currentDir = process.cwd();
        configPath = await existsAny(CONFIG_EXTENSIONS.map((ext) => join(currentDir, `trwl.config.${ext}`)));
    }

    if (configPath !== undefined) {
        return resolveConfig(await getRawConfig(configPath));
    }

    return undefined;
};
