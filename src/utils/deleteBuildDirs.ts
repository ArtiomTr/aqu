import { resolve } from "path";

import uniq from "lodash/uniq";
import rimraf from "rimraf";

import logger from "../logger";
import { VerifiedTrwlOptions } from "../typings";

export const deleteBuildDirs = (configs: VerifiedTrwlOptions[]) => {
    const folders = uniq(configs.map((value) => resolve(value.outdir)));

    return Promise.all(
        folders.map(
            (folder) =>
                new Promise<void>((resolve) =>
                    rimraf(folder, (error) => {
                        if (error) {
                            logger.error(error);
                        }
                        resolve();
                    })
                )
        )
    );
};
