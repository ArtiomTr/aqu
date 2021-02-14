import { red } from "chalk";

export default function assert(condition: unknown, message: string): asserts condition {
    if (condition) {
        return;
    }

    if (!condition) {
        console.error(red(`Invariant: ${message}`));

        process.exit(1);
    }
}
