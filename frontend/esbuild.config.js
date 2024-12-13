const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  minify: true,
  sourcemap: false,
  target: ['es2020'],
  platform: 'browser',
  logLevel: 'info',
  preserveSymlinks: true,
  metafile: true,
}).catch(() => process.exit(1));