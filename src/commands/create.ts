import chalk from 'chalk';
import inquirer from 'inquirer';
import * as Yup from 'yup';

import { createFromConfig } from '../create-utils/createFromConfig';
import { getAllLicenses } from '../create-utils/getAllLicenses';
import { getAllTemplates } from '../create-utils/getAllTemplates';
import { verifyPackageName } from '../create-utils/verifyPackageName';
import {
  commands,
  createBanner,
  createQuestions,
  notValidUrl,
  options,
  requiredCli,
} from '../messages.json';
import { AquCommand, CreateOptions } from '../typings';
import { getAuthor } from '../utils/getAuthor';
import { getDefaultRepo } from '../utils/getDefaultRepo';
import { getGithubUser } from '../utils/getGithubUser';
import { insertArgs } from '../utils/insertArgs';

type CreateArguments = {
  yes: boolean;
} & CreateOptions;

const createCommand: AquCommand<CreateArguments> = {
  name: 'create',
  description: commands.create,
  options: [
    {
      flag: {
        full: 'description',
        short: 'd',
        placeholder: 'value',
      },
      description: options.description,
    },
    {
      flag: {
        full: 'author',
        short: 'a',
        placeholder: 'name',
      },
      description: options.author,
    },
    {
      flag: {
        full: 'repo',
        short: 'r',
        placeholder: 'url',
      },
      description: options.repo,
    },
    {
      flag: {
        full: 'license',
        short: 'l',
        placeholder: 'value',
      },
      description: options.license,
    },
    {
      flag: {
        full: 'template',
        short: 't',
        placeholder: 'value',
      },
      description: options.template,
    },
    {
      flag: {
        full: 'yes',
        short: 'y',
      },
      description: options.yes,
    },
  ],
  action: async (args, _, command) => {
    console.log(chalk.cyan(createBanner));

    const name = command.args[0];
    const githubUser = await getGithubUser();
    const availableLicenses = await getAllLicenses();
    const availableTemplates = await getAllTemplates();

    const defaults = {
      name,
      description: '',
      author: (await getAuthor()) ?? '',
      repo: ({ name }: CreateOptions) => getDefaultRepo(name, githubUser),
      license: 'MIT',
      template: 'typescript',
    };

    let options: CreateOptions;

    if (!args.yes) {
      options = await inquirer.prompt(
        [
          {
            type: 'input',
            name: 'name',
            message: createQuestions.name,
            validate: (input) =>
              verifyPackageName(input).then((value) =>
                typeof value === 'boolean' ? value : value.message,
              ),
          },
          {
            type: 'input',
            name: 'description',
            message: createQuestions.description,
            default: defaults.description,
          },
          {
            type: 'input',
            name: 'author',
            message: createQuestions.author,
            default: defaults.author,
            validate: (input) =>
              Yup.string()
                .required(requiredCli)
                .validate(input)
                .then(() => true)
                .catch((err) => err.message),
          },
          {
            type: 'input',
            name: 'repo',
            message: createQuestions.repo,
            default: defaults.repo,
            validate: (input) =>
              Yup.string()
                .required(requiredCli)
                .url(
                  insertArgs(notValidUrl, {
                    value: chalk.bold.red('${value}'),
                  }),
                )
                .validate(input)
                .then(() => true)
                .catch((err) => err.message),
          },
          {
            type: 'list',
            name: 'license',
            message: createQuestions.license,
            default: defaults.license,
            choices: availableLicenses,
          },
          {
            type: 'list',
            name: 'template',
            message: createQuestions.template,
            default: defaults.template,
            choices: availableTemplates,
          },
        ],
        {
          ...args,
          name,
        },
      );
    } else {
      options = {
        ...defaults,
        repo: defaults.repo((defaults as unknown) as CreateOptions) ?? '',
        ...(args as Omit<CreateOptions, 'repo'>),
      };
    }

    await createFromConfig(
      options,
      githubUser,
      availableLicenses,
      availableTemplates,
    );
  },
};

export default createCommand;
