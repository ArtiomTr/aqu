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
        templateFilePaths: [
            "package.json",
            "./example/package.json",
            "./example/src/index.jsx",
            "./example/public/index.html",
        ],
        customArgs: {
            ["versions.reactDom"]: await packageVersion("react-dom"),
            ["versions.react"]: await packageVersion("react"),
            ["versions.reactScripts"]: await packageVersion("react-scripts"),
        },
    }),
};

export default templateScript;
