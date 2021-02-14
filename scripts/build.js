/** @type {import('esbuild').BuildOptions} */
var buildOptions = {
    entryPoints: ["./src/index.ts"],
    outfile: "./dist/trwl.js",
    bundle: true,
    target: "node10.16.0",
    platform: "node",
    external: ["commander", "esbuild"],
};

require("esbuild")
    .build(buildOptions)
    .catch((error) => console.error(error));

module.exports = {
    buildOptions,
};
