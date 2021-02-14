import { join } from "path";

import { DEFAULT_OPTIONS, ENTRYPOINT_EXTENSIONS } from "../constants";
import { TrwlOptions } from "../typings";
import { existsFileWithExtension } from "../utils/existsFileWithExtension";

export const getDefaultConfig = async (): Promise<Partial<TrwlOptions>> => {
    const defaultInput =
        (await existsFileWithExtension(join(process.cwd(), "src", "index"), ENTRYPOINT_EXTENSIONS)) ||
        (await existsFileWithExtension(join(process.cwd(), "lib", "index"), ENTRYPOINT_EXTENSIONS));

    return { ...DEFAULT_OPTIONS, input: defaultInput };
};
