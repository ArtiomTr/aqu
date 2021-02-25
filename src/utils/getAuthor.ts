import execa from 'execa';

import { getPackageManager } from './packageManager';

export const getAuthor = async () => {
  const arr = await Promise.all([
    execa(await getPackageManager(), ['config', 'get', 'init-author-name'])
      .then(({ stdout }) => stdout)
      .catch(() => undefined),
    execa('git', ['config', '--global', '--get', 'user.name'])
      .then(({ stdout }) => stdout)
      .catch(() => undefined),
  ]);

  return arr.find(Boolean);
};
