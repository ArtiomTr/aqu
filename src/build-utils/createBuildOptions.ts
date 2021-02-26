import NodeResolve from '@esbuild-plugins/node-resolve';
import { BuildOptions } from 'esbuild';

import { getFolderFromPackageName } from '../create-utils/getFolderFromPackageName';
import { VerifiedAquOptions } from '../typings';
import { appResolve } from '../utils/appResolve';

export const createBuildOptions = async (config: VerifiedAquOptions) => {
  const {
    format,
    name,
    cjsMode,
    input,
    outdir,
    outfile,
    buildOptions,
    incremental,
    tsconfig,
    externalNodeModules,
  } = config;

  const safeName = getFolderFromPackageName(name);

  const normalConfigs: Array<BuildOptions> = [];

  const sharedOpts: Partial<BuildOptions> = {
    keepNames: true,
    bundle: true,
    sourcemap: 'external',
    incremental,
    tsconfig,
    plugins: [
      NodeResolve({
        extensions: ['.ts', '.js', '.tsx', '.jsx', '.cjs', '.mjs'],
        onResolved: (resolved) => {
          if (externalNodeModules && resolved.includes('node_modules')) {
            return {
              external: true,
            };
          }
          return resolved;
        },
      }),
    ],
    ...buildOptions,
    entryPoints: input,
    logLevel: 'silent',
  };

  if (format.includes('cjs')) {
    if (cjsMode === 'development' || cjsMode === 'mixed') {
      normalConfigs.push({
        ...sharedOpts,
        format: 'cjs',
        outfile:
          outfile || appResolve(outdir, `${safeName}.cjs.development.js`),
      });
    }
    if (cjsMode === 'production' || cjsMode === 'mixed') {
      normalConfigs.push({
        ...sharedOpts,
        minify: true,
        format: 'cjs',
        outfile:
          outfile || appResolve(outdir, `${safeName}.cjs.production.min.js`),
      });
    }
  }

  if (format.includes('esm')) {
    normalConfigs.push({
      ...sharedOpts,
      format: 'esm',
      outfile: outfile || appResolve(outdir, `${safeName}.esm.js`),
    });
  }

  if (format.includes('iife')) {
    normalConfigs.push({
      ...sharedOpts,
      format: 'iife',
      outfile: outfile || appResolve(outdir, `${safeName}.js`),
    });
  }

  return normalConfigs;
};
