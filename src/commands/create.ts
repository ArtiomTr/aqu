import chalk from "chalk";
import inquirer from "inquirer";
import * as Yup from "yup";

import { createFromConfig } from "../create-utils/createFromConfig";
import { getAllLicenses } from "../create-utils/getAllLicenses";
import { getAllTemplates } from "../create-utils/getAllTemplates";
import { verifyPackageName } from "../create-utils/verifyPackageName";
import { CreateOptions, TrwlCommand } from "../typings";
import { getAuthor } from "../utils/getAuthor";
import { getDefaultRepo } from "../utils/getDefaultRepo";
import { getGithubUser } from "../utils/getGithubUser";

type CreateArguments = {
    yes: boolean;
} & CreateOptions;

const createCommand: TrwlCommand<CreateArguments> = {
    name: "create",
    description: "Create new project",
    options: [
        {
            flag: {
                full: "description",
                short: "d",
                placeholder: "value",
            },
            description: "new package description",
        },
        {
            flag: {
                full: "author",
                short: "a",
                placeholder: "name",
            },
            description: "package author",
        },
        {
            flag: {
                full: "repo",
                short: "r",
                placeholder: "url",
            },
            description: "repository",
        },
        {
            flag: {
                full: "license",
                short: "l",
                placeholder: "value",
            },
            description: "specify license",
        },
        {
            flag: {
                full: "template",
                short: "t",
                placeholder: "value",
            },
            description: "template",
        },
        {
            flag: {
                full: "yes",
                short: "y",
            },
            description: "pick all defaults",
        },
    ],
    action: async (args, _, command) => {
        const name = command.args[0];
        const githubUser = await getGithubUser();
        const availableLicenses = await getAllLicenses();
        const availableTemplates = await getAllTemplates();

        const defaults = {
            name,
            description: "",
            author: (await getAuthor()) ?? "",
            repo: ({ name }: CreateOptions) => getDefaultRepo(name, githubUser),
            license: "MIT",
            template: "typescript",
        };

        let options: CreateOptions;

        if (!args.yes) {
            options = await inquirer.prompt(
                [
                    {
                        type: "input",
                        name: "name",
                        message: "What's your project name?",
                        validate: (input) =>
                            verifyPackageName(input).then((value) =>
                                typeof value === "boolean" ? value : value.message
                            ),
                    },
                    {
                        type: "input",
                        name: "description",
                        message: "Specify package description",
                        default: defaults.description,
                    },
                    {
                        type: "input",
                        name: "author",
                        message: "Author",
                        default: defaults.author,
                        validate: (input) =>
                            Yup.string()
                                .required("Please enter the value")
                                .validate(input)
                                .then(() => true)
                                .catch((err) => err.message),
                    },
                    {
                        type: "input",
                        name: "repo",
                        message: "Specify repository",
                        default: defaults.repo,
                        validate: (input) =>
                            Yup.string()
                                .required("Please enter the value")
                                .url(`${chalk.bold.red("${value}")} is not valid URL.`)
                                .validate(input)
                                .then(() => true)
                                .catch((err) => err.message),
                    },
                    {
                        type: "list",
                        name: "license",
                        message: "Which license to use?",
                        default: defaults.license,
                        choices: availableLicenses,
                    },
                    {
                        type: "list",
                        name: "template",
                        message: "Which template to use?",
                        default: defaults.template,
                        choices: availableTemplates,
                    },
                ],
                {
                    ...args,
                    name,
                }
            );
        } else {
            options = {
                ...defaults,
                repo: defaults.repo((defaults as unknown) as CreateOptions) ?? "",
                ...(args as Omit<CreateOptions, "repo">),
            };
        }

        await createFromConfig(options, githubUser, availableLicenses, availableTemplates);
    },
};

export default createCommand;
