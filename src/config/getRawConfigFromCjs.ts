import { getDefaultFromCjs } from "./getDefaultFromCjs";
import { RawTrwlOptions } from "../typings";

export const getRawConfigFromCjs = (path: string): RawTrwlOptions => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const config = require(path);
        return getDefaultFromCjs(config) as RawTrwlOptions;
    } catch (err) {
        throw new Error();
    }
};
