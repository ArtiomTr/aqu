import type { TemplateScript } from "../../src/typings";
import { getPackageVersion } from "../../src/utils/packageManager";

const templateScript: TemplateScript = {
  initialize: async (manager: string) => ({
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
      ["versions.reactDom"]: await getPackageVersion("react-dom", manager),
      ["versions.react"]: await getPackageVersion("react", manager),
      ["versions.reactScripts"]: await getPackageVersion(
        "react-scripts",
        manager
      ),
    },
  }),
};

export default templateScript;
