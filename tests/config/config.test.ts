import { loadAndResolveConfig } from "../../src/config/loadAndResolveConfig";
import { DEFAULT_OPTIONS } from "../../src/constants";

const singleConfig = [
    {
        ...DEFAULT_OPTIONS,
        input: "hello",
        name: "trwl",
    },
];

const multipleConfig = [
    {
        ...DEFAULT_OPTIONS,
        input: "hello",
        name: "trwl",
    },
    {
        ...DEFAULT_OPTIONS,
        input: "2",
        name: "trwl",
    },
];

describe("loadAndResolveConfig", () => {
    it("should load json config", async () => {
        expect(await loadAndResolveConfig("./tests/config/trwl.single.json")).toStrictEqual(singleConfig);
        expect(await loadAndResolveConfig("./tests/config/trwl.multiple.json")).toStrictEqual(multipleConfig);
    });
    it("should load commonjs config", async () => {
        expect(await loadAndResolveConfig("./tests/config/trwl.single.cjs")).toStrictEqual(singleConfig);
        expect(await loadAndResolveConfig("./tests/config/trwl.multiple.cjs")).toStrictEqual(multipleConfig);
    });
    it("should transpile and load es config", async () => {
        expect(await loadAndResolveConfig("./tests/config/trwl.single.mjs")).toStrictEqual(singleConfig);
        expect(await loadAndResolveConfig("./tests/config/trwl.multiple.mjs")).toStrictEqual(multipleConfig);
    });
    it("should transpile and load typescript config", async () => {
        expect(await loadAndResolveConfig("./tests/config/trwl.single.ts")).toStrictEqual(singleConfig);
        expect(await loadAndResolveConfig("./tests/config/trwl.multiple.ts")).toStrictEqual(multipleConfig);
    });
});
