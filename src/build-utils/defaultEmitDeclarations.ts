import { CompilerOptions, createCompilerHost, createProgram } from "typescript";

export const defaultEmitDeclarations = (input: string[], dir: string) => {
    const options: CompilerOptions = {
        allowJs: true,
        declaration: true,
        emitDeclarationOnly: true,
        outDir: dir,
    };

    const host = createCompilerHost(options);

    const program = createProgram(input, options, host);

    program.emit();
};
