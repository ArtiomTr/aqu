import { getDefaultFromCjs } from "./getDefaultFromCjs";
import logger, { ErrorLevel } from "../logger";

export const getRawConfigFromCjs = <T>(path: string): T => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const config = require(path);
        return getDefaultFromCjs(config) as T;
    } catch (err) {
        logger.error(ErrorLevel.FATAL, err);
    }
};
