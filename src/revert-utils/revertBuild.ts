import { runRevert } from './runRevert';

export const revertBuild = runRevert('build', 'build', 'aqu build', ['./scripts/build.js']);
