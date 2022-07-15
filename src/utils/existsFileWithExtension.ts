import { existsAny } from './existsAny';

export const existsFileWithExtension = (filePath: string, availableExtensions: string[]) => {
	return existsAny(availableExtensions.map((ext) => `${filePath}.${ext}`));
};
