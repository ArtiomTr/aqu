import { mergeWithCustomize } from "webpack-merge";

const customizedMerge = mergeWithCustomize({
    customizeArray: (_, b) => b,
});

export const deepMerge = <T>(
    firstObject: Partial<T> | undefined | Array<Partial<T> | undefined>,
    ...objects: Partial<T | undefined>[]
): T => {
    if (Array.isArray(firstObject) && objects.length === 0) {
        firstObject = firstObject.filter(Boolean);
    }

    objects = objects.filter(Boolean);

    return (customizedMerge(firstObject!, ...(objects as Array<Partial<T>>)) as unknown) as T;
};
