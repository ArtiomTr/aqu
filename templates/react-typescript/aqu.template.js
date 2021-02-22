import packageVersion from "../_utils/packageVersion";

/**
 * @type {import('../../src/typings').TemplateScript}
 */
const templateScript = {
    initialize: async () => ({
        extend: "_base",
        templateFilePaths: [
            "package.json",
            "./example/package.json",
            "./example/public/index.html",
            "./example/src/index.tsx",
        ],
        filesToMergePaths: ["package.json", "./example/package.json"],
        customArgs: {
            ["versions.typescript"]: await packageVersion("typescript"),
            ["versions.reactDom"]: await packageVersion("react-dom"),
            ["versions.react"]: await packageVersion("react"),
            ["versions.reactScripts"]: await packageVersion("react-scripts"),
            ["versions.reactTypes"]: await packageVersion("@types/react"),
            ["versions.reactDomTypes"]: await packageVersion("@types/react-dom"),
        },
    }),
};

export default templateScript;
