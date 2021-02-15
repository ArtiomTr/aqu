const NodeResolve = require("@esbuild-plugins/node-resolve").default;

/** @type {import('esbuild').BuildOptions} */
var buildOptions = {
    entryPoints: ["./src/index.ts"],
    outfile: "./dist/trwl.js",
    bundle: true,
    target: "node10.16.0",
    platform: "node",
    banner: "#!/usr/bin/env node\n",
    plugins: [
        NodeResolve({
            extensions: [".ts", ".js", ".tsx", ".jsx", ".cjs", ".mjs"],
            onResolved: (resolved) => {
                if (resolved.includes("node_modules")) {
                    return {
                        external: true,
                    };
                }
                return resolved;
            },
        }),
    ],
    external: ["jest-watch-typeahead/testname", "jest-watch-typeahead/filename"],
};

require("esbuild")
    .build(buildOptions)
    .catch((error) => console.error(error));

module.exports = {
    buildOptions,
};
