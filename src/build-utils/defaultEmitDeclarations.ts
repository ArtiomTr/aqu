import { dirname } from 'path';
import {
    CompilerOptions,
    createCompilerHost,
    createProgram,
    parseJsonConfigFileContent,
    readConfigFile,
    sys,
} from 'typescript';
import { ParseConfigHost } from 'typescript';

import { VerifiedAquOptions } from '../typings';
import { appResolve } from '../utils/appResolve';

const parseConfigHost: ParseConfigHost = {
    useCaseSensitiveFileNames: sys.useCaseSensitiveFileNames,
    readDirectory: sys.readDirectory,
    fileExists: sys.fileExists,
    readFile: sys.readFile,
};

export const defaultEmitDeclarations = async (config: VerifiedAquOptions): Promise<void> => {
    const { outdir, input, tsconfig, incremental } = config;

    const rawConfig = readConfigFile(tsconfig, sys.readFile);

    const specifiedTsconfig = parseJsonConfigFileContent(
        rawConfig.config,
        parseConfigHost,
        appResolve(dirname(tsconfig)),
        undefined,
        tsconfig,
    );

    const options: CompilerOptions = {
        ...specifiedTsconfig.options,
        incremental,
        declaration: true,
        emitDeclarationOnly: true,
        outDir: outdir,
        noEmit: false,
    };

    const host = createCompilerHost(options);

    const program = createProgram(input, options, host);

    program.emit();
};
