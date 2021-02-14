import { readFile } from "fs";
import { resolve } from "path";

import logger from "../logger";
import { TrwlOptions } from "../typings";
import { canReadFile } from "../utils/canReadFile";

export const tryGetConfigFromPackage = async (): Promise<TrwlOptions | undefined> => {
    const packageJsonPath = resolve("package.json");

    if (await canReadFile(packageJsonPath)) {
        return new Promise((resolve) => {
            readFile(packageJsonPath, async (err, data) => {
                if (err) {
                    logger.warn("package.json not not found (could miss some configuration options)");
                    resolve(undefined);
                } else {
                    const appPackage = JSON.parse(data.toString());

                    resolve({
                        input: appPackage.source,
                        name: appPackage.name,
                    });
                }
            });
        });
    }

    return undefined;
};
