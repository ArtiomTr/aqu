import { join } from "path";

import { readdir } from "fs-extra";

export const getAllLicenses = async () => {
    const pathToLicensesFolder = join(__dirname, "..", "licenses");

    const licenses = await readdir(pathToLicensesFolder);

    return licenses.map((licenseName) => licenseName.substring(0, licenseName.lastIndexOf(".")));
};
