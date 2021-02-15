export function ensureNumber(value: unknown): asserts value is number {
    if (typeof value === "number") {
        return;
    }

    throw new Error(`Invariant: ${value} is not number.`);
}
