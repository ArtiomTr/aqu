import { pathExists } from "fs-extra";

export const canReadFile = (path: string): Promise<boolean> => pathExists(path);
