import { dirname, join, parse, relative } from 'path';

import { NodeResolvePlugin } from '@esbuild-plugins/node-resolve';
import { build, BuildOptions } from 'esbuild';
import * as fsExtra from 'fs-extra';
import rimraf from 'rimraf';

const { copy, pathExists, readdir, remove } = (
  fsExtra as unknown as { default: typeof fsExtra }
).default;

export type AquSelfBuildOptions = {
  esbuild: BuildOptions;
  outdir: string;
  templates: {
    sourceDir: string;
    outdir: string;
    templateScriptFilename: string;
  };
};

export const buildOptions: AquSelfBuildOptions = {
  outdir: 'dist',
  templates: {
    sourceDir: 'templates',
    outdir: './dist/templates',
    templateScriptFilename: 'aqu.template.ts',
  },
  esbuild: {
    entryPoints: ['./src/index.ts'],
    outfile: './dist/aqu.js',
    bundle: true,
    target: 'node10.16.0',
    platform: 'node',
    banner: {
      js: '#!/usr/bin/env node\n',
    },
    plugins: [
      NodeResolvePlugin({
        extensions: ['.ts', '.js', '.tsx', '.jsx', '.cjs', '.mjs'],
        onResolved: (resolved) => {
          if (resolved.includes('node_modules')) {
            return {
              external: true,
            };
          }
          return resolved;
        },
      }),
    ],
    external: [
      'jest-watch-typeahead/testname',
      'jest-watch-typeahead/filename',
      'esbuild',
    ],
  },
};

const buildSrc = () => {
  build(buildOptions.esbuild).catch((err) => console.error(err));
};

export const buildTemplates = () =>
  new Promise<void>((resolve, reject) => {
    rimraf(buildOptions.templates.outdir, async () => {
      try {
        await copy(
          buildOptions.templates.sourceDir,
          buildOptions.templates.outdir,
        );

        const paths = (await readdir(buildOptions.templates.sourceDir)).map(
          (pth) =>
            join(
              buildOptions.templates.sourceDir,
              pth,
              buildOptions.templates.templateScriptFilename,
            ),
        );
        const isEntry = await Promise.all(paths.map((pth) => pathExists(pth)));

        const entryPoints = paths.filter((_, index) => isEntry[index]);

        await Promise.all(
          entryPoints.map(async (entry) => {
            const parsedEntry = parse(entry);
            const dir = join(
              buildOptions.templates.outdir,
              dirname(relative(buildOptions.templates.sourceDir, entry)),
            );
            await build({
              ...buildOptions.esbuild,
              entryPoints: [entry],
              outfile: join(dir, `${parsedEntry.name}.js`),
            });

            await remove(join(dir, parsedEntry.base));
          }),
        );

        resolve();
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });

const main = () => {
  rimraf(buildOptions.outdir, async () => {
    buildSrc();
    buildTemplates();
  });
};

main();
