import { importAssertions } from 'acorn-import-assertions';
import nodeResolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import { rollupPluginHTML } from '@web/rollup-plugin-html';
import browsersync from 'rollup-plugin-browsersync';
import { minifyJavaScript } from './plugin-minify-javascript.mjs';
import { cssAssert } from './plugin-css-assert.mjs';
import { getConfig } from './config.js';

const userConfig = await getConfig();

export default ({ watch }) => {
  return {
    output: {
      dir: userConfig.dist,
      sourcemap: false,
      format: 'esm',
      assetFileNames: '[name][extname]'
    },
    acornInjectPlugins: [importAssertions],
    plugins: [
      alias({ entries: userConfig.aliases }),
      nodeResolve(),
      cssAssert({ minify: !watch }),
      rollupPluginHTML({
        input: `${userConfig.dist}/_site/*.html`,
        rootDir: `${userConfig.dist}/_site`,
        minify: !watch,
        extractAssets: false
      }),
      minifyJavaScript(),
      watch ? browsersync({ server: userConfig.dist }) : null
    ],
    watch: {
      clearScreen: true,
    }
  }
};
