import { ejectConfig } from './ejectConfig';
import { ejectPackageScript } from './ejectPackageScript';
import { createEslintConfig } from '../config/createEslintConfig';

export const ejectLint = async () => {
  await ejectConfig('.eslintrc', await createEslintConfig());
  await ejectPackageScript('lint', 'aqu lint', 'eslint .');
};
