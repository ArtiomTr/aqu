export const getDefaultFromCjs = (requiredModule: Record<string, unknown>) => {
	if (requiredModule.__esModule) {
		return requiredModule.default;
	} else {
		return requiredModule;
	}
};
