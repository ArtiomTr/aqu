export const getDefaultRepo = (name: string, user: string | undefined) => {
    if (user) {
        return `https://github.com/${user}/${name}`;
    }

    return undefined;
};
