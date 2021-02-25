var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (callback, module2) => () => {
  if (!module2) {
    module2 = {exports: {}};
    callback(module2.exports, module2);
  }
  return module2.exports;
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
var require_build = __commonJS((exports2, module2) => {
  var NodeResolve = require("@esbuild-plugins/node-resolve").default;
  var buildOptions2 = {
    entryPoints: ["./src/index.ts"],
    outfile: "./dist/aqu.js",
    bundle: true,
    target: "node10.16.0",
    platform: "node",
    banner: "#!/usr/bin/env node\n",
    plugins: [
      NodeResolve({
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
    external: ["jest-watch-typeahead/testname", "jest-watch-typeahead/filename"]
  };
  var othOptions = {
    templatesFolder: "./templates"
  };
  require("esbuild").build(buildOptions2).catch((error) => console.error(error));
  module2.exports = {
    buildOptions: buildOptions2,
    othOptions
  };
});

// scripts/src/watch.ts
var import_path = __toModule(require("path"));
var import_chokidar = __toModule(require("chokidar"));
var import_esbuild = __toModule(require("esbuild"));
var import_fs_extra = __toModule(require("fs-extra"));
var import_rimraf = __toModule(require("rimraf"));
var import_build = __toModule(require_build());

// src/logger.ts
var import_chalk = __toModule(require("chalk"));
var import_ora = __toModule(require("ora"));

// package.json
var name = "aqu";

// src/logger.ts
var logger = {
  error: (...args) => {
    console.error(import_chalk.default.red(`[${name}]`, ...args));
  },
  fatal: (...args) => {
    logger.error(...args);
    process.exit(1);
  },
  warn: (...args) => {
    console.warn(import_chalk.default.yellow(`[${name}] WARNING:`), ...args);
  },
  info: (...args) => {
    console.log(import_chalk.default.gray(`[${name}]:`), ...args);
  },
  success: (...args) => {
    console.log(import_chalk.default.green(`[${name}]:`, ...args));
  }
};
var logger_default = logger;

// src/messages.json
var gracefulShutdownMessage = "\u2728 Shutting down gracefully";
var gracefulShutdownDetails = "   Stopping esbuild service and closing watcher";

// src/utils/gracefulShutdown.ts
var gracefulShutdown = (cleanup) => {
  const onShutdown = () => {
    logger_default.info(gracefulShutdownMessage);
    logger_default.info(gracefulShutdownDetails);
    cleanup();
  };
  process.on("SIGTERM", onShutdown);
  process.on("SIGINT", onShutdown);
  process.on("SIGQUIT", onShutdown);
};

// scripts/src/watch.ts
var watchSrc = () => {
  import_esbuild.build({
    ...import_build.buildOptions,
    watch: true
  }).catch((error) => console.error(error));
};
var watchTemplates = async () => {
  const service = await import_esbuild.startService();
  let building = false;
  const watcher = import_chokidar.watch("templates");
  gracefulShutdown(() => {
    watcher.close();
    service.stop();
  });
  watcher.on("all", () => {
    if (!building) {
      console.log("rebuilding templates");
      building = true;
      import_rimraf.default("./dist/templates", async () => {
        try {
          await import_fs_extra.copy("templates", "dist/templates");
          const paths = (await import_fs_extra.readdir("templates")).map((pth) => import_path.join("templates", pth, "aqu.template.ts"));
          const isEntry = await Promise.all(paths.map((pth) => import_fs_extra.pathExists(pth)));
          const entryPoints = paths.filter((_, index) => isEntry[index]);
          await Promise.all(entryPoints.map(async (entry) => {
            const parsedEntry = import_path.parse(entry);
            const dir = import_path.join("dist", import_path.dirname(import_path.relative(process.cwd(), entry)));
            await service.build({
              ...import_build.buildOptions,
              entryPoints: [entry],
              outfile: import_path.join(dir, `${parsedEntry.name}.js`)
            });
            await import_fs_extra.remove(import_path.join(dir, parsedEntry.base));
          }));
        } catch (err) {
          console.error(err);
        } finally {
          building = false;
        }
      });
    }
  });
};
var main = () => {
  watchSrc();
  watchTemplates();
};
main();
