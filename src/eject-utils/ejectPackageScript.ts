import chalk from 'chalk';
import { readJSON, writeJSON } from 'fs-extra';
import { prompt } from 'inquirer';

import { ejectPackageScriptWarn } from '../messages.json';
import { appResolve } from '../utils/appResolve';
import { insertArgs } from '../utils/insertArgs';

export const ejectPackageScript = async (
  script: string,
  defaultScript: string,
  newScript: string,
  skipWarning?: boolean,
) => {
  try {
    const appPackagePath = appResolve('package.json');
    const appPackage = await readJSON(appPackagePath);

    if (
      appPackage.scripts &&
      appPackage.scripts[script] &&
      appPackage.scripts[script].trim() === newScript.trim()
    ) {
      return;
    }

    if (
      !skipWarning &&
      appPackage.scripts &&
      appPackage.scripts[script] &&
      appPackage.scripts[script].trim() !== defaultScript.trim()
    ) {
      const result = await prompt({
        name: 'confirm',
        message: insertArgs(ejectPackageScriptWarn, {
          oldScript: chalk.cyan(`"${appPackage.scripts[script]}"`),
          newScript: chalk.bold.cyan(`"${newScript}"`),
        }),
        type: 'confirm',
      });

      if (!result.confirm) {
        return;
      }
    }

    if (!appPackage.scripts) {
      appPackage.scripts = {};
    }

    appPackage.scripts[script] = newScript;

    await writeJSON(appPackagePath, appPackage, {
      spaces: 2,
    });
  } catch (err) {
    /** */
  }
};
