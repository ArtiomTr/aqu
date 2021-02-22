import logger from '../logger';

export default function assert(
  condition: unknown,
  message: string,
): asserts condition {
  if (condition) {
    return;
  }

  logger.fatal('Assertion error:', message);
}
