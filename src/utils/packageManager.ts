import chalk from 'chalk';
import execa from 'execa';
import inquirer from 'inquirer';

import { insertArgs } from './insertArgs';
import logger from '../logger';
import {
  noPackageManagersFound,
  pickPackageManager as pickPackageManagerMessage,
  unknownPackageManager,
} from '../messages.json';

let packageManager: string | null = null;

type PackageManager = {
  name: string;
  version: string;
};

const checkPackageManager = async (
  name: string,
): Promise<PackageManager | undefined> => {
  try {
    const { stdout } = await execa(name, ['-v']);
    return { name, version: stdout.trim() };
  } catch {
    return undefined;
  }
};

const managers = ['npm', 'yarn', 'pnpm'];

export const findAllInstalledManagers = async (): Promise<
  Array<PackageManager>
> => {
  const available = await Promise.all(
    managers.map((manager) => checkPackageManager(manager)),
  );

  return available.filter(Boolean) as Array<PackageManager>;
};

export const getPackageManager = async (): Promise<string> => {
  if (packageManager !== null) {
    return packageManager;
  }

  const available = await findAllInstalledManagers();

  if (available.length === 0) {
    logger.fatal(
      insertArgs(noPackageManagersFound, {
        available: chalk.bold.red(managers.join(', ')),
      }),
    );
  }

  packageManager = available[0].name.trim();
  return packageManager;
};

export const getPackageVersion = async (pkg: string, manager: string) => {
  if (manager === 'npm' || manager === 'pnpm') {
    const { stdout } = await execa(manager, ['view', pkg, 'version']);
    return stdout.trim();
  } else if (manager === 'yarn') {
    const { stdout } = await execa(manager, [
      'info',
      pkg,
      'version',
      '--silent',
    ]);

    return stdout.trim();
  } else {
    logger.fatal(
      insertArgs(unknownPackageManager, {
        manager: chalk.bold.red(manager),
      }),
    );
  }
};

export const pickPackageManager = async (): Promise<string> => {
  if (packageManager !== null) {
    return packageManager;
  }

  const availableManagers = await findAllInstalledManagers();

  if (availableManagers.length === 0) {
    logger.fatal(
      insertArgs(noPackageManagersFound, {
        available: chalk.bold.red(managers.join(', ')),
      }),
    );
  }

  if (availableManagers.length === 1) {
    packageManager = availableManagers[0].name;
    return packageManager;
  }

  const out = await inquirer.prompt({
    message: pickPackageManagerMessage,
    type: 'list',
    name: 'manager',
    choices: availableManagers.map(
      (manager) => `${manager.name} ${chalk.gray(`(${manager.version})`)}`,
    ),
  });

  packageManager = out.manager.split(' ')[0].trim();

  return packageManager!;
};
