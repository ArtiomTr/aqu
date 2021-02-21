import exec from "execa";
import githubUsername from "github-username";

export const getDefaultRepo = async (name: string) => {
    const [githubUser, email] = await Promise.all([
        exec("git", ["config", "--global", "--get", "github.user"])
            .then((value) => value.stdout.trim())
            .catch(() => undefined),
        exec("git", ["config", "--global", "--get", "user.email"])
            .then((value) => value.stdout.trim())
            .catch(() => undefined),
    ]);

    let normalUser: string | undefined = undefined;

    if (githubUser) {
        normalUser = githubUser;
    } else if (email) {
        normalUser = await githubUsername(email);
    }

    if (!normalUser) return undefined;

    return `https://github.com/${normalUser}/${name}`;
};
