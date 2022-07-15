import { canReadFile } from './canReadFile';
import { safeWriteFile } from './safeWriteFile';

export const lowPriorityWriteFile = async (filename: string, content: string) => {
	if (!(await canReadFile(filename))) {
		await safeWriteFile(filename, content);
	}
};
