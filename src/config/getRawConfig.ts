import { readFile } from "fs";
import { extname } from "path";

import { getRawConfigFromCjs } from "./getRawConfigFromCjs";
import { transpileAndGetRawConfig } from "./transpileAndGetRawConfig";
import { RawTrwlOptions } from "../typings";

export const getRawConfig = async (configPath: string): Promise<RawTrwlOptions> => {
    const extension = extname(configPath);

    if (extension === ".json") {
        return new Promise((resolve, reject) =>
            readFile(configPath, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(data.toString()));
                }
            })
        );
    } else if (extension === ".cjs") {
        return Promise.resolve(getRawConfigFromCjs(configPath));
    } else {
        return transpileAndGetRawConfig(configPath);
    }
};
