import { extname, join } from "path";

import { generateDtsBundle } from "dts-bundle-generator";

import { defaultEmitDeclarations } from "./defaultEmitDeclarations";
import { Progress } from "../logger";
import { steps } from "../messages.json";
import { VerifiedTrwlOptions } from "../typings";
import { safeWriteFile } from "../utils/safeWriteFile";

const canHaveDeclarations = (filePath: string) => [".ts", ".tsx"].includes(extname(filePath));

export const emitDeclarations = async (config: VerifiedTrwlOptions) => {
    const { input, declaration, outfile, outdir, name } = config;

    if (input.some(canHaveDeclarations)) {
        if (declaration === "bundle") {
            const dtsProgress = new Progress(steps.dtsBundle);

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
            const dtsProgress = new Progress(steps.dtsStandard);

            defaultEmitDeclarations(input, outdir);

            dtsProgress.stop();
        }
    }
};