import { ejectConfig } from './ejectConfig';
import { ejectPackageScript } from './ejectPackageScript';
import { createJestConfig } from '../config/createJestConfig';
import { VerifiedAquOptions } from '../typings';

export const ejectTest = async (configs: VerifiedAquOptions[]) => {
  await ejectConfig('jest.config.json', await createJestConfig(configs));
  await ejectPackageScript('test', 'aqu test', 'jest');
};
