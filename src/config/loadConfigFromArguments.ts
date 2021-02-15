import { loadAndResolveTrwlConfig } from "./loadAndResolveTrwlConfig";
import { verifyConfig } from "./verifyConfig";
import { TrwlOptions } from "../typings";

export const loadConfigFromArguments = async (args: Record<string, unknown>) => {
    const config = await (loadAndResolveTrwlConfig(
        typeof args.config === "string" ? args.config : undefined
    ) as Promise<Array<TrwlOptions>>);

    return Promise.all(config.map((cfg) => verifyConfig(cfg)));
};
