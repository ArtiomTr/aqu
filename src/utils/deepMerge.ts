import { mergeWithCustomize } from "webpack-merge";

export const deepMerge = mergeWithCustomize({
    customizeArray: (_, b) => b,
}) as <T>(firstObject: Partial<T> | Partial<T>[], ...objects: Partial<T>[]) => T;
