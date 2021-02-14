import { parse } from "path";

import uniq from "lodash/uniq";
import * as Yup from "yup";

import { AVAILABLE_CJS_MODES, AVAILABLE_DECLARATION_MODES, AVAILABLE_OUTPUT_FORMATS } from "../constants";
import logger, { ErrorLevel } from "../logger";
import { requiredField, requiredInputField, unexpectedlyMissingField } from "../messages.json";
import { TrwlOptions, VerifiedTrwlOptions } from "../typings";

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
        check: Yup.bool().required(unexpectedlyMissingField),
    })
    .test((values, options) => {
        if (!values.outdir && !values.outfile) {
            return options.createError({ path: "outdir", message: "No output path specified." });
        }
        return true;
    })
    .test((values, options) => {
        if (
            values.outfile &&
            ((typeof values.input !== "string" && values.input.length > 1) ||
                (values.cjsMode === "mixed" && values.format.includes("cjs")) ||
                (typeof values.format !== "string" && values.format.length > 1))
        ) {
            return options.createError({
                path: "outfile",
                message: "Cannot specify outfile because more than one entrypoint will be generated",
            });
        }

        return true;
    })
    .test((values, options) => {
        if (
            typeof values.input !== "string" &&
            values.input.length > 1 &&
            values.format.includes("cjs") &&
            values.cjsMode === "mixed"
        ) {
            return options.createError({
                path: "input",
                message:
                    "Cannot use mixed cjsMode with multiple entrypoints. Please use 1 entrypoint or switch to other cjsMode.",
            });
        }

        return true;
    });

export const verifyConfig = async (config: TrwlOptions): Promise<VerifiedTrwlOptions> => {
    try {
        await optionSchema.validate(config);

        const outdir = !config.outdir ? parse(config.outfile!).dir : config.outdir;

        const verifiedConfig = {
            ...config,
            outdir,
            format: Array.isArray(config.format) ? uniq(config.format) : [config.format],
            input: Array.isArray(config.input) ? uniq(config.input) : [config.input],
        } as VerifiedTrwlOptions;

        return verifiedConfig;
    } catch (err) {
        if (err instanceof Yup.ValidationError) {
            logger.error(ErrorLevel.FATAL, "Schema validation failed:", err.message);
        }
        logger.error(ErrorLevel.FATAL, err);
    }
};
