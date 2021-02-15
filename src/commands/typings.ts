import { VerifiedTrwlOptions } from "../typings";

export type TrwlCommand<T> = {
    name: string;
    description: string;
    action: (options: T, config: Array<VerifiedTrwlOptions>) => void | Promise<void>;
    options: Array<TrwlCommandOptions>;
};

export type TrwlCommandOptions = {
    flag: {
        full: string;
        short?: string;
        placeholder?: string;
    };
    multiple?: boolean;
    defaultValue?: string | boolean;
    description: string;
};
