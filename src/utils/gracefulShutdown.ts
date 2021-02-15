import logger from "../logger";
import { gracefulShutdownDetails, gracefulShutdownMessage } from "../messages.json";

export const gracefulShutdown = (cleanup: () => void) => {
    const onShutdown = () => {
        logger.info(gracefulShutdownMessage);
        logger.info(gracefulShutdownDetails);
        cleanup();
    };

    process.on("SIGTERM", onShutdown);
    process.on("SIGINT", onShutdown);
    process.on("SIGQUIT", onShutdown);
};
