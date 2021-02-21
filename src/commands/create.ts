import { join } from "path";

import chalk from "chalk";
import { pathExists } from "fs-extra";
import inquirer from "inquirer";

import { showSkippedStep } from "../build-utils/showSkippedStep";
import logger, { Progress } from "../logger";
import { createLicense } from "../template-utils/createLicense";
import { getAllLicenses } from "../template-utils/getAllLicenses";
import { getAllTemplates } from "../template-utils/getAllTemplates";
import { installDependencies } from "../template-utils/installDependencies";
import { loadTemplate } from "../template-utils/loadTemplate";
import { TrwlCommand } from "../typings";
import { getAuthor } from "../utils/getAuthor";
import { getDefaultRepo } from "../utils/getDefaultRepo";

type CreateOptions = {};

const packageNameRegex = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

export type TemplateOptions = {
    name: string;
    description: string;
    author: string;
    repo: string;
    license: string;
    template: string;
};

const createCommand: TrwlCommand<CreateOptions> = {
    name: "create",
    description: "Create new project",
    options: [],
    action: async () => {
        const prompt: TemplateOptions = await inquirer.prompt(
            [
                {
                    type: "input",
                    name: "name",
                    message: "What's your project name?",
                    validate: (input) => {
                        if (!packageNameRegex.test(input)) {
                            return "Package name is invalid";
                        }

                        return pathExists(join(process.cwd(), input)).then((exists) =>
                            exists ? `Folder ${chalk.bold.red(input)} already exists` : true
                        );
                    },
                },
                {
                    type: "input",
                    name: "description",
                    message: "Specify package description",
                    default: "",
                },
                {
                    type: "input",
                    name: "author",
                    message: "Author",
                    default: await getAuthor(),
                },
                {
                    type: "input",
                    name: "repo",
                    message: "Specify repository",
                    default: ({ name }: TemplateOptions) => getDefaultRepo(name),
                },
                {
                    type: "list",
                    name: "license",
                    message: "Which license to use?",
                    default: "MIT",
                    choices: await getAllLicenses(),
                },
                {
                    type: "list",
                    name: "template",
                    message: "Which template to use?",
                    default: "typescript",
                    choices: await getAllTemplates(),
                },
            ],
            {}
        );

        console.log();

        const creationProgress = new Progress("Creating project");

        try {
            await loadTemplate(prompt);
            await createLicense(prompt.license, join(process.cwd(), prompt.name, "LICENSE"), prompt.author);
            creationProgress.succeed();
        } catch (err) {
            creationProgress.fail();
            showSkippedStep("Installing dependencies");
            logger.fatal(err);
        }

        const installProgress = new Progress("Installing dependencies");

        try {
            await installDependencies(prompt.name);
            installProgress.succeed();
        } catch (err) {
            installProgress.fail();
            logger.fatal(err);
        }

        console.log();
    },
};

export default createCommand;
