import { importAssertionsPlugin } from 'rollup-plugin-import-assert';
import { importAssertions } from 'acorn-import-assertions';
import styles from 'rollup-plugin-styles';
import browsersync from 'rollup-plugin-browsersync';
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
    styles({ minimize: false }),
    rollupPluginHTML({
      input: './**/*-iframe.html',
      rootDir: `${config.dist}/_site`,
      minify: false,
      extractAssets: false
    }),
    alias({ entries: config.aliases }),
    nodeResolve(),
    browsersync({ server: config.dist }),
  ],
  watch: {
    clearScreen: true,
  },
};
