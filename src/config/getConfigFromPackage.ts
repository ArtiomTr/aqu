import { readFile } from 'fs';

import { appResolve } from '../utils/appResolve';

export const getConfigFromPackage = <T>(
  packageProp: string,
): Promise<T | undefined> =>
  new Promise((resolve) =>
    readFile(appResolve('package.json'), (err, data) => {
      if (err) {
        resolve(undefined);
      } else {
        resolve(JSON.parse(data.toString())[packageProp]);
      }
    }),
  );
