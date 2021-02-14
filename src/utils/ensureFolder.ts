import { access, mkdir } from "fs";

export const ensureFolder = (path: string): Promise<void> => {
    return new Promise((resolve, reject) =>
        access(path, (err) => {
            if (err) {
                mkdir(path, { recursive: true }, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        })
    );
};
