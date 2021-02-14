import logger, { ErrorLevel } from "../logger";

export default function assert(condition: unknown, message: string): asserts condition {
    if (condition) {
        return;
    }

    if (!condition) {
        logger.error(ErrorLevel.FATAL, "Assertion error:", message);
    }
}
