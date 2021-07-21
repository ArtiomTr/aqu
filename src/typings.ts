import { WatchOptions } from 'chokidar';
import { Command } from 'commander';
import { EntryPointConfig } from 'dts-bundle-generator';
import { BuildOptions } from 'esbuild';
import { Format } from 'esbuild';

export type AquOptions = {
  /** Library name */
  name?: string;
  /** Bundle entrypoints */
  input: string | string[];
  /** Output directory */
  outdir?: string;
  /** Output file. Could not use when multiple entrypoints specified */
  outfile?: string;
  /** Output format. Generates multiple outputs, each for format */
  format?: Format | Format[];
  /** How cjs should be generated - in production or development? If mixed is specified, will generate both with one entrypoint */
  cjsMode?: Mode;
  /** Should declarations be generated and bundled? */
  declaration?: DeclarationType;
  /** Path to typescript config */
  tsconfig?: string;
  /** Incremental build */
  incremental?: boolean;
  /** Mark all node_modules as external */
  externalNodeModules?: boolean;
  /** Esbuild options @see https://esbuild.github.io/api/#simple-options */
  buildOptions?: BuildOptions;
  /** Custom watch options @see https://github.com/paulmillr/chokidar#readme */
  watchOptions?: WatchOptions;
  /** Custom dts-bundle-generator-options @see https://github.com/timocov/dts-bundle-generator#usage */
  dtsBundleGeneratorOptions?: DtsBundleGeneratorOptions;
};

export type DtsBundleGeneratorOptions = Omit<EntryPointConfig, 'filePath'>;

export type VerifiedAquOptions = Omit<
  Required<AquOptions>,
  'input' | 'format'
> & {
  input: string[];
  format: Format[];
};

export type DeclarationType = 'bundle' | 'normal' | 'none';

export type Mode = 'production' | 'development' | 'mixed';

export type RawAquOptions = AquOptions | Array<AquOptions>;

export type AquCommand<T> = {
  name: string;
  description: string;
  action: (
    options: T,
    config: Array<VerifiedAquOptions>,
    command: Command,
  ) => void | Promise<void>;
  options: Array<AquCommandOptions>;
  allowUnknownOptions?: boolean;
};

export type AquCommandOptions = {
  flag: {
    full: string;
    short?: string;
    placeholder?: string;
  };
  multiple?: boolean;
  defaultValue?: string | boolean;
  description: string;
};

export type TemplateInitializationOptions = {
  extend?: string;
  templateFilePaths?: string[];
  filesToMergePaths?: string[];
  customArgs?: Record<string, unknown>;
};

export type TemplateScript = {
  initialize: (
    packageManager: string,
  ) => Promise<TemplateInitializationOptions>;
};

export type CreateOptions = {
  name: string;
  description: string;
  author: string;
  repo: string;
  license: string;
  template: string;
};
