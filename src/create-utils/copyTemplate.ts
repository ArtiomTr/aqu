import { join, resolve } from "path";

import { copy, ensureDir, readdir, readFile, stat, writeFile } from "fs-extra";

import { TemplateInitializationOptions } from "../typings";
import { insertArgs } from "../utils/insertArgs";
import { mergeFiles } from "../utils/mergeFiles";

const banFiles = ["trwl.template.js"];

export const copyTemplate = async (
    from: string,
    to: string,
    options: TemplateInitializationOptions,
    args: Record<string, unknown>
) => {
    await ensureDir(to);

    const { filesToMergePaths = [], templateFilePaths = [] } = options;

    const templateFiles = await readdir(from);
    const existingFiles = await readdir(to);

    const isDirs = await Promise.all(
        templateFiles.map((file) => stat(join(from, file)).then((fileStats) => fileStats.isDirectory()))
    );

    await Promise.all(
        templateFiles.map(async (templateFile, index) => {
            if (banFiles.includes(templateFile)) return;

            const resolvedPath = resolve(to, templateFile);

            if (isDirs[index]) {
                await copyTemplate(join(from, templateFile), join(to, templateFile), options, args);
            } else if (existingFiles.includes(templateFile) && filesToMergePaths.includes(resolvedPath)) {
                const file = await mergeFiles(join(to, templateFile), join(from, templateFile));

                let contents = JSON.stringify(file, null, 4);

                if (templateFilePaths.includes(resolvedPath)) {
                    contents = insertArgs(contents, args);
                }

                await writeFile(join(to, templateFile), contents);
            } else if (templateFilePaths.includes(resolvedPath)) {
                const contents = await readFile(join(from, templateFile));

                await writeFile(join(to, templateFile), insertArgs(contents.toString(), args));
            } else {
                await copy(join(from, templateFile), join(to, templateFile));
            }
        })
    );
};
