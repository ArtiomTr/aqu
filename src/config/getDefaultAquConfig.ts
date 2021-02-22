import { join } from 'path';

import { DEFAULT_OPTIONS, ENTRYPOINT_EXTENSIONS } from '../constants';
import { AquOptions } from '../typings';
import { existsFileWithExtension } from '../utils/existsFileWithExtension';

export const getDefaultAquConfig = async (): Promise<Partial<AquOptions>> => {
  const defaultInput =
    (await existsFileWithExtension(
      join(process.cwd(), 'src', 'index'),
      ENTRYPOINT_EXTENSIONS,
    )) ||
    (await existsFileWithExtension(
      join(process.cwd(), 'lib', 'index'),
      ENTRYPOINT_EXTENSIONS,
    ));

  return { ...DEFAULT_OPTIONS, input: defaultInput };
};
