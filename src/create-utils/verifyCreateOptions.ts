import * as Yup from 'yup';

import { verifyPackageName } from './verifyPackageName';
import logger from '../logger';
import { creationOptionInvalid, creationOptionNotSpecfied, schemaValidationError } from '../messages.json';
import { CreateOptions } from '../typings';

export const verifyCreateOptions = async (
    obj: CreateOptions,
    availableLicenses: string[],
    availableTemplates: string[],
) => {
    const createOptionsSchema = Yup.object().shape({
        name: Yup.string().test(verifyPackageName),
        description: Yup.string().notRequired(),
        author: Yup.string().required(creationOptionNotSpecfied),
        repo: Yup.string().url().required(creationOptionNotSpecfied),
        license: Yup.string().required(creationOptionNotSpecfied).oneOf(availableLicenses, creationOptionInvalid),
        template: Yup.string().required(creationOptionNotSpecfied).oneOf(availableTemplates, creationOptionInvalid),
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
