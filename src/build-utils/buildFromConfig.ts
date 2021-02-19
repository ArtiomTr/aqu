import { Service } from "esbuild";

import { createBuildOptions } from "./createBuildOptions";
import { createMixedCjsEntrypoint } from "./createMixedCjsEntrypoint";
import { emitDeclarations } from "./emitDeclarations";
import { showSkippedStep } from "./showSkippedStep";
import { Progress } from "../logger";
import { steps } from "../messages.json";
import { VerifiedTrwlOptions } from "../typings";

export const buildFromConfig = async (config: VerifiedTrwlOptions, service: Service) => {
    const { cjsMode, outdir, name, format, declaration } = config;

    if (format.includes("cjs") && cjsMode === "mixed") {
        createMixedCjsEntrypoint(outdir, name);
    }

    const buildConfigs = await createBuildOptions(config);

    const esbuildProgress = new Progress(steps.esbuild);

    try {
        await Promise.all(buildConfigs.map((config) => service.build(config)));

        esbuildProgress.succeed();
    } catch (err) {
        esbuildProgress.fail();
        showSkippedStep(declaration);
        throw err;
    }

    await emitDeclarations(config);
};
