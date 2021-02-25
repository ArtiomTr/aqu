import type { TemplateScript } from "../../src/typings";
import { getPackageVersion } from "../../src/utils/packageManager";

const templateScript: TemplateScript = {
  initialize: async (manager: string) => ({
    extend: "_base",
    templateFilePaths: [
      "package.json",
      "./example/package.json",
      "./example/public/index.html",
      "./example/src/index.tsx",
    ],
    filesToMergePaths: ["package.json", "./example/package.json"],
    customArgs: {
      ["versions.typescript"]: await getPackageVersion("typescript", manager),
      ["versions.reactDom"]: await getPackageVersion("react-dom", manager),
      ["versions.react"]: await getPackageVersion("react", manager),
      ["versions.reactScripts"]: await getPackageVersion(
        "react-scripts",
        manager
      ),
      ["versions.reactTypes"]: await getPackageVersion("@types/react", manager),
      ["versions.reactDomTypes"]: await getPackageVersion(
        "@types/react-dom",
        manager
      ),
    },
  }),
};

export default templateScript;
