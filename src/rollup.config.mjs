import { terser } from 'rollup-plugin-terser';
import { importAssertionsPlugin } from 'rollup-plugin-import-assert';
import { importAssertions } from 'acorn-import-assertions';
import styles from 'rollup-plugin-styles';
import nodeResolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import { rollupPluginHTML } from '@web/rollup-plugin-html';
import { getConfig } from './config.js';

const config = await getConfig();

export default {
  output: {
    dir: config.dist,
    sourcemap: false,
    format: 'esm',
    assetFileNames: '[name][extname]',
  },
  acornInjectPlugins: [importAssertions],
  plugins: [
    importAssertionsPlugin(),
    styles({ minimize: true }),
    rollupPluginHTML({
      input: './**/*.html',
      rootDir: `${config.dist}/_site`,
      minify: true,
      extractAssets: false
    }),
    alias({ entries: config.aliases }),
    nodeResolve(),
    terser({ output: { comments: false }, ecma: 2020, warnings: true, module: true, compress: { unsafe: true, passes: 2 } }),
  ]
};
