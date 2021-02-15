import { join } from "path";

import { BuildOptions } from "esbuild";

import { VerifiedTrwlOptions } from "../typings";

export const createBuildOptions = async (config: VerifiedTrwlOptions) => {
    const { format, name, cjsMode, input, outdir, outfile } = config;

    const normalConfigs: Array<BuildOptions> = [];

    const sharedOpts: Partial<BuildOptions> = {
        keepNames: true,
        bundle: true,
        entryPoints: input,
        sourcemap: "external",
    };

    if (format.includes("cjs")) {
        if (cjsMode === "development" || cjsMode === "mixed") {
            normalConfigs.push({
                ...sharedOpts,
                format: "cjs",
                outfile: outfile || join(outdir, `${name}.cjs.development.js`),
            });
        }
        if (cjsMode === "production" || cjsMode === "mixed") {
            normalConfigs.push({
                ...sharedOpts,
                minify: true,
                format: "cjs",
                outfile: outfile || join(outdir, `${name}.cjs.production.min.js`),
            });
        }
    }

    if (format.includes("esm")) {
        normalConfigs.push({
            ...sharedOpts,
            format: "esm",
            outfile: outfile || join(outdir, `${name}.esm.js`),
        });
    }

    if (format.includes("iife")) {
        normalConfigs.push({
            ...sharedOpts,
            format: "iife",
            outfile: outfile || join(outdir, `${name}.js`),
        });
    }

    return normalConfigs;
};
