import { remove } from 'fs-extra';

import { revertWarn } from './revertWarn';
import { ejectPackageScript } from '../eject-utils/ejectPackageScript';
import { appResolve } from '../utils/appResolve';

export const runRevert = (
  command: string,
  packageScript: string,
  revertedScript: string,
  filesToDelete: string[],
) => async (skipWarnings?: boolean) => {
  if (
    skipWarnings ||
    (await revertWarn(command, packageScript, filesToDelete))
  ) {
    await Promise.all(filesToDelete.map((file) => remove(appResolve(file))));
    await ejectPackageScript(packageScript, '', revertedScript, true);
  }
};
