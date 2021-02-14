import type { BuildOptions } from "esbuild";

export const createBuildOptions = (): BuildOptions => {
    return {
        bundle: true,
    };
};
