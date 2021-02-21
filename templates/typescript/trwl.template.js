import packageVersion from "../_utils/packageVersion";

/**
 * @type {import('../../src/typings').TemplateScript}
 */
const templateScript = {
    initialize: async () => ({
        extend: "_base",
        filesToMergePaths: ["package.json", "./example/package.json"],
        templateFilePaths: [
            "package.json",
            "./example/tsconfig.json",
            "./example/src/index.ts",
            "./example/package.json",
        ],
        customArgs: {
            ["versions.typescript"]: await packageVersion("typescript"),
        },
    }),
};

export default templateScript;
