import { writeFileWithWarning } from '../utils/writeFileWithWarning';

export const ejectConfig = async (filename: string, config: unknown) => {
  await writeFileWithWarning(filename, JSON.stringify(config, null, 2));
};
