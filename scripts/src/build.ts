import { dirname, join, parse, relative } from 'path';

import NodeResolve from '@esbuild-plugins/node-resolve';
import { build, BuildOptions, Service, startService } from 'esbuild';
import { copy, pathExists, readdir, remove } from 'fs-extra';
import rimraf from 'rimraf';

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
    banner: '#!/usr/bin/env node\n',
    plugins: [
      NodeResolve({
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
    ],
  },
};

const buildSrc = () => {
  build(buildOptions.esbuild).catch((err) => console.error(err));
};

export const buildTemplates = (service: Service) =>
  new Promise<void>((resolve, reject) => {
    rimraf(buildOptions.templates.outdir, async () => {
      try {
        await copy(
          buildOptions.templates.sourceDir,
          buildOptions.templates.outdir,
        );

        const paths = (
          await readdir(buildOptions.templates.sourceDir)
        ).map((pth) =>
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
            await service.build({
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
    const service = await startService();
    try {
      buildTemplates(service);
    } catch (err) {
      console.error(err);
    } finally {
      service.stop();
    }
  });
};

main();
