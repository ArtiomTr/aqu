import * as Yup from "yup";

import { verifyPackageName } from "./verifyPackageName";
import logger from "../logger";
import { schemaValidationError } from "../messages.json";
import { CreateOptions } from "../typings";

export const verifyCreateOptions = async (
    obj: CreateOptions,
    availableLicenses: string[],
    availableTemplates: string[]
) => {
    const createOptionsSchema = Yup.object().shape({
        name: Yup.string().test(verifyPackageName),
        description: Yup.string().notRequired(),
        author: Yup.string().required("${path} is not specified."),
        repo: Yup.string().url().required("${path} is not specified."),
        license: Yup.string()
            .required("${path} is not specified.")
            .oneOf(availableLicenses, "${value} is not valid ${path}"),
        template: Yup.string()
            .required("${path} is not specified.")
            .oneOf(availableTemplates, "${value} is not valid ${path}"),
    });

    try {
        await createOptionsSchema.validate(obj);
    } catch (err) {
        if (err instanceof Yup.ValidationError) {
            logger.fatal(schemaValidationError, err.message);
        }
        logger.fatal(err);
    }
};
