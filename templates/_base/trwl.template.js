import packageVersion from '../_utils/packageVersion';

/**
 * @type {import('../../src/typings').TemplateScript}
 */
const templateScript = {
    initialize: async () => ({
        templateFilePaths: [
            'package.json',
            './example/README.md',
            './example/package.json',
            'README.md',
        ],
        customArgs: {
            // TODO: replace with normal when published
            ['versions.trwl']: 'file:../..',
            // ["versions.trwl"]: packageVersion("trwl"),
            ['versions.np']: await packageVersion('np'),
            ['versions.lintStaged']: await packageVersion('lint-staged'),
            ['versions.husky']: await packageVersion('husky'),
            ['versions.sizeLimit']: await packageVersion('size-limit'),
            ['versions.sizeLimitPresetSmallLib']: await packageVersion(
                '@size-limit/preset-small-lib',
            ),
        },
    }),
};

export default templateScript;
