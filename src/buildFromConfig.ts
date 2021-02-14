import { join } from "path";

import { Service } from "esbuild";
import { BuildOptions } from "esbuild";

import { safeWriteFile } from "./utils/safeWriteFile";
import { VerifiedTrwlOptions } from "./typings";

const cjsMixedEntrypoint = `'use strict'

if(process.env.NODE_ENV === 'production') {
    module.exports = require('./{{ name }}.cjs.production.min.js');
} else {
    module.exports = require('./{{ name }}.cjs.development.js');
}
`;

export const buildFromConfig = async (config: VerifiedTrwlOptions, service: Service) => {
    const { format, name, cjsMode, input, outdir, outfile } = config;

    const normalConfigs: Array<BuildOptions> = [];

    const sharedOpts: Partial<BuildOptions> = {
        keepNames: true,
        bundle: true,
        entryPoints: input,
        sourcemap: "external",
    };

    if (format.includes("cjs")) {
        if (cjsMode === "mixed") {
            await safeWriteFile(join(outdir, "index.js"), cjsMixedEntrypoint.replace(/\{\{ name \}\}/g, name));
        }

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

    return await Promise.all(normalConfigs.map((config) => service.build(config)));
};
