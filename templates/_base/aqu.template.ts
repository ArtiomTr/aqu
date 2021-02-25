import type { TemplateScript } from '../../src/typings';
import { getPackageVersion } from '../../src/utils/packageManager';

const templateScript: TemplateScript = {
  initialize: async (manager: string) => ({
    templateFilePaths: [
      'package.json',
      './example/README.md',
      './example/package.json',
      'README.md',
    ],
    customArgs: {
      // TODO: replace with normal when published
      ['versions.aqu']: 'file:../..',
      // ["versions.aqu"]: packageVersion("aqu"),
      ['versions.np']: await getPackageVersion('np', manager),
      ['versions.lintStaged']: await getPackageVersion('lint-staged', manager),
      ['versions.husky']: await getPackageVersion('husky', manager),
      ['versions.sizeLimit']: await getPackageVersion('size-limit', manager),
      ['versions.sizeLimitPresetSmallLib']: await getPackageVersion(
        '@size-limit/preset-small-lib',
        manager,
      ),
    },
  }),
};

export default templateScript;
