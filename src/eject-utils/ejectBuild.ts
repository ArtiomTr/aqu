import type { Linter } from 'eslint';
import { prompt } from 'inquirer';

import { ejectNewScript } from './ejectNewScript';
import { ejectPackageScript } from './ejectPackageScript';
import { VerifiedAquOptions } from '../typings';
import { appResolve } from '../utils/appResolve';
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
    Promise.all(configurations.map((config) => esbuild.build(config)))
      .then(() => {
        console.log('✔ Build successfull');
        process.exit(0);
      })
      .catch((err) => {
        console.error('❌ Build failed');
        process.exit(1);
      });
  });
}

main();
`;

export const buildEslintConfig: Linter.Config = {
  root: false,
  env: {
    node: true,
  },
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-var-requires': 'off',
  },
};

export const ejectBuild = async (
  configs: VerifiedAquOptions[],
  skipAllWarnings?: boolean,
) => {
  if (!skipAllWarnings) {
    const result = await prompt({
      type: 'confirm',
      message:
        'Ejecting build script will result in functionality loss - no declarations will be generated. Continue?',
      name: 'confirm',
    });

    if (!result.confirm) {
      return;
    }
  }

  await ejectNewScript(
    './scripts/build.js',
    buildScriptSource,
    configs,
    skipAllWarnings,
  );
  await ejectPackageScript(
    'build',
    'aqu build',
    'node ./scripts/build.js',
    skipAllWarnings,
  );
  await lowPriorityWriteFile(
    appResolve('./scripts/.eslintrc'),
    JSON.stringify(buildEslintConfig, null, 2),
  );
};
