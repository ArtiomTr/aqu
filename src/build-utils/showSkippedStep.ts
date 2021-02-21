import chalk from "chalk";

export const showSkippedStep = (label: string) => console.log(chalk.yellow("↓"), label, chalk.gray("skipped"));
