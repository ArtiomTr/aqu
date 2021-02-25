var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", {value: module2, enumerable: true})), module2);
};

// scripts/src/build.ts
__markAsModule(exports);
__export(exports, {
  buildOptions: () => buildOptions,
  buildTemplates: () => buildTemplates
});
var import_path = __toModule(require("path"));
var import_node_resolve = __toModule(require("@esbuild-plugins/node-resolve"));
var import_esbuild = __toModule(require("esbuild"));
var import_fs_extra = __toModule(require("fs-extra"));
var import_rimraf = __toModule(require("rimraf"));
var buildOptions = {
  outdir: "dist",
  templates: {
    sourceDir: "templates",
    outdir: "./dist/templates",
    templateScriptFilename: "aqu.template.ts"
  },
  esbuild: {
    entryPoints: ["./src/index.ts"],
    outfile: "./dist/aqu.js",
    bundle: true,
    target: "node10.16.0",
    platform: "node",
    banner: "#!/usr/bin/env node\n",
    plugins: [
      import_node_resolve.default({
        extensions: [".ts", ".js", ".tsx", ".jsx", ".cjs", ".mjs"],
        onResolved: (resolved) => {
          if (resolved.includes("node_modules")) {
            return {
              external: true
            };
          }
          return resolved;
        }
      })
    ],
    external: [
      "jest-watch-typeahead/testname",
      "jest-watch-typeahead/filename"
    ]
  }
};
var buildSrc = () => {
  import_esbuild.build(buildOptions.esbuild).catch((err) => console.error(err));
};
var buildTemplates = (service) => new Promise((resolve, reject) => {
  import_rimraf.default(buildOptions.templates.outdir, async () => {
    try {
      await import_fs_extra.copy(buildOptions.templates.sourceDir, buildOptions.templates.outdir);
      const paths = (await import_fs_extra.readdir(buildOptions.templates.sourceDir)).map((pth) => import_path.join(buildOptions.templates.sourceDir, pth, buildOptions.templates.templateScriptFilename));
      const isEntry = await Promise.all(paths.map((pth) => import_fs_extra.pathExists(pth)));
      const entryPoints = paths.filter((_, index) => isEntry[index]);
      await Promise.all(entryPoints.map(async (entry) => {
        const parsedEntry = import_path.parse(entry);
        const dir = import_path.join(buildOptions.templates.outdir, import_path.dirname(import_path.relative(buildOptions.templates.sourceDir, entry)));
        await service.build({
          ...buildOptions.esbuild,
          entryPoints: [entry],
          outfile: import_path.join(dir, `${parsedEntry.name}.js`)
        });
        await import_fs_extra.remove(import_path.join(dir, parsedEntry.base));
      }));
      resolve();
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
});
var main = () => {
  import_rimraf.default(buildOptions.outdir, async () => {
    buildSrc();
    const service = await import_esbuild.startService();
    try {
      buildTemplates(service);
    } catch (err) {
      console.error(err);
    } finally {
      service.stop();
    }
  });
};
main();
