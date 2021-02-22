import { canReadFile } from './canReadFile';

export const existsAny = async (
  pathArray: string[],
): Promise<string | undefined> => {
  const readableFiles = await Promise.all(
    pathArray.map((path) => canReadFile(path)),
  );

  return pathArray.find((_, index) => readableFiles[index]);
};
