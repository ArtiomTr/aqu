import { mkdir, writeFile } from 'fs';
import { parse } from 'path';

export const safeWriteFile = (path: string, content: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		writeFile(path, content, (err) => {
			if (err) {
				mkdir(parse(path).dir, { recursive: true }, (err) => {
					if (err) {
						reject(err);
					} else {
						writeFile(path, content, (err) => {
							if (err) {
								reject(err);
							} else {
								resolve();
							}
						});
					}
				});
			} else {
				resolve();
			}
		});
	});
};
