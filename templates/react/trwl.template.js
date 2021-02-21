import packageVersion from "../_utils/packageVersion";

/**
 * @type {import('../../src/typings').TemplateScript}
 */
const templateScript = {
    initialize: async () => ({
        extend: "_base",
        filesToMergePaths: [
            "package.json",
            ".prettierrc",
            "./example/package.json",
        ],
        templateFilePaths: ["package.json", "./example/package.json"],
        customArgs: {
            ["versions.reactDom"]: await packageVersion("react-dom"),
            ["versions.react"]: await packageVersion("react"),
        },
    }),
};

export default templateScript;
