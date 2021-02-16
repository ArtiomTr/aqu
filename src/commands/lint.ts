import { relative } from "path";

import { ESLint, Linter } from "eslint";

import { createEslintConfig } from "../config/createEslintConfig";
import { loadAndResolveConfig } from "../config/loadAndResolveConfig";
import { CONFIG_EXTENSIONS } from "../constants";
import logger, { ErrorLevel } from "../logger";
import { TrwlCommand } from "../typings";
import assert from "../utils/assert";
import { deepMerge } from "../utils/deepMerge";
import { getInputDirs } from "../utils/getInputDirs";
import { safeWriteFile } from "../utils/safeWriteFile";

const availableConfigNames = [...CONFIG_EXTENSIONS.map((ext) => `.eslintrc.${ext}`), ".eslintrc"];

export type LintOptions = {
    maxWarnings: string;
    ignorePattern: string[];
    cacheLocation: string;
    reportFile: string;
    Fix: boolean;
    FixDryRun: boolean;
    Cache: boolean;
};

const lintCommand: TrwlCommand<LintOptions> = {
    name: "lint",
    description: "Lint using eslint",
    options: [
        {
            flag: {
                full: "max-warnings",
                placeholder: "count",
            },
            description: "Number of warnings to trigger nonzero exit code. Default: infinity",
        },
        {
            flag: {
                full: "fix",
            },
            description: "Automatically fix problems",
        },
        {
            flag: {
                full: "fix-dry-run",
            },
            description: "Automatically fix problems without saving the changes to the file system",
        },
        {
            flag: {
                full: "cache",
            },
            description: "Only check changed files - default: false",
        },
        {
            flag: {
                full: "cache-location",
                placeholder: "path",
            },
            description: "Path to the cache file or directory",
        },
        {
            flag: {
                full: "report-file",
                placeholder: "path",
            },
            description: "Specify file to write report to",
        },
    ],
    action: async (options, configs, command) => {
        let maxWarnings = Infinity;

        if (options.maxWarnings) {
            maxWarnings = parseInt(options.maxWarnings);

            assert(
                !Number.isNaN(maxWarnings),
                `Specified argument for "maxWarnings" ${options.maxWarnings} is not of number type`
            );
        }

        const defaultConfig = await createEslintConfig();

        const providedConfigs = await loadAndResolveConfig<Linter.Config>({
            availableConfigNames,
            packageJsonProp: "eslint",
        });

        const eslintConfig = deepMerge(defaultConfig, ...providedConfigs);

        let dirs = command.args;

        if (!dirs || dirs.length === 0) {
            const defaultDirs = getInputDirs(configs).map((dir) => relative(process.cwd(), dir));
            defaultDirs.push("test");

            logger.warn(
                `No directories specified. Defaulting to "trwl lint ${defaultDirs.join(
                    " "
                )}" (entrypoint directories + test dir)`
            );

            dirs = defaultDirs;
        }

        const eslintInstance = new ESLint({
            baseConfig: eslintConfig,
            fix: options.Fix || options.FixDryRun,
            errorOnUnmatchedPattern: false,
            extensions: [".ts", ".tsx", ".cjs", ".mjs", ".js", ".jsx", ".json"],
            cache: options.Cache,
            cacheLocation: options.cacheLocation,
        });

        const report = await eslintInstance.lintFiles(dirs);

        if (options.Fix && !options.FixDryRun) {
            await ESLint.outputFixes(report);
        }

        if (report.some((result) => result.messages.length > 0)) {
            logger.info((await eslintInstance.loadFormatter()).format(report));
        } else {
            logger.success("Successful lint");
        }

        if (options.reportFile) {
            await safeWriteFile(options.reportFile, (await eslintInstance.loadFormatter("json")).format(report));
        }

        const errorCount = report.reduce((acc, cur) => acc + cur.errorCount, 0);
        const warningCount = report.reduce((acc, cur) => acc + cur.warningCount, 0);

        if (errorCount > 0) {
            process.exit(1);
        } else if (warningCount > maxWarnings) {
            logger.error(
                ErrorLevel.FATAL,
                `Received ${warningCount} warnings, which is more than specified threshold - ${maxWarnings}. Exiting with code 1.`
            );
        }
    },
};

export default lintCommand;
