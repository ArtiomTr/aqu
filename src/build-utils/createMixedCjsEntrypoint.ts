import { join } from 'path';

import { getFolderFromPackageName } from '../create-utils/getFolderFromPackageName';
import { insertArgs } from '../utils/insertArgs';
import { safeWriteFile } from '../utils/safeWriteFile';

const cjsMixedEntrypoint = `'use strict'

if(process.env.NODE_ENV === 'production') {
    module.exports = require('./\${name}.cjs.production.min.js');
} else {
    module.exports = require('./\${name}.cjs.development.js');
}
`;

export const createMixedCjsEntrypoint = async (
  outdir: string,
  name: string,
) => {
  await safeWriteFile(
    join(outdir, 'index.js'),
    insertArgs(cjsMixedEntrypoint, { name: getFolderFromPackageName(name) }),
  );
};
