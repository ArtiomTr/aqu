import { loadAndResolveAquConfig } from "./loadAndResolveAquConfig";
import { verifyConfig } from "./verifyConfig";
import { AquOptions } from "../typings";

export const loadConfigFromArguments = async (args: Record<string, unknown>) => {
    const config = await (loadAndResolveAquConfig(typeof args.config === "string" ? args.config : undefined) as Promise<
        Array<AquOptions>
    >);

    return Promise.all(config.map((cfg) => verifyConfig(cfg)));
};
