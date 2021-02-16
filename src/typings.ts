import { WatchOptions } from "chokidar";
import { Command } from "commander";
import { BuildOptions } from "esbuild";
import { Format } from "esbuild";

export type TrwlOptions = {
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
};

export type VerifiedTrwlOptions = Omit<Required<TrwlOptions>, "input" | "format"> & {
    input: string[];
    format: Format[];
};

export type DeclarationType = "bundle" | "normal" | "none";

export type Mode = "production" | "development" | "mixed";

export type RawTrwlOptions = TrwlOptions | Array<TrwlOptions>;

export type TrwlCommand<T> = {
    name: string;
    description: string;
    action: (options: T, config: Array<VerifiedTrwlOptions>, command: Command) => void | Promise<void>;
    options: Array<TrwlCommandOptions>;
    allowUnknownOptions?: boolean;
};

export type TrwlCommandOptions = {
    flag: {
        full: string;
        short?: string;
        placeholder?: string;
    };
    multiple?: boolean;
    defaultValue?: string | boolean;
    description: string;
};
