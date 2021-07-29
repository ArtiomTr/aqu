var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// scripts/src/build.ts
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
    banner: {
      js: "#!/usr/bin/env node\n"
    },
    plugins: [
      (0, import_node_resolve.default)({
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
      "jest-watch-typeahead/filename",
      "esbuild"
    ]
  }
};
var buildSrc = () => {
  (0, import_esbuild.build)(buildOptions.esbuild).catch((err) => console.error(err));
};
var buildTemplates = () => new Promise((resolve, reject) => {
  (0, import_rimraf.default)(buildOptions.templates.outdir, async () => {
    try {
      await (0, import_fs_extra.copy)(buildOptions.templates.sourceDir, buildOptions.templates.outdir);
      const paths = (await (0, import_fs_extra.readdir)(buildOptions.templates.sourceDir)).map((pth) => (0, import_path.join)(buildOptions.templates.sourceDir, pth, buildOptions.templates.templateScriptFilename));
      const isEntry = await Promise.all(paths.map((pth) => (0, import_fs_extra.pathExists)(pth)));
      const entryPoints = paths.filter((_, index) => isEntry[index]);
      await Promise.all(entryPoints.map(async (entry) => {
        const parsedEntry = (0, import_path.parse)(entry);
        const dir = (0, import_path.join)(buildOptions.templates.outdir, (0, import_path.dirname)((0, import_path.relative)(buildOptions.templates.sourceDir, entry)));
        await (0, import_esbuild.build)(__spreadProps(__spreadValues({}, buildOptions.esbuild), {
          entryPoints: [entry],
          outfile: (0, import_path.join)(dir, `${parsedEntry.name}.js`)
        }));
        await (0, import_fs_extra.remove)((0, import_path.join)(dir, parsedEntry.base));
      }));
      resolve();
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
});
var main = () => {
  (0, import_rimraf.default)(buildOptions.outdir, async () => {
    buildSrc();
    buildTemplates();
  });
};
main();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  buildOptions,
  buildTemplates
});
