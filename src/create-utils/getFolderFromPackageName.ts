export const getFolderFromPackageName = (name: string) => {
    const matchResult = name.match(/^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?([a-z0-9-~][a-z0-9-._~]*)$/);

    if (!matchResult) {
        return name;
    }

    const [, packageName] = matchResult;

    if (packageName) {
        return packageName;
    }

    return name;
};
