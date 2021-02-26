import { runRevert } from './runRevert';

export const revertLint = runRevert('lint', 'lint', 'aqu lint', ['.eslintrc']);
