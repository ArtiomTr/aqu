import { Linter } from 'eslint';

import { hasReact } from '../utils/hasReact';

export const createEslintConfig = async (): Promise<Linter.Config> => {
	const isReacted = await hasReact();

	const config: Linter.Config = {
		root: true,
		parser: '@typescript-eslint/parser',
		parserOptions: {
			ecmaVersion: 2020,
			sourceType: 'module',
			ecmaFeatures: {
				jsx: isReacted ? true : undefined,
			},
		},
		plugins: ['@typescript-eslint', 'simple-import-sort'],
		extends: [
			'eslint:recommended',
			'plugin:@typescript-eslint/eslint-recommended',
			'plugin:@typescript-eslint/recommended',
			'plugin:prettier/recommended',
		],
		rules: {
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-empty-interface': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/ban-types': 'off',
			'no-console': 'warn',
			'prettier/prettier': [
				'error',
				{
					endOfLine: 'auto',
				},
			],
			'simple-import-sort/imports': [
				'warn',
				{
					groups: [
						// Node.js builtins
						[
							'^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)',
						],
						// Packages
						[...(isReacted ? ['^react', '^react-dom', '^react-native'] : []), '^@?\\w'],
						// Side effect imports
						['^\\u0000'],
						// Parent imports
						['^src', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$', '^\\.\\.(?!/?$)', '^\\.\\./?$'],
						// Style imports
						isReacted && ['^.+\\.s?css$'],
					].filter(Boolean),
				},
			],
		},
	};

	if (isReacted) {
		config.settings = {
			react: {
				version: 'detect',
			},
		};

		config.rules!['react/prop-types'] = 'off';
		config.rules!['react/display-name'] = 'off';
	}

	return config;
};
