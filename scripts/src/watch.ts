import { dirname, join, parse, relative } from 'path';

import { watch } from 'chokidar';
import { build, startService } from 'esbuild';
import { copy, pathExists, readdir, remove } from 'fs-extra';
import rimraf from 'rimraf';

import { buildOptions } from './build';
import { gracefulShutdown } from '../../src/utils/gracefulShutdown';

const watchSrc = () => {
  build({
    ...buildOptions,
    watch: true,
  }).catch((error) => console.error(error));
};

const watchTemplates = async () => {
  const service = await startService();

  let building = false;

  const watcher = watch('templates');

  gracefulShutdown(() => {
    watcher.close();
    service.stop();
  });

  watcher.on('all', () => {
    if (!building) {
      console.log('rebuilding templates');
      building = true;
      rimraf('./dist/templates', async () => {
        try {
          await copy('templates', 'dist/templates');

          const paths = (await readdir('templates')).map((pth) =>
            join('templates', pth, 'aqu.template.ts'),
          );
          const isEntry = await Promise.all(
            paths.map((pth) => pathExists(pth)),
          );

          const entryPoints = paths.filter((_, index) => isEntry[index]);

          await Promise.all(
            entryPoints.map(async (entry) => {
              const parsedEntry = parse(entry);
              const dir = join('dist', dirname(relative(process.cwd(), entry)));
              await service.build({
                ...buildOptions,
                entryPoints: [entry],
                outfile: join(dir, `${parsedEntry.name}.js`),
              });

              await remove(join(dir, parsedEntry.base));
            }),
          );
        } catch (err) {
          console.error(err);
        } finally {
          building = false;
        }
      });
    }
  });
};

const main = () => {
  watchSrc();
  watchTemplates();
};

main();
