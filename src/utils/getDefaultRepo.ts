import { getGithubUser } from "./getGithubUser";

export const getDefaultRepo = async (name: string) => {
    const user = await getGithubUser();

    if (user) {
        return `https://github.com/${user}/${name}`;
    }

    return undefined;
};
