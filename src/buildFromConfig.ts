import { extname, join } from "path";

import { generateDtsBundle } from "dts-bundle-generator";
import { Service } from "esbuild";
import { BuildOptions } from "esbuild";

import { defaultEmitDeclarations } from "./utils/defaultEmitDeclarations";
import { safeWriteFile } from "./utils/safeWriteFile";
import { Progress } from "./logger";
import { VerifiedTrwlOptions } from "./typings";

const cjsMixedEntrypoint = `'use strict'

if(process.env.NODE_ENV === 'production') {
    module.exports = require('./{{ name }}.cjs.production.min.js');
} else {
    module.exports = require('./{{ name }}.cjs.development.js');
}
`;

const canHaveDeclarations = (filePath: string) => [".ts", ".tsx"].includes(extname(filePath));

export const buildFromConfig = async (config: VerifiedTrwlOptions, service: Service) => {
    const { format, name, cjsMode, input, outdir, outfile, declaration } = config;

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

    const esbuildProgress = new Progress("Building using esbuild");

    await Promise.all(normalConfigs.map((config) => service.build(config)));

    esbuildProgress.stop();

    if (input.some(canHaveDeclarations)) {
        if (declaration === "bundle") {
            const dtsProgress = new Progress("Generating declaration bundle");

            await Promise.all(
                generateDtsBundle(
                    input.filter(canHaveDeclarations).map((entry) => ({
                        filePath: entry,
                    })),
                    {
                        preferredConfigPath: join(process.cwd(), "tsconfig.json"),
                    }
                ).map((bundle) => {
                    return safeWriteFile(
                        outfile ? `${outfile.substring(outfile.lastIndexOf("."))}.d.ts` : join(outdir, `${name}.d.ts`),
                        bundle
                    );
                })
            );

            dtsProgress.stop();
        } else if (declaration === "normal") {
            const dtsProgress = new Progress("Emitting declarations");

            defaultEmitDeclarations(input, outdir);

            dtsProgress.stop();
        }
    }
};
