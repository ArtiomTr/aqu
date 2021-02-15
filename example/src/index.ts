import { ensureNumber } from "./ensureNumber";

export const sum = (a: unknown, b: unknown) => {
    ensureNumber(a);
    ensureNumber(b);

    return a + b;
};
