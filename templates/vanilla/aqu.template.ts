import type { TemplateScript } from '../../src/typings';

const script: TemplateScript = {
    initialize: async () => ({
        extend: '_base',
        templateFilePaths: ['./example/src/index.js'],
    }),
};

export default script;
