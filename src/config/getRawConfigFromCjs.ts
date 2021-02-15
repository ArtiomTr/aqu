import { getDefaultFromCjs } from "./getDefaultFromCjs";
import logger, { ErrorLevel } from "../logger";
import { RawTrwlOptions } from "../typings";

export const getRawConfigFromCjs = (path: string): RawTrwlOptions => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const config = require(path);
        return getDefaultFromCjs(config) as RawTrwlOptions;
    } catch (err) {
        logger.error(ErrorLevel.FATAL, err);
    }
};
