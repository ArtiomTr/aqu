import { readFile } from "fs";
import { parse } from "path";

import { getRawConfigFromCjs } from "./getRawConfigFromCjs";
import { transpileAndGetRawConfig } from "./transpileAndGetRawConfig";

const isRcFile = (name: string, ext: string) =>
    ext === "" && name.substring(name.length - 2) === "rc" && name[0] === ".";

export const getRawConfig = async <T>(configPath: string): Promise<T> => {
    const { ext, name } = parse(configPath);

    if (ext === ".json" || isRcFile(name, ext)) {
        return new Promise((resolve, reject) =>
            readFile(configPath, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(data.toString()));
                }
            })
        );
    } else if (ext === ".cjs") {
        return Promise.resolve(getRawConfigFromCjs(configPath));
    } else {
        return transpileAndGetRawConfig(configPath);
    }
};
