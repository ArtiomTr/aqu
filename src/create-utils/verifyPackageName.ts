import { join } from "path";

import chalk from "chalk";
import { pathExists } from "fs-extra";
import { string, ValidationError } from "yup";

export const verifyPackageName = (name: string | undefined): Promise<boolean | ValidationError> =>
    string()
        .required("Package name is not specified.")
        .matches(
            /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/,
            `Package name ${chalk.bold.red("${value}")} is invalid`
        )
        .test((value, { createError }) =>
            pathExists(join(process.cwd(), value!)).then((exists) =>
                exists ? createError({ message: `Folder ${chalk.bold.red(value)} already exists` }) : true
            )
        )
        .validate(name ?? "")
        .then(() => true)
        .catch((err) => err);
