import { startService } from 'esbuild';

import { buildFromConfig } from '../build-utils/buildFromConfig';
import logger from '../logger';
import { commands } from '../messages.json';
import { options } from '../messages.json';
import { AquCommand } from '../typings';
import { deleteBuildDirs } from '../utils/deleteBuildDirs';

type BuildOptions = {
  NoCleanup: boolean;
};

const buildCommand: AquCommand<BuildOptions> = {
  name: 'build',
  description: commands.build,
  options: [
    {
      flag: {
        full: 'no-cleanup',
      },
      description: options.noCleanup,
    },
  ],
  action: async (options, config) => {
    if (!options.NoCleanup) {
      await deleteBuildDirs(config);
    }

    const service = await startService();

    try {
      await Promise.all(
        config.map((config) => buildFromConfig(config, service)),
      );
    } catch (err) {
      logger.fatal(err);
    } finally {
      service.stop();
      process.exit();
    }
  },
};

export default buildCommand;
