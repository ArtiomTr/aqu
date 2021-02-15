import logger from "../logger";

export const gracefulShutdown = (cleanup: () => void) => {
    const onShutdown = () => {
        logger.info("✨ Shutting down gracefully");
        logger.info("   Stopping esbuild service and closing watcher");
        cleanup();
    };

    process.on("SIGTERM", onShutdown);
    process.on("SIGINT", onShutdown);
    process.on("SIGQUIT", onShutdown);
};
