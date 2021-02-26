import { runRevert } from './runRevert';

export const revertWatch = runRevert('watch', 'start', 'aqu watch', [
  './scripts/watch.js',
]);
