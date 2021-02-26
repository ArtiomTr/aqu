import uniq from 'lodash/uniq';
import rimraf from 'rimraf';

import { appResolve } from './appResolve';
import logger from '../logger';
import { VerifiedAquOptions } from '../typings';

export const deleteBuildDirs = (configs: VerifiedAquOptions[]) => {
  const folders = uniq(configs.map((value) => appResolve(value.outdir)));

  return Promise.all(
    folders.map(
      (folder) =>
        new Promise<void>((resolve) =>
          rimraf(folder, (error) => {
            if (error) {
              logger.error(error);
            }
            resolve();
          }),
        ),
    ),
  );
};
