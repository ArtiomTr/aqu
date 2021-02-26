import { writeFileWithWarning } from '../utils/writeFileWithWarning';

export const ejectConfig = async (
  filename: string,
  config: unknown,
  skipWarning?: boolean,
) => {
  await writeFileWithWarning(
    filename,
    JSON.stringify(config, null, 2),
    skipWarning,
  );
};
