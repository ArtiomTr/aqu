import { realpathSync } from 'fs';
import { resolve } from 'path';

export const appDir = realpathSync(process.cwd());

export const appResolve = (...paths: string[]) => resolve(appDir, ...paths);
