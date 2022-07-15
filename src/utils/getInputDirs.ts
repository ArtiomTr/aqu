import { parse } from 'path';

import uniq from 'lodash/uniq';

import { VerifiedAquOptions } from '../typings';

export const getInputDirs = (configs: Array<VerifiedAquOptions>) => {
    const dirs: string[] = [];

    configs.forEach((config) => dirs.push(...config.input.map((entrypoint) => parse(entrypoint).dir)));

    return uniq(dirs);
};
