import { parse } from 'path';

import uniq from 'lodash/uniq';
import * as Yup from 'yup';

import { AVAILABLE_CJS_MODES, AVAILABLE_DECLARATION_MODES, AVAILABLE_OUTPUT_FORMATS } from '../constants';
import logger from '../logger';
import { requiredField, requiredInputField, unexpectedlyMissingField } from '../messages.json';
import {
    cannotSpecifyMultipleEntrypoints,
    noOutputPathSpecified,
    outfileCannotBeSpecified,
    schemaValidationError,
} from '../messages.json';
import { AquOptions, VerifiedAquOptions } from '../typings';

const optionSchema = Yup.object()
    .shape({
        name: Yup.string().required(requiredField),
        input: Yup.mixed().when({
            is: Array.isArray,
            then: Yup.array().of(Yup.string().required()),
            otherwise: Yup.string().required(requiredInputField),
        }),
        outdir: Yup.string().required(),
        outfile: Yup.string(),
        format: Yup.mixed().when({
            is: Array.isArray,
            then: Yup.array().of(Yup.string().required(unexpectedlyMissingField).oneOf(AVAILABLE_OUTPUT_FORMATS)),
            otherwise: Yup.string().required(unexpectedlyMissingField).oneOf(AVAILABLE_OUTPUT_FORMATS),
        }),
        cjsMode: Yup.string().required(unexpectedlyMissingField).oneOf(AVAILABLE_CJS_MODES),
        declaration: Yup.string().required(unexpectedlyMissingField).oneOf(AVAILABLE_DECLARATION_MODES),
        tsconfig: Yup.string().required(unexpectedlyMissingField),
        incremental: Yup.bool().required(unexpectedlyMissingField),
        externalNodeModules: Yup.bool().required(unexpectedlyMissingField),
        watchOptions: Yup.mixed().required(unexpectedlyMissingField),
        buildOptions: Yup.mixed(),
        dtsBundleGeneratorOptions: Yup.mixed(),
    })
    .test((values, options) => {
        if (!values.outdir && !values.outfile) {
            return options.createError({
                path: 'outdir',
                message: noOutputPathSpecified,
            });
        }
        return true;
    })
    .test((values, options) => {
        if (
            values.outfile &&
            ((typeof values.input !== 'string' && values.input && values.input.length > 1) ||
                (values.cjsMode === 'mixed' && values.format.includes('cjs')) ||
                (typeof values.format !== 'string' && values.format.length > 1))
        ) {
            return options.createError({
                path: 'outfile',
                message: outfileCannotBeSpecified,
            });
        }

        return true;
    })
    .test((values, options) => {
        if (
            typeof values.input !== 'string' &&
            values.input &&
            values.input.length > 1 &&
            values.format.includes('cjs') &&
            values.cjsMode === 'mixed'
        ) {
            return options.createError({
                path: 'input',
                message: cannotSpecifyMultipleEntrypoints,
            });
        }

        return true;
    });

export const verifyConfig = async (config: AquOptions): Promise<VerifiedAquOptions> => {
    try {
        await optionSchema.validate(config);

        const outdir = !config.outdir ? parse(config.outfile!).dir : config.outdir;

        const verifiedConfig = {
            ...config,
            outdir,
            format: Array.isArray(config.format) ? uniq(config.format) : [config.format],
            input: Array.isArray(config.input) ? uniq(config.input) : [config.input],
        } as VerifiedAquOptions;

        return verifiedConfig;
    } catch (err) {
        if (err instanceof Yup.ValidationError) {
            logger.fatal(schemaValidationError, err.message);
        }
        logger.fatal(err);
    }
};
