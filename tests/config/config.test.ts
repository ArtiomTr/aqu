import { loadAndResolveConfig } from "../../src/config/loadAndResolveConfig";

describe("loadAndResolveConfig", () => {
    it("should load json config", async () => {
        expect(await loadAndResolveConfig("./tests/config/trwl.single.json")).toStrictEqual([
            {
                input: "hello",
            },
        ]);
        expect(await loadAndResolveConfig("./tests/config/trwl.multiple.json")).toStrictEqual([
            {
                input: "hello",
            },
            {
                input: "2",
            },
        ]);
    });
    it("should load commonjs config", async () => {
        expect(await loadAndResolveConfig("./tests/config/trwl.single.cjs")).toStrictEqual([
            {
                input: "hello",
            },
        ]);
        expect(await loadAndResolveConfig("./tests/config/trwl.multiple.cjs")).toStrictEqual([
            {
                input: "hello",
            },
            {
                input: "2",
            },
        ]);
    });
    it("should transpile and load es config", async () => {
        expect(await loadAndResolveConfig("./tests/config/trwl.single.mjs")).toStrictEqual([
            {
                input: "hello",
            },
        ]);
        expect(await loadAndResolveConfig("./tests/config/trwl.multiple.mjs")).toStrictEqual([
            {
                input: "hello",
            },
            {
                input: "2",
            },
        ]);
    });
    it("should transpile and load typescript config", async () => {
        expect(await loadAndResolveConfig("./tests/config/trwl.single.ts")).toStrictEqual([
            {
                input: "hello",
            },
        ]);
        expect(await loadAndResolveConfig("./tests/config/trwl.multiple.ts")).toStrictEqual([
            {
                input: "hello",
            },
            {
                input: "2",
            },
        ]);
    });
});
