export const insertArgs = (str: string, args: Record<string, unknown>) =>
    str.replace(/\${\s*(\S+)\s*}/g, (_, paramName) => args[paramName] as string);
