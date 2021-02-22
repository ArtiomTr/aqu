import { getPackageScope } from '../create-utils/getPackageScope';

export const getDefaultRepo = (name: string, user: string | undefined) => {
  if (user) {
    return `https://github.com/${user}/${getPackageScope(name)}`;
  }

  return undefined;
};
