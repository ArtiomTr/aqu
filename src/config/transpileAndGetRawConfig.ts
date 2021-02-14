import { build } from "esbuild";

import { getDefaultFromCjs } from "./getDefaultFromCjs";
import { RawTrwlOptions } from "../typings";

function evaluateCommonjsModule(module: string) {
    const exports = {};

    eval(module);

    return exports;
}

export const transpileAndGetRawConfig = async (path: string): Promise<RawTrwlOptions> => {
    const bundle = await build({
        entryPoints: [path],
        platform: "node",
        format: "cjs",
        outdir: "./",
        bundle: true,
        write: false,
        stdin: {
            contents: "",
        },
    });

    if (bundle.outputFiles.length > 1) {
        const outputFile = bundle.outputFiles[1];

        try {
            const config = getDefaultFromCjs(evaluateCommonjsModule(outputFile.text));
            return config as RawTrwlOptions;
        } catch (error) {
            console.error(error);
        }
    }

    throw new Error();
};
