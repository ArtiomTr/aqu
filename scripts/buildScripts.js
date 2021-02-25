var fs = require('fs-extra');
var path = require('path');
var esbuild = require('esbuild');
const NodeResolve = require('@esbuild-plugins/node-resolve').default;

function main() {
  fs.readdir(path.join(__dirname, 'src')).then((paths) => {
    Promise.all(
      paths.map((pth) =>
        fs
          .stat(path.join(__dirname, 'src', pth))
          .then((stats) => stats.isFile() && path.extname(pth) === '.ts'),
      ),
    ).then((bools) => {
      var entryPoints = paths
        .filter((_, index) => bools[index])
        .map((entry) => path.join(__dirname, 'src', entry));
      esbuild.build({
        entryPoints,
        bundle: true,
        outdir: path.join(__dirname, 'dist'),
        platform: 'node',
        target: 'node10.16.0',
        plugins: [
          NodeResolve({
            extensions: ['.ts', '.js', '.tsx', '.jsx', '.cjs', '.mjs'],
            onResolved: (resolved) => {
              if (resolved.includes('node_modules')) {
                return {
                  external: true,
                };
              }
              return resolved;
            },
          }),
        ],
      });
    });
  });
}

main();
