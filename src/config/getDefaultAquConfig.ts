import { DEFAULT_OPTIONS, ENTRYPOINT_EXTENSIONS } from '../constants';
import { AquOptions } from '../typings';
import { appResolve } from '../utils/appResolve';
import { existsFileWithExtension } from '../utils/existsFileWithExtension';

export const getDefaultAquConfig = async (): Promise<Partial<AquOptions>> => {
	const defaultInput =
		(await existsFileWithExtension(appResolve('src', 'index'), ENTRYPOINT_EXTENSIONS)) ||
		(await existsFileWithExtension(appResolve('lib', 'index'), ENTRYPOINT_EXTENSIONS));

	return { ...DEFAULT_OPTIONS, input: defaultInput };
};
