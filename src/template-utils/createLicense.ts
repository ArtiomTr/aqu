import { join } from "path";

import { pathExists, readFile, writeFile } from "fs-extra";

import { insertArgs } from "../utils/insertArgs";

export const createLicense = async (license: string, path: string, author: string) => {
    const licensePath = join(__dirname, "..", "licenses", `${license}.txt`);

    const licenseExists = await pathExists(licensePath);

    if (!licenseExists) {
        throw new Error(`License "${license}" do not exist`);
    }

    const content = await readFile(licensePath);

    await writeFile(
        path,
        insertArgs(content.toString(), {
            author,
            year: new Date().getFullYear(),
        })
    );
};
