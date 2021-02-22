export const getPackageScope = (name: string) => {
  const matchResult = name.match(
    /^(?:@([a-z0-9-*~][a-z0-9-*._~]*)\/)?[a-z0-9-~][a-z0-9-._~]*$/,
  );

  if (!matchResult) {
    return name;
  }

  const [, scope] = matchResult;

  if (scope) {
    return scope;
  }

  return name;
};
