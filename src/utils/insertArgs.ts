export const insertArgs = (str: string, args: Record<string, unknown>) =>
	str.replace(/\${\s*((?:\w|\.)+)\s*}/g, (_, paramName) =>
		paramName in args ? (args[paramName] as string) : `$\{${paramName}}`,
	);
