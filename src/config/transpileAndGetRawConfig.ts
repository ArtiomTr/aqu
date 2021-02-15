import { build } from "esbuild";

import { getDefaultFromCjs } from "./getDefaultFromCjs";
import logger, { ErrorLevel } from "../logger";

function evaluateCommonjsModule(module: string) {
    const exports = {};

    eval(module);

    return exports;
}

export const transpileAndGetRawConfig = async <T>(path: string): Promise<T> => {
    const bundle = await build({
        entryPoints: [path],
        platform: "node",
        format: "cjs",
        outdir: "__unique__folder",
        bundle: true,
        write: false,
    });

    if (bundle.outputFiles.length > 0) {
        const outputFile = bundle.outputFiles[0];

        try {
            const config = getDefaultFromCjs(evaluateCommonjsModule(outputFile.text));
            return config as T;
        } catch (error) {
            logger.error(ErrorLevel.FATAL, error);
        }
    }

    throw new Error();
};
