import { join, resolve } from 'path';

import type { AquOptions } from './typings';

export const CONFIG_EXTENSIONS = ['ts', 'js', 'mjs', 'cjs', 'json'];

export const CONFIG_NAMES = [
  ...CONFIG_EXTENSIONS.map((ext) => `aqu.config.${ext}`),
  '.aqurc',
];

export const ENTRYPOINT_EXTENSIONS = ['ts', 'tsx', 'js', 'jsx', 'cjs', 'mjs'];

export const AVAILABLE_OUTPUT_FORMATS = ['iife', 'cjs', 'esm'];

export const AVAILABLE_CJS_MODES = ['production', 'development', 'mixed'];

export const AVAILABLE_DECLARATION_MODES = ['bundle', 'normal', 'none'];

export const templatesPath = resolve(__dirname, '..', 'templates');

export const DEFAULT_OPTIONS: Omit<
  Required<AquOptions>,
  'input' | 'name' | 'outfile'
> = {
  format: ['cjs', 'esm'],
  cjsMode: 'mixed',
  outdir: 'dist',
  declaration: 'bundle',
  externalNodeModules: true,
  tsconfig: join(process.cwd(), 'tsconfig.json'),
  incremental: true,
  buildOptions: {},
  watchOptions: {
    ignored: ['node_modules/**', 'dist/**', 'build/**', 'out/**'],
    followSymlinks: false,
  },
};
