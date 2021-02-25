import { watch } from 'chokidar';
import { build, startService } from 'esbuild';
import rimraf from 'rimraf';

import { buildOptions, buildTemplates } from './build';
import { gracefulShutdown } from '../../src/utils/gracefulShutdown';

const watchSrc = () => {
  build({
    ...buildOptions.esbuild,
    watch: true,
  }).catch((error) => console.error(error));
};

const watchTemplates = async () => {
  const service = await startService();

  let building = false;

  const watcher = watch(buildOptions.templates.sourceDir);

  gracefulShutdown(() => {
    watcher.close();
    service.stop();
  });

  watcher.on('all', async () => {
    if (!building) {
      console.log('rebuilding templates');
      building = true;
      try {
        await buildTemplates(service);
      } catch (err) {
        console.error(err);
      } finally {
        building = false;
      }
    }
  });
};

const main = () => {
  rimraf(buildOptions.outdir, () => {
    watchSrc();
    watchTemplates();
  });
};

main();
