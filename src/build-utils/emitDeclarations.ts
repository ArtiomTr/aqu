import { extname } from 'path';

import { generateDtsBundle } from 'dts-bundle-generator';

import { defaultEmitDeclarations } from './defaultEmitDeclarations';
import { getFolderFromPackageName } from '../create-utils/getFolderFromPackageName';
import { Progress } from '../logger';
import { steps } from '../messages.json';
import { VerifiedAquOptions } from '../typings';
import { appResolve } from '../utils/appResolve';
import { safeWriteFile } from '../utils/safeWriteFile';

const canHaveDeclarations = (filePath: string) =>
  ['.ts', '.tsx'].includes(extname(filePath));

export const emitDeclarations = async (config: VerifiedAquOptions) => {
  const {
    input,
    declaration,
    outfile,
    outdir,
    name,
    tsconfig,
    dtsBundleGeneratorOptions,
  } = config;

  if (input.some(canHaveDeclarations)) {
    if (declaration === 'bundle') {
      const dtsProgress = new Progress(steps.dtsBundle);

      try {
        await Promise.all(
          generateDtsBundle(
            input.filter(canHaveDeclarations).map((entry) => ({
              ...dtsBundleGeneratorOptions,
              filePath: entry,
            })),
            {
              preferredConfigPath: tsconfig,
            },
          ).map((bundle) => {
            return safeWriteFile(
              outfile
                ? `${outfile.substring(0, outfile.lastIndexOf('.'))}.d.ts`
                : appResolve(outdir, `${getFolderFromPackageName(name)}.d.ts`),
              bundle,
            );
          }),
        );

        dtsProgress.succeed();
      } catch (err) {
        dtsProgress.fail();
        throw err;
      }
    } else if (declaration === 'normal') {
      const dtsProgress = new Progress(steps.dtsStandard);

      try {
        await defaultEmitDeclarations(config);

        dtsProgress.succeed();
      } catch (err) {
        dtsProgress.fail();
        throw err;
      }
    }
  }
};
