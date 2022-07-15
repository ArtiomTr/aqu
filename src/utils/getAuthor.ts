import execa from 'execa';

import { getPackageManager } from './packageManager';

export const getAuthor = async () => {
    const nameCandidates = await Promise.all([
        execa(await getPackageManager(), ['config', 'get', 'init-author-name'])
            .then(({ stdout }) => stdout)
            .catch(() => undefined),
        execa('git', ['config', '--global', '--get', 'user.name'])
            .then(({ stdout }) => stdout)
            .catch(() => undefined),
    ]);

    const name = nameCandidates.find((element) => element !== 'undefined' && Boolean(element));
    const email = await execa('git', ['config', '--global', '--get', 'user.email'])
        .then(({ stdout }) => stdout)
        .catch(() => undefined);

    return name ? (email ? `${name} <${email}>` : name) : '';
};
