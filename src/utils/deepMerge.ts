import { mergeWithCustomize } from "webpack-merge";

export const deepMerge = mergeWithCustomize({
    customizeArray: (_, b) => b,
});
