import { ejectConfig } from './ejectConfig';
import { ejectPackageScript } from './ejectPackageScript';
import { createEslintConfig } from '../config/createEslintConfig';

export const ejectLint = async (skipAllWarnings?: boolean) => {
	await ejectConfig('.eslintrc', await createEslintConfig(), skipAllWarnings);
	await ejectPackageScript('lint', 'aqu lint', 'eslint .', skipAllWarnings);
};
