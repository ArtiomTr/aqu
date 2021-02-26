import { realpathSync } from 'fs';
import { resolve } from 'path';

const appDir = realpathSync(process.cwd());

export const appResolve = (...paths: string[]) => resolve(appDir, ...paths);
