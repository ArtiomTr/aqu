import type { TrwlOptions } from "./typings";

export const CONFIG_EXTENSIONS = ["ts", "js", "mjs", "cjs", "json"];

export const ENTRYPOINT_EXTENSIONS = ["ts", "tsx", "js", "jsx", "cjs", "mjs"];

export const AVAILABLE_OUTPUT_FORMATS = ["iife", "cjs", "esm"];

export const AVAILABLE_CJS_MODES = ["production", "development", "mixed"];

export const AVAILABLE_DECLARATION_MODES = ["bundle", "normal", "none"];

export const DEFAULT_OPTIONS: Partial<TrwlOptions> = {
    format: ["cjs", "esm"],
    cjsMode: "mixed",
    outdir: "dist",
    declaration: "bundle",
    check: true,
    watchOptions: {
        ignored: ["node_modules/**", "dist/**", "build/**", "out/**"],
        followSymlinks: false,
    },
};
