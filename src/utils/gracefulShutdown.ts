import logger from '../logger';
import { gracefulShutdownDetails, gracefulShutdownMessage } from '../messages.json';

const NODE_EXIT_EVENTS: Array<NodeJS.Signals | string | symbol> = ['SIGTERM', 'SIGINT', 'SIGQUIT', 'uncaughtException'];

export const gracefulShutdown = (cleanup: () => void) => {
	const onShutdown = () => {
		logger.info(gracefulShutdownMessage);
		logger.info(gracefulShutdownDetails);
		cleanup();
	};

	NODE_EXIT_EVENTS.forEach((event) => process.on(event, onShutdown));

	return () => NODE_EXIT_EVENTS.forEach((event) => process.removeListener(event, onShutdown));
};
