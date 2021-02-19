import chalk from "chalk";

import { steps } from "../messages.json";
import { DeclarationType } from "../typings";

export const showSkippedStep = (declaration: DeclarationType) => {
    if (declaration === "none") return;

    const label = declaration === "bundle" ? steps.dtsBundle : steps.dtsStandard;

    console.log(chalk.yellow("↓"), label, chalk.gray("skipped"));
};
