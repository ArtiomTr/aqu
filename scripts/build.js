/** @type {import('esbuild').BuildOptions} */
var buildOptions = {
    entryPoints: ["./src/index.ts"],
    outfile: "./dist/trwl.js",
    bundle: true,
    platform: "node",
    external: ["commander"],
};

require("esbuild")
    .build(buildOptions)
    .catch((error) => console.error(error));

module.exports = {
    buildOptions,
};
