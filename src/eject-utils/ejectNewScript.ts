import { relative } from 'path';

import flatten from 'lodash/flatten';
import { Plugin } from 'esbuild';

import { createBuildOptions } from '../build-utils/createBuildOptions';
import { VerifiedAquOptions } from '../typings';
import { appDir } from '../utils/appResolve';
import { insertArgs } from '../utils/insertArgs';
import { writeFileWithWarning } from '../utils/writeFileWithWarning';

export const ejectNewScript = async (
    path: string,
    text: string,
    configs: VerifiedAquOptions[],
    skipWarning?: boolean,
) => {
    const buildConfigs = flatten(await Promise.all(configs.map((config) => createBuildOptions(config))));

    buildConfigs.map((config) => {
        config.plugins = config.plugins?.map((plugin) =>
            plugin.name === 'node-resolve' ? ('${nodeResolve}' as unknown as Plugin) : plugin,
        );
        delete config.logLevel;
    });

    const newText = insertArgs(text, {
        configs: insertArgs(
            JSON.stringify(
                buildConfigs,
                (key, value) => {
                    if (['outdir', 'outfile', 'tsconfig'].includes(key)) {
                        return relative(appDir, value);
                    }
                    if (key === 'entryPoints') {
                        return value.map((entrypoint: string) => relative(appDir, entrypoint));
                    }
                    return value;
                },
                2,
            ).replace(/"\$\{nodeResolve\}"/g, '${nodeResolve}'),
            {
                nodeResolve: 'nodeResolveExternal',
            },
        ),
    });

    await writeFileWithWarning(path, newText, skipWarning);
};
