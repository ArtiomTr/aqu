import execa from 'execa';

export const getAuthor = async () => {
  const arr = await Promise.all([
    execa('npm', ['config', 'get', 'init-author-name'])
      .then(({ stdout }) => stdout)
      .catch(() => undefined),
    execa('git', ['config', '--global', '--get', 'user.name'])
      .then(({ stdout }) => stdout)
      .catch(() => undefined),
  ]);

  return arr.find(Boolean);
};
