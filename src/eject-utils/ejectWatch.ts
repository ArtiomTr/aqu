import { prompt } from 'inquirer';

import { buildEslintConfig } from './ejectBuild';
import { ejectNewScript } from './ejectNewScript';
import { ejectPackageScript } from './ejectPackageScript';
import { ejectWarn } from '../messages.json';
import { VerifiedAquOptions } from '../typings';
import { appResolve } from '../utils/appResolve';
import { insertArgs } from '../utils/insertArgs';
import { lowPriorityWriteFile } from '../utils/lowPriorityWriteFile';

const buildScriptSource = `
var esbuild = require('esbuild');
var NodeResolve = require('@esbuild-plugins/node-resolve').default;
var rimraf = require('rimraf');
var path = require('path');

var nodeResolveExternal = NodeResolve({
  extensions: ['.ts', '.js', '.tsx', '.jsx', '.cjs', '.mjs'],
  onResolved: (resolved) => {
    if (resolved.includes('node_modules')) {
      return {
        external: true,
      };
    }
    return resolved;
  },
});

var configurations = $\{configs};

function asyncRimraf(path) {
  return new Promise((resolve, reject) => {
    rimraf(path, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function main() {
  Promise.all(
    configurations.map((config) => {
      var dir = config.outdir || path.dirname(config.outfile);
      asyncRimraf(dir).catch(() => {
        console.log('Unable to delete directory', dir);
      });
    }),
  ).then(() => {
    configurations.forEach((config) => esbuild.build({ ...config, watch: true }));
  });
}

main();
`;

export const ejectWatch = async (
  configs: VerifiedAquOptions[],
  skipAllWarnings?: boolean,
) => {
  if (!skipAllWarnings) {
    const result = await prompt({
      type: 'confirm',
      message: insertArgs(ejectWarn, {
        script: 'watch',
      }),
      name: 'confirm',
    });

    if (!result.confirm) {
      return;
    }
  }

  await ejectNewScript(
    './scripts/watch.js',
    buildScriptSource,
    configs,
    skipAllWarnings,
  );
  await ejectPackageScript(
    'start',
    'aqu watch',
    'node ./scripts/watch.js',
    skipAllWarnings,
  );
  await lowPriorityWriteFile(
    appResolve('./scripts/.eslintrc'),
    JSON.stringify(buildEslintConfig, null, 2),
  );
};
