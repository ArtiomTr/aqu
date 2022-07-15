import execa from 'execa';
import githubUsername from 'github-username';

export const getGithubUser = async () => {
	const [githubUser, email] = await Promise.all([
		execa('git', ['config', '--global', '--get', 'github.user'])
			.then((value) => value.stdout.trim())
			.catch(() => undefined),
		execa('git', ['config', '--global', '--get', 'user.email'])
			.then((value) => value.stdout.trim())
			.catch(() => undefined),
	]);

	if (githubUser) {
		return githubUser;
	} else if (email) {
		return await githubUsername(email).catch(() => undefined);
	}

	return undefined;
};
