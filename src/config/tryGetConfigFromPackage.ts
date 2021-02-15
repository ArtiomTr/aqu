import { readFile } from "fs";
import { resolve } from "path";

import logger from "../logger";
import { packageNotFound } from "../messages.json";
import { TrwlOptions } from "../typings";

export const tryGetConfigFromPackage = async (): Promise<TrwlOptions | undefined> => {
    const packageJsonPath = resolve("package.json");

    return new Promise((resolve) => {
        readFile(packageJsonPath, async (err, data) => {
            if (err) {
                logger.warn(packageNotFound);
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
};
