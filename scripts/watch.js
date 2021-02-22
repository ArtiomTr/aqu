var buildOptions = require('./build').buildOptions;

require('esbuild')
  .build({
    ...buildOptions,
    watch: true,
  })
  .catch((error) => console.error(error));
