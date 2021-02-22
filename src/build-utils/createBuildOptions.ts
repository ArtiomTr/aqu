import { join } from 'path';

import NodeResolve from '@esbuild-plugins/node-resolve';
import { BuildOptions } from 'esbuild';

import { VerifiedAquOptions } from '../typings';

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
        outfile: outfile || join(outdir, `${name}.cjs.development.js`),
      });
    }
    if (cjsMode === 'production' || cjsMode === 'mixed') {
      normalConfigs.push({
        ...sharedOpts,
        minify: true,
        format: 'cjs',
        outfile: outfile || join(outdir, `${name}.cjs.production.min.js`),
      });
    }
  }

  if (format.includes('esm')) {
    normalConfigs.push({
      ...sharedOpts,
      format: 'esm',
      outfile: outfile || join(outdir, `${name}.esm.js`),
    });
  }

  if (format.includes('iife')) {
    normalConfigs.push({
      ...sharedOpts,
      format: 'iife',
      outfile: outfile || join(outdir, `${name}.js`),
    });
  }

  return normalConfigs;
};
