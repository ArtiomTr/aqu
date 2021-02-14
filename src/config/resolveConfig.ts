import { RawTrwlOptions, TrwlOptions } from "../typings";

export const resolveConfig = (rawConfig: RawTrwlOptions): Array<TrwlOptions> => {
    return Array.isArray(rawConfig) ? rawConfig : [rawConfig];
};
