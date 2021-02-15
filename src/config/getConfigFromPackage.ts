import { readFile } from "fs";
import { join } from "path";

export const getConfigFromPackage = <T>(packageProp: string): Promise<T | undefined> =>
    new Promise((resolve) =>
        readFile(join(process.cwd(), "package.json"), (err, data) => {
            if (err) {
                resolve(undefined);
            } else {
                resolve(JSON.parse(data.toString())[packageProp]);
            }
        })
    );
