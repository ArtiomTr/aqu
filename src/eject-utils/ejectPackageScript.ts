import chalk from 'chalk';
import { readJSON, writeJSON } from 'fs-extra';
import { prompt } from 'inquirer';

import { appResolve } from '../utils/appResolve';

export const ejectPackageScript = async (
  script: string,
  defaultScript: string,
  newScript: string,
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
      appPackage.scripts &&
      appPackage.scripts[script] &&
      appPackage.scripts[script].trim() !== defaultScript.trim()
    ) {
      const result = await prompt({
        name: 'confirm',
        message: `Found custom script in package.json - ${chalk.cyan(
          `"${appPackage.scripts[script]}"`,
        )}. Do you want to replace it to ${chalk.bold.cyan(`"${newScript}"`)}?`,
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
