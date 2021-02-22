import { join, resolve } from "path";

import { copyTemplate } from "./copyTemplate";
import { transpileAndGetRawConfig } from "../config/transpileAndGetRawConfig";
import { templatesPath } from "../constants";
import logger from "../logger";
import { templateLoadLoop } from "../messages.json";
import { CreateOptions, TemplateInitializationOptions, TemplateScript } from "../typings";
import assert from "../utils/assert";
import { insertArgs } from "../utils/insertArgs";

export const loadTemplate = async (
    templateOptions: CreateOptions,
    githubUser: string | undefined,
    loadedTemplates: Set<string> = new Set<string>()
) => {
    const { name, template } = templateOptions;

    loadedTemplates.add(template);

    const scriptPath = join(templatesPath, template, "aqu.template.js");

    let options: TemplateInitializationOptions = {};

    try {
        const templateScript = await transpileAndGetRawConfig<TemplateScript>(scriptPath);

        options = await templateScript.initialize();

        if (options.templateFilePaths) {
            options.templateFilePaths = options.templateFilePaths.map((path) => resolve(process.cwd(), name, path));
        }

        if (options.filesToMergePaths) {
            options.filesToMergePaths = options.filesToMergePaths.map((path) => resolve(process.cwd(), name, path));
        }
    } catch (err) {
        logger.error(err);
    }

    if (options.extend) {
        assert(
            !loadedTemplates.has(options.extend),
            insertArgs(templateLoadLoop, {
                template,
                loop: [...Array.from(loadedTemplates), options.extend].join(" → "),
            })
        );

        await loadTemplate({ ...templateOptions, template: options.extend }, githubUser, loadedTemplates);
    }

    await copyTemplate(join(templatesPath, template), join(process.cwd(), name), options, {
        ...templateOptions,
        ...options.customArgs,
        githubUser,
    });
};
