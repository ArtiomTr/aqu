import { EOL } from "os";
import { join } from "path";

import chalk from "chalk";

import { createLicense } from "./createLicense";
import { installDependencies } from "./installDependencies";
import { loadTemplate } from "./loadTemplate";
import { verifyCreateOptions } from "./verifyCreateOptions";
import { showSkippedStep } from "../build-utils/showSkippedStep";
import logger, { Progress } from "../logger";
import { CreateOptions } from "../typings";

export const createFromConfig = async (
    options: CreateOptions,
    githubUser: string | undefined,
    availableLicenses: string[],
    availableTemplates: string[]
) => {
    await verifyCreateOptions(options, availableLicenses, availableTemplates);

    console.log();

    const creationProgress = new Progress(
        `Creating ${chalk.bold.cyan(options.name)} using ${chalk.cyan(options.template)} template...`
    );

    try {
        await loadTemplate(options, githubUser);
        await createLicense(options.license, join(process.cwd(), options.name, "LICENSE"), options.author);
        creationProgress.succeed("Created " + chalk.bold.green(options.name));
    } catch (err) {
        creationProgress.fail(`Create ${chalk.bold.red(options.name)}`);
        showSkippedStep("Install dependencies");
        logger.fatal(err);
    }

    const installProgress = new Progress("Installing dependencies...");

    try {
        await installDependencies(options.name);
        installProgress.succeed("Dependencies intalled");
    } catch (err) {
        installProgress.fail("Install dependencies");
        logger.fatal(err);
    }

    console.log(EOL, `Package ${chalk.bold.cyan(options.name)} successfully created`, EOL, EOL, "Happy coding!");

    console.log();
};
