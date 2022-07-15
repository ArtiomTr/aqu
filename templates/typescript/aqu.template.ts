import type { TemplateScript } from '../../src/typings';
import { getPackageVersion } from '../../src/utils/packageManager';

const templateScript: TemplateScript = {
	initialize: async (manager: string) => ({
		extend: '_base',
		filesToMergePaths: ['package.json', './example/package.json'],
		templateFilePaths: ['package.json', './example/tsconfig.json', './example/src/index.ts', './example/package.json'],
		customArgs: {
			['versions.typescript']: await getPackageVersion('typescript', manager),
			['versions.nodeTypes']: await getPackageVersion('@types/node', manager),
		},
	}),
};

export default templateScript;
