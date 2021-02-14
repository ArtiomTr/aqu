import { access, constants } from "fs";

export const canReadFile = (path: string): Promise<boolean> => {
    return new Promise((resolve) => {
        access(path, constants.R_OK, (err) => resolve(!err));
    });
};
