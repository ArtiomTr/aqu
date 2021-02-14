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
    /** Output format. Generates multiple outputs, each for format. */
    format?: Format | Format[];
    /** How cjs should be generated - in production or development? If mixed is specified, will generate both with one entrypoint. */
    cjsMode?: Mode;
    /** Should declarations be generated and bundled? */
    declaration?: DeclarationType;
    /** Should do typescript check? */
    check?: boolean;
};

export type VerifiedTrwlOptions = Omit<Required<TrwlOptions>, "input" | "format"> & {
    input: string[];
    format: Format[];
};

export type DeclarationType = "bundle" | "normal" | "none";

export type Mode = "production" | "development" | "mixed";

export type RawTrwlOptions = TrwlOptions | Array<TrwlOptions>;
