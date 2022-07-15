import { readJson } from 'fs-extra';

import { deepMerge } from './deepMerge';

export const mergeFiles = async <T>(first: string, second: string): Promise<T> => {
	const [firstFile, secondFile] = await Promise.all([readJson(first), readJson(second)]);

	return deepMerge(firstFile, secondFile);
};
