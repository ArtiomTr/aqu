import { readFile } from 'fs';
import { join } from 'path';

export const hasReact = async (): Promise<boolean> =>
  new Promise((resolve) => {
    readFile(join(process.cwd(), 'package.json'), (err, data) => {
      if (err) {
        resolve(false);
      } else {
        const appPackage = JSON.parse(data.toString());

        resolve(
          (appPackage.dependencies && appPackage.dependencies.react) ||
            (appPackage.devDependencies && appPackage.devDependencies.react) ||
            (appPackage.peerDependencies &&
              appPackage.peerDependencies.react) ||
            (appPackage.alias && appPackage.alias.react),
        );
      }
    });
  });
