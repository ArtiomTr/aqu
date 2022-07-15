import { loadAndResolveAquConfig } from './loadAndResolveAquConfig';
import { verifyConfig } from './verifyConfig';
import { AquOptions } from '../typings';

export const loadConfigFromArguments = async (args: Record<string, unknown>) => {
    args['externalNodeModules'] = !args['noExternal'];
    delete args['noExternal'];

    const config = await (loadAndResolveAquConfig(typeof args.config === 'string' ? args.config : undefined) as Promise<
        Array<AquOptions>
    >);

    if (config.length === 0) {
        return Promise.all([verifyConfig(args as AquOptions)]);
    }

    return Promise.all(config.map((cfg) => verifyConfig({ ...cfg, ...args })));
};
