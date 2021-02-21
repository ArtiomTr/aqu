import { resolve } from "path";

import execa from "execa";
import { pathExists } from "fs-extra";

export const installDependencies = async (name: string) => {
    await execa("npm", ["install"], {
        cwd: resolve(process.cwd(), name),
    });

    const exampleFolder = resolve(process.cwd(), name, "example");

    if (await pathExists(exampleFolder)) {
        await execa("npm", ["install"], {
            cwd: exampleFolder,
        });
    }
};
